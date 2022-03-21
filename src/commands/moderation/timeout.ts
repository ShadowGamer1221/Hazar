import { discordClient } from '../../main';
import { Guild, MessageEmbed, User } from 'discord.js';
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
import ms from 'ms';

class TimeoutCommand extends Command {
    constructor() {
        super({
            trigger: 'timeout',
            description: 'Timeouts a member.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'Who do you want to timeout?',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
              },
              {
                trigger: 'duration',
                description: 'How long do you want to timeout this member?',
                isLegacyFlag: false,
                required: true,
                type: 'String',
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

        let heremember = ctx.args['member'];
        heremember = heremember.replace("<","");
        heremember = heremember.replace("@","");
        heremember = heremember.replace("!","");
        heremember = heremember.replace(">","");
        const guildid = ctx.guild
        let time = ctx.args['duration'];

        const realmember = await ctx.guild.members.fetch(heremember) as GuildMember;


        const timeMs = ms(time)

        const successEmbed = new MessageEmbed()
        .setDescription(`**Success!** Successfully timeouted <@${heremember}>.\n**Duration:** ${time}.`)
        .setColor('GREEN')
        .setTimestamp();

        await ctx.reply({ embeds: [successEmbed] });

       await realmember.timeout(parseInt(timeMs),'No Reason');
    }
}

export default TimeoutCommand;