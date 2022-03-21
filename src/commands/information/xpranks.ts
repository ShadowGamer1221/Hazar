import { discordClient } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { groupBy } from 'lodash';
import {
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
    infoIconUrl,
    mainColor,
} from '../../handlers/locale';
import { MessageEmbed } from 'discord.js';
import { config } from '../../config';

class XpranksCommand extends Command {
    constructor() {
        super({
            trigger: 'xpranks',
            description: 'Gets a list of the xp ranks that you can earn with xp.',
            type: 'ChatInput',
            module: 'information',
            args: [],
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

        const embed = new MessageEmbed()
        .setAuthor(`XP Ranks`, infoIconUrl)
        .setColor(mainColor)
        .addFields(
            { name: `5 | Junior Receptionist`, value: `XP Needed: 100`, inline: true },
            { name: `6 | Receptionist`, value: `XP Needed: 200`, inline: true },
            { name: `7 | Senior Team Member`, value: `XP Needed: 500`, inline: true },
            { name: `8 | Staff Assistant`, value: `XP Needed: 900`, inline: true },
            { name: `9 | Head of Services`, value: `XP Needed: 1500`, inline: true },
            { name: `10 | Supervision Team`, value: `XP Needed: 2000`, inline: true },
            { name: `11 | Service Manager`, value: `XP Needed: 3000`, inline: true },
            { name: `12 | Assistant Manager`, value: `XP Needed: 5000`, inline: true },
            { name: `13 | General Manager`, value: `XP Needed: 6000`, inline: true },
            { name: `14 | Board of Directors`, value: `XP Needed: 7000`, inline: true },
            { name: `15 | Chief Staffing Officer`, value: `XP Needed: 8000`, inline: true },
            { name: `16 | Chief Operating Officer`, value: `XP Needed: 9000`, inline: true },
            { name: `[-] Chief Executive Officer`, value: `XP Needed: 10000`, inline: true },
            )
            .setTimestamp()

            ctx.reply({ embeds: [embed] });
    }
}

export default XpranksCommand;