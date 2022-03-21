import { discordClient } from '../../main';
import { MessageEmbed } from 'discord.js';
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

class StrikeCommand extends Command {
    constructor() {
        super({
            trigger: 'strike',
            description: 'Strikes a member',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'Who do you want to strike?',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
                },
                {
                    trigger: 'reason',
                    description: 'Reason for striking this member.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
                },
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

.setDescription('You did not provide anyone to strike!')
.setColor('RED');

const embed = new MessageEmbed()

.setDescription('You cannot strike this person as they are not in the server!')
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

const errorEmbed = new MessageEmbed()

.setDescription('Please enter a reason!')
.setColor('RED');

  let reason = ctx.args['reason']
  console.log(reason)
  if(!reason) return ctx.reply({ embeds: [errorEmbed] })

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor('GREEN')
.setDescription(`Successfully striked <@${member}>!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
  
  let warnembed = new MessageEmbed()
  .setDescription(`**Server:** ${ctx.guild.name}\n**Actioned by:** <@${ctx.user.id}>\n**Action:** Strike\n**Additional Information:** Hello <@${member}>, I'm here to inform you that you just got a strike from our Staffing Team. If you think this is a misstake please contact the <@900419463281774632>. Remind: After 3 strikes you will get an 7 day suspension.\n**Reason:** ${reason}`)
  .setColor('RED')
  .setTimestamp();
  
 await realMember.send({ embeds: [warnembed] });
    }
}

export default StrikeCommand;