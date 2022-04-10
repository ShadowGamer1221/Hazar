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
    getSuccessfulTrainingEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import Discord from 'discord.js';
 
class TrainingCommand extends Command {
    constructor() {
        super({
            trigger: 'training',
            description: 'Announces the training.',
            type: 'ChatInput',
            module: 'shout',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.shout,
                    value: true,
                }
            ]
        });
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

        try {
            await robloxGroup.updateShout(`Greetings! There is a training being hosted by ${robloxUser.name}. Join for a chance of being promoted!\n\n~| GAME LINK: https://www.roblox.com/games/8897440496/BETA-Eastside-Cafe-Hotels-Resorts\n\nsigned,\n${robloxUser.name}`);
            ctx.reply({ embeds: [ await getSuccessfulTrainingEmbed() ]});
            logAction('Training Announcement', ctx.user);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }

        const channelSend = await discordClient.channels.fetch('945372794651283536') as TextChannel;
        console.log(channelSend)


        const sugEmbed = new Discord.MessageEmbed()
                    .setColor(greenColor)
                    .setDescription(`Greetings! There is a training being hosted by ${robloxUser.name}. Join for a chance of being promoted!\n\n~| GAME LINK: https://www.roblox.com/games/8897440496/BETA-Eastside-Cafe-Hotels-Resorts\n\nsigned,\n${robloxUser.name}`)
                    .setTimestamp()
        
                const row = new Discord.MessageActionRow().addComponents(
        
                    new Discord.MessageButton()
                        .setCustomId("sug-acc")
                        .setStyle("DANGER")
                        .setLabel("Cancel Training"),

                        new Discord.MessageButton()
                        .setCustomId("sug-accsadadsdsa")
                        .setStyle("SUCCESS")
                        .setLabel("End Training"),

                        new Discord.MessageButton()
                        .setStyle("LINK")
                        .setLabel("Server")
                        .setURL("https://www.roblox.com/games/8897440496/BETA-Eastside-Cafe-Hotels-Resorts"),
        
                )
        
                const sugPage = await channelSend.send({ embeds: [sugEmbed], components: [row] })
        
                const col = await sugPage.createMessageComponentCollector({
                    componentType: "BUTTON"
                })
        
                col.on("collect", async i => {
        
                    const interactor = i.guild.members.cache.get(i.user.id)
        
                    if (!interactor.roles.cache.some(role => role.name === 'E | Shout Permissions')) return
        
                    if (i.customId === "sug-acc") {
                        
                        await channelSend.bulkDelete(2)

                        try {
                            await robloxGroup.updateShout(``);
                            logAction('Canceled Training', ctx.user);
                        } catch (err) {
                            console.log(err);
                        }
                    }

                if (i.customId === "sug-accsadadsdsa") {
        
                    await channelSend.bulkDelete(2)

                    try {
                        await robloxGroup.updateShout(``);
                        logAction('Finished Training', ctx.user);
                    } catch (err) {
                        console.log(err);
                    }
                }

                })

                let message = await channelSend.send({
                    content: '<@&945394793796747285>',
                    allowedMentions: { roles: ['945394793796747285'] },
                });

                
    }
}
 
export default TrainingCommand;
