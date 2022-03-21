import { discordClient } from '../../main';
import { MessageEmbed } from 'discord.js';
import { config } from '../../config';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { groupBy } from 'lodash';
import {
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
} from '../../handlers/locale';

class UserrolesCommand extends Command {
    constructor() {
        super({
            trigger: 'userroles',
            description: 'Gets the userroles from the member.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'The member that you want to get the roles from.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
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
      
      var strMemberId = ctx.args['member'];
      console.log(strMemberId)
      strMemberId = strMemberId.replace("<","");
      console.log(strMemberId)
      strMemberId = strMemberId.replace("@","");
      console.log(strMemberId)      
      strMemberId = strMemberId.replace("!","");
      console.log(strMemberId)
      strMemberId = strMemberId.replace(">","");
      console.log(strMemberId)

     const dizzyMember = await ctx.guild.members.fetch(strMemberId);
			 ctx.user;

    const whoisEmbed = new MessageEmbed() 
      .setTitle(`${dizzyMember.user.username}\'s Roles:`)
      .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
      .setThumbnail('https://cdn.discordapp.com/app-icons/880517850291388427/6730aad569eaaa559d79d744424311d6.png?size=2048')
      .setColor('#43d177')
      .setDescription(dizzyMember.roles.cache.map((role) => role.toString()).join('\n'))
      .setFooter('')
      .setTimestamp();
    ctx.reply({ embeds: [whoisEmbed] })
    }
}

export default UserrolesCommand;