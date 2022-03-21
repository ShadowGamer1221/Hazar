import { discordClient } from '../../main';
import { MessageEmbed } from 'discord.js';
import { TextChannel } from 'discord.js';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { GuildMember } from 'discord.js';
import { groupBy } from 'lodash';
import {
    checkIconUrl,
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
} from '../../handlers/locale';

class StatusCommand extends Command {
    constructor() {
        super({
            trigger: 'status',
            description: 'Edits the activity status.',
            type: 'ChatInput',
            module: 'bot',
            args: [
                {
                    trigger: 'type',
                    description: 'Values: PLAYING, STREAMING, LISTENING',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
              },
              {
                trigger: 'value',
                description: 'The description.',
                isLegacyFlag: false,
                required: true,
                type: 'String',
              },
              {
                trigger: 'url',
                description: 'The streaming URL.',
                isLegacyFlag: false,
                required: false,
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

const type = ctx.args['type'];
const value = ctx.args['value'];
let streamUrl = ctx.args['url'];
streamUrl = streamUrl.replace("'","");
streamUrl = streamUrl.replace("'","");

  const successEmbed = new MessageEmbed()
.setColor('GREEN')
.setAuthor(`Success!`, checkIconUrl)
.setDescription(`Successfully changed the activity status to ${type}. ${type} description: ${value}.`);

ctx.reply({ embeds: [successEmbed] });

discordClient.user.setActivity(value, {
    type: type,
    url: streamUrl,
});
    }
}

export default StatusCommand;