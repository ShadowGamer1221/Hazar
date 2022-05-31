import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
    infoIconUrl,
    mainColor,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';

import {
    Message,
    Interaction,
    ButtonInteraction,
    MessageButton,
    MessageButtonStyleResolvable,
    MessageActionRow,
    CommandInteraction,
    MessageEmbed,
} from 'discord.js';

class PromoteCommand extends Command {
    constructor() {
        super({
            trigger: 'promote',
            description: 'Promotes a user in the Roblox group.',
            type: 'ChatInput',
            module: 'ranking',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to promote?',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'reason',
                    description: 'If you would like a reason to be supplied in the logs, put it here.',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.ranking,
                    value: true,
                }
            ]
        });
    }

    addButton(messageData : any, id : string, label : string, style : MessageButtonStyleResolvable) {
        let components = messageData.components || [];
        let newComponent = new MessageActionRow().addComponents(new MessageButton().setCustomId(id).setLabel(label).setStyle(style));
        components.push(newComponent);
        messageData.components = components;
    }

    async run(ctx: CommandContext) {
        let robloxUser: User | PartialUser;
        try {
            robloxUser = await robloxClient.getUser(ctx.args['roblox-user'] as number);
        } catch (err) {
            try {
                const robloxUsers = await robloxClient.getUsersByUsernames([ ctx.args['roblox-user'] as string ]);
                if(robloxUsers.length === 0) throw new Error();
                robloxUser = robloxUsers[0];
            } catch (err) {
                try {
                    const idQuery = ctx.args['roblox-user'].replace(/[^0-9]/gm, '');
                    const discordUser = await discordClient.users.fetch(idQuery);
                    const linkedUser = await getLinkedRobloxUser(discordUser.id, ctx.guild.id);
                    if(!linkedUser) throw new Error();
                    robloxUser = linkedUser;
                } catch (err) {
                    return ctx.reply({ embeds: [ getInvalidRobloxUserEmbed() ]});
                }
            }
        }

        let robloxMember: GroupMember;
        try {
            robloxMember = await robloxGroup.getMember(robloxUser.id);
            if(!robloxMember) throw new Error();
        } catch (err) {
            return ctx.reply({ embeds: [ getRobloxUserIsNotMemberEmbed() ]});
        }

        const groupRoles = await robloxGroup.getRoles();
        const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
        let role = groupRoles[currentRoleIndex + 1];
        if(!role) return ctx.reply({ embeds: [ getNoRankAboveEmbed() ]});
        if(role.rank > config.maximumRank || robloxMember.role.rank > config.maximumRank) return ctx.reply({ embeds: [ getRoleNotFoundEmbed() ] });

        if(config.verificationChecks) {
            const actionEligibility = await checkActionEligibility(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if(!actionEligibility) return ctx.reply({ embeds: [ getVerificationChecksFailedEmbed() ] });
        }

        if(config.database.enabled) {
            const userData = await provider.findUser(robloxUser.id.toString());
            if(userData.suspendedUntil) return ctx.reply({ embeds: [ getUserSuspendedEmbed() ] });
        }


            let oldRole = role.name;
            for(let i = currentRoleIndex; i < groupRoles.length; i++) {
                role = groupRoles[i + 1];
                if(!role) return ctx.reply({ embeds: [ getNoRankAboveEmbed() ]});
                if(role.rank > config.maximumRank) continue;
                break;
            }

            const idkhow = new MessageEmbed()
            .setAuthor("Are You Sure?", infoIconUrl)
            .setDescription(`Are you sure that you want to promote **${ctx.args['roblox-user']}** to **${role.name}** with the reason \`${ctx.args['reason'] || 'No Reason Given'}\`?`)
            .setColor(mainColor);



            let msgData = { embeds: [idkhow], components: [] };
            this.addButton(msgData, "continueButton", "Continue", "SUCCESS");
            this.addButton(msgData, "cancelButton", "Cancel", "DANGER");
            let msg = await ctx.reply(msgData) as Message;
            const filter = (filterInteraction : Interaction) => {
                if(!filterInteraction.isButton()) return false;
                if(filterInteraction.user.id !== ctx.user.id) return false;
                return true;
            }

            const canceledEmbed = new MessageEmbed()
            .setAuthor("Cancelled", infoIconUrl)
            .setColor(mainColor)
            .setDescription("You've successfully cancelled this action");


            const componentCollector = (msg as Message).createMessageComponentCollector({filter: filter, time: 60000, max: 1});
            componentCollector.on('end', async collectedButtons => {
                if(collectedButtons.size === 0) {
                    if(ctx.subject instanceof CommandInteraction) {
                        msg = await (ctx.subject as CommandInteraction).editReply({ embeds: [canceledEmbed] }) as Message;
                    } else {
                        msg = await (msg as Message).edit({ embeds: [canceledEmbed] });
                        for(let i = 0; i < msg.components.length; i++) {
                            msg.components[i].components[0].setDisabled(true);
                        }
                        msgData = { embeds: [...msg.embeds], components: [...msg.components] };
                        if(ctx.subject instanceof CommandInteraction) {
                            await (ctx.subject as CommandInteraction).editReply(msgData);   
                        } else {
                            await msg.edit(msgData);
                        }
                    }
                    return;
                }
                let button = [...collectedButtons.values()][0] as ButtonInteraction;
                if(button.customId === "continueButton") {
                    try {
                        await robloxGroup.updateMember(robloxUser.id, role.id);
                        if(ctx.subject instanceof CommandInteraction) {
                            msg = await (ctx.subject as CommandInteraction).editReply({ embeds: [ await getSuccessfulPromotionEmbed(robloxUser, role.name) ]}) as Message;
                        } else {
                            msg = await (msg as Message).edit({ embeds: [ await getSuccessfulPromotionEmbed(robloxUser, role.name) ]})
                        }
                        logAction('Promote', ctx.user, ctx.args['reason'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
                    } catch (err) {
                        console.log(err);
                        if(ctx.subject instanceof CommandInteraction) {
                            msg = await (ctx.subject as CommandInteraction).editReply({ embeds: [ getUnexpectedErrorEmbed() ]}) as Message;
                        } else {
                            msg = await (msg as Message).edit({ embeds: [ getUnexpectedErrorEmbed() ]});
                        }
                    }
                } else {
                    if(ctx.subject instanceof CommandInteraction) {
                        msg = await (ctx.subject as CommandInteraction).editReply({ embeds: [canceledEmbed] }) as Message;
                    } else {
                        msg = await (msg as Message).edit({ embeds: [canceledEmbed] });
                    }
                }
                await button.reply({content: "ㅤ"});
                await button.deleteReply();
                for(let i = 0; i < msg.components.length; i++) {
                    msg.components[i].components[0].setDisabled(true);
                }
                msgData = { embeds: [...msg.embeds], components: [...msg.components] };
                if(ctx.subject instanceof CommandInteraction) {
                    await (ctx.subject as CommandInteraction).editReply(msgData);   
                } else {
                    await msg.edit(msgData);
                }
                return;
            });
    }
}

export default PromoteCommand;