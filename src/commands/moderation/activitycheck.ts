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
        channelSend = await discordClient.channels.fetch('949680416447660044') as TextChannel;
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
   .setTitle('**<:HazarCafeLogo:961960151340961802> | ACTIVITY CHECK**')
   .setDescription('It’s time for our weekly activity check! I ask for all MRs+ to interact with this message when it is viewed.\n\nI pay very close attention to the activity checks, and sometimes I may even promote!')
   .setColor('#43d177')
   .setFooter('Note: If you not react in 72 hours you will get an strike')
   .setTimestamp()
let message389789 = await channelSend.send({ embeds: [e] })
await message389789.react('<:HazarCafeLogo:961960151340961802>');

    const successEmbed = new MessageEmbed()
    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
    .setDescription(`**Success!** Successfully announced the activity check.`)
    .setColor('#43d177')

    ctx.reply({ embeds: [successEmbed] })

   let message86687 = await channelSend.send({
        content: '<@&949000387371880448> <@&949000411325530122> <@&949000435509915648> <@&948971207821230111> <@&950813346188374076>',
        allowedMentions: { roles: ['949000387371880448', '949000411325530122', '949000435509915648', '948971207821230111', '950813346188374076'] },
    });
    }
    }
 
export default ActivitycheckCommand;
