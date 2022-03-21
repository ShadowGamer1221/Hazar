import { CommandContext } from '../../structures/addons/CommandAddons';
import { discordClient, robloxClient, robloxGroup } from '../../main';
import { Command } from '../../structures/Command';
import { checkIconUrl, getInvalidRobloxUserEmbed, getNoRankAboveEmbed, getPromotionRequestEmbed, getRobloxUserIsNotMemberEmbed, getRoleListEmbed, getRoleNotFoundEmbed, getSuccessfulRequestEmbed, getUnexpectedErrorEmbed, getUserSuspendedEmbed, getVerificationChecksFailedEmbed, greenColor, infoIconUrl, redColor } from '../../handlers/locale';
import { config } from '../../config';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { TextChannel } from 'discord.js';
import {
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageButtonStyleResolvable,
    Interaction,
    ButtonInteraction,
    CommandInteraction
} from 'discord.js';
import { createVoidZero } from 'typescript';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import Discord from 'discord.js';
import { DatabaseUser } from '../../structures/types';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { provider } from '../../database/router';



class PromoteRequestCommand extends Command {
    constructor() {
        super({
            trigger: 'pr',
            description: 'Sends a promotion request to an admin for approval',
            type: 'ChatInput',
            module: 'Ranking',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'The username that you want to request a promotion.',
                    autocomplete: true,
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
                 },
                {
                    trigger: 'reason',
                    description: 'Reason for requesting this promotion.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
              }
            ],
        });
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

        let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch(config.requestChannel) as TextChannel;
        console.log(channelSend)

        let user = ctx.args['roblox-user'];
        console.log(user)

    let reason = ctx.args['reason'];
    console.log(reason)
        
                const sugEmbed = new Discord.MessageEmbed()
                    .setColor("#00FFFF")
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("New Promotion Request!")
                    .setDescription(`The Member **${ctx.user.tag}** has requested a promotion on **${user}**!`)
                    .addFields(
                        { name: "Username:", value: `${robloxUser.name}`, inline: true},
                        { name: "Current Rank:", value: `${robloxMember.role.name} (${robloxMember.role.rank})`, inline: true},
                        { name: "Reason:", value: `${reason}`, inline: true}
                    )
                    .setFooter(`Requested by ${ctx.user.tag}`)
                    .setTimestamp()
        
                const row = new Discord.MessageActionRow().addComponents(
        
                    new Discord.MessageButton()
                        .setCustomId("sug-acc")
                        .setStyle("SUCCESS")
                        .setLabel("Accept"),

                        new Discord.MessageButton()
                        .setCustomId("sug-accsadadsdsa")
                        .setStyle("DANGER")
                        .setLabel("Decline"),
        
                )

                const row2 = new Discord.MessageActionRow().addComponents(

                    new Discord.MessageButton()
                    .setCustomId("sug-accgg")
                    .setStyle("SUCCESS")
                    .setDisabled()
                    .setLabel("Accept"),

                    new Discord.MessageButton()
                    .setCustomId("sug-accasd")
                    .setDisabled()
                    .setStyle("DANGER")
                    .setLabel("Decline"),
        
                )

                const submittedEmbed = new MessageEmbed()
                .setDescription(`Successfully requested a promotion on ${robloxUser.name}.`)
                .setAuthor(`Success!`, checkIconUrl)
                .setColor('GREEN')
        
                ctx.reply({ embeds: [submittedEmbed] })
        
                const sugPage = await channelSend.send({ embeds: [sugEmbed], components: [row] })
        
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

                    const asdasds = await robloxGroup.updateMember(robloxUser.id, role.id);
                    console.log(`blbaasd`, asdasds)
        
                    if (i.customId === "sug-acc") {
        
                        const accEmbed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("**Promotion Request Accepted!**")
                            .setDescription(`Your promotion request on **${user}** with the reason **${reason}** has been accepted by <@${i.user.id}>`)
                            .addFields([
                                { name: "Accepted by:", value: `<@${i.user.id}>`, inline: true },
                                { name: "Accepted in:", value: `${i.guild.name}`, inline: true },
                            ])
                            .setTimestamp()
                            .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
    
                            try {
                                asdasds
                                logAction('Promote', ctx.user, ctx.args['reason'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
                            } catch (err) {
                                console.log(err);
                            }

        
                       await ctx.user.send({ embeds: [accEmbed] }).catch(err => {
        
                            if (err.code !== 50007) return console.log(err)
        
                        })
           
                    }

                if (i.customId === "sug-acc") {
        
                        const accEmbed1 = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                        .setTitle("Promotion Request Accepted!")
                        .setDescription(`Promotion request on ${user} has been accepted by ${i.user.username}`)
                        .setFooter(`Requested by ${ctx.user.tag}`)
                        .setTimestamp()

                            await logAction(`Promotion Request Accepted\n**Username:** ${user}\n**Reason:** ${ctx.args['reason']}`, ctx.user);
        
                        sugPage.edit({ embeds: [accEmbed1], components: [row2] })

                }

                if (i.customId === "sug-accsadadsdsa") {

                    const handledEmbed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("**Promotion Request Declined!**")
                    .setDescription(`Your promotion request on **${user}** with the reason **${reason}** has been declined by <@${i.user.id}>`)
                    .addFields([
                        { name: "Declined by:", value: `<@${i.user.id}>`, inline: true },
                        { name: "Declined in:", value: `${i.guild.name}`, inline: true },
                    ])
                    .setTimestamp()
                    .setThumbnail(ctx.guild.iconURL({ dynamic: true }))

               await ctx.user.send({ embeds: [handledEmbed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })
                }

                if (i.customId === "sug-accsadadsdsa") {

                    const accEmbed2 = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`Promotion Request Declined`)
                        .setDescription(`Promotion request on ${user} has been declined by <@${i.user.id}>`)
                        .setFooter(`Requested by ${ctx.user.tag}`)
                        .setTimestamp()

                            await logAction(`Promotion Request Declined\n**Username:** ${user}\n**Rank:** ${robloxMember.role.name} (${robloxMember.role.rank})\n**Reason:** ${ctx.args['reason']}`, ctx.user);
        
                        sugPage.edit({ embeds: [accEmbed2], components: [row2] })

                }

            })

    }
}

export default PromoteRequestCommand;