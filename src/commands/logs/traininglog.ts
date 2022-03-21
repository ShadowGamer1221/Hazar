import { discordClient, robloxClient, robloxGroup } from '../../main';
import { ButtonInteraction, CommandInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageButtonStyleResolvable, TextChannel } from 'discord.js';
import { GetGroupRoles } from 'bloxy/src/client/apis/GroupsAPI';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
    checkIconUrl,
    mainColor,
    infoIconUrl,
    xmarkIconUrl,
    redColor,
    greenColor,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import Discord from 'discord.js';
 
class TraininglogCommand extends Command {
    constructor() {
        super({
            trigger: 'traininglog',
            description: 'Logs a training.',
            type: 'ChatInput',
            module: 'logs',
            args: [
              {
                    trigger: 'people-promoted',
                    description: 'Number of people promoted.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'Number',
              },
              {
                trigger: 'time',
                description: 'When did you hosted the training?',
                isLegacyFlag: false,
                required: true,
                type: 'String',
              }
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.shout,
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
                    const idQuery = ctx.user;
                    const discordUser = await discordClient.users.fetch(idQuery);
                    const linkedUser = await getLinkedRobloxUser(discordUser.id, ctx.guild.id);
                    console.log(linkedUser)
                    if(!linkedUser) throw new Error();
                    robloxUser = linkedUser;
                } catch (err) {
                    return ctx.reply({ embeds: [ getInvalidRobloxUserEmbed() ]});
                }

        let robloxMember: GroupMember;
        try {
            robloxMember = await robloxGroup.getMember(robloxUser.id);
            if(!robloxMember) throw new Error();
        } catch (err) {
            return ctx.reply({ embeds: [ getRobloxUserIsNotMemberEmbed() ]});
        }

        if(config.database.enabled) {
            const userData = await provider.findUser(robloxUser.id.toString());
            if(userData.suspendedUntil) return ctx.reply({ embeds: [ getUserSuspendedEmbed() ] });
        }

        const timeOfTraining = ctx.args['time'];
        console.log(timeOfTraining)

        const peoeplePromtoted = ctx.args['people-promoted'];
        console.log(peoeplePromtoted)

            const idkhow = new MessageEmbed()
            .setAuthor("Is This Correct?", infoIconUrl)
            .addFields(
                { name: "User:", value: `${robloxUser.name}`, inline: true},
                { name: "Time:", value: `${timeOfTraining}`, inline: true},
                { name: "Number of people promoted:", value: `${peoeplePromtoted}`, inline: true}
            )
            .setColor(mainColor);

            const successLogedEmbed = new MessageEmbed()
            .setAuthor(`Success!`, checkIconUrl)
            .setColor(greenColor)
            .setDescription(`Successfully logged the training!`)
            .setTimestamp();

            const traininglogEmbed = new MessageEmbed()
            .setAuthor("Training Log", infoIconUrl)
            .addFields(
                { name: "User:", value: `${robloxUser.name}`, inline: true},
                { name: "Time:", value: `${timeOfTraining}`, inline: true},
                { name: "Number of people promoted:", value: `${peoeplePromtoted}`, inline: true}
            )
            .setColor(mainColor);

            let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945388734696800415') as TextChannel;
        console.log(channelSend)



            let msgData = { embeds: [idkhow], components: [] };
            this.addButton(msgData, "continueButton", "Yes", "SUCCESS");
            this.addButton(msgData, "cancelButton", "No", "DANGER");
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
                        if(ctx.subject instanceof CommandInteraction) {
                            msg = await (ctx.subject as CommandInteraction).editReply({ embeds: [ await successLogedEmbed ]}) as Message;
                        } else {
                            msg = await (msg as Message).edit({ embeds: [ await successLogedEmbed ]})
                        }
                        await channelSend.send({ embeds: [traininglogEmbed] })
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
 
export default TraininglogCommand;