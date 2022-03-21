import { discordClient } from '../../main';
import { MessageEmbed } from 'discord.js';
import { TextChannel } from 'discord.js';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { GuildMember } from 'discord.js';
import { groupBy } from 'lodash';
import {
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
} from '../../handlers/locale';

class ActivewinnerCommand extends Command {
    constructor() {
        super({
            trigger: 'activewinner',
            description: 'Announced the activity check winner.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'Who do you want to strike?',
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


const nothing = ctx.member as GuildMember

const nothingEmbed = new MessageEmbed()

.setDescription('You did not provide anyone!')
.setColor('RED');

const embed = new MessageEmbed()

.setDescription('You cannot let this person win as they are not in the server!')
.setColor('RED');

  let member = ctx.args['member']
      member = member.replace("<","");
      member = member.replace("@","");
      member = member.replace("!","");
      member = member.replace(">","");
  console.log(member)
        if(!member) return ctx.reply({ embeds: [nothingEmbed] })
        if(!member) return ctx.reply({ embeds: [embed] })

        const guild = ctx.guild

        const realMember = await guild.members.fetch(member)

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('909397619237859369') as TextChannel;

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor('GREEN')
.setDescription(`Successfully announced the winner <@${member}> in ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
  
  let warnembed = new MessageEmbed()
  .setDescription(`Hello ${realMember},\n\nI\'m here to let you know that you won the activity check in ${channelSend}. If you aren\'t ranked in 24 hours, DM <@${nothing.id}> or <@900419463281774632>.`)
  .setColor('GREEN')
  .setTimestamp();
  
 await realMember.send({ embeds: [warnembed] });

    let message86687 = await channelSend.send({
        content: `Congrats <@${member}> for winning the activity check!`,
        allowedMentions: { users: [`${member}`] },
    });
    }
}

export default ActivewinnerCommand;