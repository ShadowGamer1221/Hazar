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
 
class ActivitycheckCommand extends Command {
    constructor() {
        super({
            trigger: 'activitycheck',
            description: 'Announced the activity check.',
            type: 'ChatInput',
            module: 'moderation',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.admin,
                    value: true,
                }
            ]
        });
    }
 
    async run(ctx: CommandContext) {

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945383367556354078') as TextChannel;
        console.log(channelSend)
            let user = ctx.args['roblox-user'];
            console.log(user)

     var strMemberId = ctx.user.id
      strMemberId = strMemberId.replace("<","");
      strMemberId = strMemberId.replace("@","");
      strMemberId = strMemberId.replace("!","");
      strMemberId = strMemberId.replace(">","");

     const dizzyMember = await ctx.guild.members.fetch(strMemberId);
     console.log(dizzyMember)

   const e = new MessageEmbed()
   .setTitle('**<:eastside:866583276201574410> | ACTIVITY CHECK**')
   .setDescription('It’s time for our weekly activity check! I ask for all MRs+ to interact with this message when it is viewed.\n\nI pay very close attention to the activity checks, and sometimes I may even promote!')
   .setColor('#43d177')
   .setFooter('Note: If you not react in 72 hours you will get an strike')
   .setTimestamp()
let message389789 = await channelSend.send({ embeds: [e] })
await message389789.react('<:eastside:866583276201574410>');

    const successEmbed = new MessageEmbed()
    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
    .setDescription(`**Success!** Successfully announced the activity check.`)
    .setColor('#43d177')

    ctx.reply({ embeds: [successEmbed] })

   let message86687 = await channelSend.send({
        content: '<@&945364001523638282> <@&945364076626853928> <@&945364153919488000> <@&945364146470400060>',
        allowedMentions: { roles: ['945364001523638282', '945364076626853928', '945364153919488000', '945364146470400060'] },
    });
    }
    }
 
export default ActivitycheckCommand;
