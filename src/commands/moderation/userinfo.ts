import { discordClient } from '../../main';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { config } from '../../config';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { groupBy } from 'lodash';
import {
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
} from '../../handlers/locale';

class UserinfoCommand extends Command {
    constructor() {
        super({
            trigger: 'userinfo',
            description: 'Gets the userinfo from the member.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'The member that you want to get the info from.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
              }
            ],
          
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
      
      
      var strMemberId = ctx.args['member'];
      strMemberId = strMemberId.replace("<","");
      strMemberId = strMemberId.replace("@","");
      strMemberId = strMemberId.replace("!","");
      strMemberId = strMemberId.replace(">","");

     const dizzyMember = await ctx.guild.members.fetch(strMemberId);
     console.log(dizzyMember)
			 

      const guild = ctx.guild;


		const respose = new MessageEmbed()
.setColor('GREEN')
.setAuthor(dizzyMember.user.tag, dizzyMember.user.displayAvatarURL())
.setImage(dizzyMember.user.displayAvatarURL({dynamic: true, size: 2048}))
.addField("#️⃣ Discriminator:", `${dizzyMember.user.discriminator}`)
.addField("🆔 ID:", `${strMemberId}`)
.addField("Nickname:", `${dizzyMember.nickname !== null ? `${dizzyMember.nickname}` : 'None'}`)
.addField("Joined The Server On:", `${new Date(dizzyMember.joinedTimestamp).toLocaleDateString()}`, true)
.addField("Avatar link:", `[Click Here](${dizzyMember.user.displayAvatarURL()})`)
.addField("Account Created On:", `${new Date(dizzyMember.user.createdTimestamp).toLocaleDateString()}`, true)
.addField("Roles:", `${dizzyMember.roles.cache.map((role) => role.toString()).join(" ").replace("@everyone", " ") || "None"}`)

await ctx.reply({ embeds: [respose], ephemeral: true });
    }
}

export default UserinfoCommand;