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

class RestartCommand extends Command {
    constructor() {
        super({
            trigger: 'restart',
            description: 'Restarts the bot server.',
            type: 'ChatInput',
            module: 'bot',
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

  const successEmbed = new MessageEmbed()
.setColor('GREEN')
.setDescription(`**Restarting Server...**`)

ctx.reply({ embeds: [successEmbed] });
 process.exit();
    }
}

export default RestartCommand;