import { discordClient, robloxClient, robloxGroup } from '../../main';
import { TextChannel } from 'discord.js';
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
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import Discord from 'discord.js';
 
class SuggestCommand extends Command {
    constructor() {
        super({
            trigger: 'suggest',
            description: 'Sends your suggestion into the suggestion channel.',
            type: 'ChatInput',
            module: 'bot',
            args: [
              {
                    trigger: 'suggestion',
                    description: 'Your suggestion.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
              }
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.verified,
                    value: true,
                }
            ]
        });
    }
 
    async run(ctx: CommandContext) {

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945372048493006949') as TextChannel;
        console.log(channelSend)
        
                const query = ctx.args['suggestion']
        
                const sugEmbed = new Discord.MessageEmbed()
                    .setColor("#00FFFF")
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("New Suggestion")
                    .setDescription(`${query}`)
                    .setFooter(`Status: Pending`)
                    .setTimestamp()
        
                const row = new Discord.MessageActionRow().addComponents(
        
                    new Discord.MessageButton()
                        .setCustomId("sug-acc")
                        .setStyle("SUCCESS")
                        .setLabel("ACCEPT"),
        
                    new Discord.MessageButton()
                        .setCustomId("sug-dec")
                        .setStyle("DANGER")
                        .setLabel("DECLINE"),
        
                )

                const submittedEmbed = new MessageEmbed()
                .setDescription(`**Success!** Your suggestion is submitted here: ${channelSend}`)
                .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
                .setColor('GREEN')
        
                ctx.reply({ embeds: [submittedEmbed] })
        
                const sugPage = await channelSend.send({ embeds: [sugEmbed], components: [row] })

                await sugPage.react('✅')
                await sugPage.react('❌')
        
                const col = await sugPage.createMessageComponentCollector({
                    componentType: "BUTTON"
                })
        
                col.on("collect", async i => {

                    const noPerms = new MessageEmbed()
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
                    .setDescription('You don\'t have permissions to do that!')
                    .setColor('RED')
                    .setTimestamp()
        
                    const interactor = i.guild.members.cache.get(i.user.id)
        
                    if (!interactor.permissions.has("MANAGE_GUILD")) return
        
                    if (i.customId === "sug-acc") {
        
                        const accEmbed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("**Suggestion Accepted**")
                            .setDescription(`Your suggestion on **${query}** has been accepted by <@${i.user.id}>`)
                            .addFields([
                                { name: "Accepted by:", value: `<@${i.user.id}>`, inline: true },
                                { name: "Accepted in:", value: `${i.guild.name}`, inline: true },
                            ])
                            .setTimestamp()
                            .setFooter(`Accepted`)
                            .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
        
                       await ctx.user.send({ embeds: [accEmbed] }).catch(err => {
        
                            if (err.code !== 50007) return console.log(err)
        
                        })
        
                        col.stop("accepted")
        
                    } else if (i.customId === "sug-dec") {
        
                        const decEmbed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setTitle("**Suggestion Desclined**")
                            .setDescription(`Your suggestion on **${query}** has been declined by <@${i.user.id}>`)
                            .addFields([
                                { name: "Declined by:", value: `<@${i.user.id}>`, inline: true },
                                { name: "Declined in:", value: `${i.guild.name}`, inline: true },
                            ])
                            .setFooter("Declined")
                            .setTimestamp()
                            .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
        
                        ctx.user.send({ embeds: [decEmbed] }).catch(err => {
        
                            if (err.code !== 50007) return console.log(err)
        
                        })
        
                        col.stop("declined")
        
                    }
        
                })
        
                col.on("end", async (collected, reason) => {
        
                    if (reason === "accepted") {
        
                        const accEmbed1 = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("**Suggestion Accepted**")
                            .setDescription(`${query}`)
                            .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                            .setFooter(`Status: Accepted`)
                            .setTimestamp()

                            await sugPage.reactions.removeAll()

                            await logAction(`Suggestion Accepted\n**Suggestion:** ${query}`, ctx.user);
        
                        sugPage.edit({ embeds: [accEmbed1], components: [] })
        
                    } else if (reason === "declined") {
        
                        const decEmbed1 = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setTitle("**Suggestion Declined**")
                            .setDescription(`${query}`)
                            .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                            .setFooter(`Status: Declined`)
                            .setTimestamp()

                            await sugPage.reactions.removeAll()

                           await logAction(`Suggestion Declined\n**Suggestion:** ${query}`, ctx.user);
        
                     sugPage.edit({ embeds: [decEmbed1], components: [] })
        
                    }
        
                })

    

}
}
 
export default SuggestCommand;