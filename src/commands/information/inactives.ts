import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulUnsuspendEmbed,
    getUnexpectedErrorEmbed,
    getVerificationChecksFailedEmbed,
    getRoleNotFoundEmbed,
    getNotSuspendedEmbed,
    getAlreadySuspendedEmbed,
    noSuspendedRankLog,
    mainColor,
} from '../../handlers/locale';
import { config } from '../../config';
import { provider } from '../../database/router';
import { MessageEmbed } from 'discord.js';


class InactivesCommand extends Command {
    constructor() {
        super({
            trigger: 'inactives',
            description: 'Allows the viewing of all concurrent inactive players.',
            type: 'ChatInput',
            module: 'information',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.ranking,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        if(!config.database.enabled) return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ] });
        let isThere;
        const inactives = await provider.findInactiveUsers();
        let mainEmbed = new MessageEmbed();
        mainEmbed.setTimestamp();
        mainEmbed.setColor(mainColor);
        mainEmbed.setTitle('Current Inactive');
        for (var i in inactives) {
            isThere = true;
            const user = await robloxClient.getUser(inactives[i].robloxId);

            mainEmbed.addField(user.name,`Expires on ${inactives[i].inactiveUntil.toDateString()}`);
        }
        if (!isThere) mainEmbed.setDescription("**No Current Players Inactive!**");
        return ctx.reply({embeds: [mainEmbed]});
    }
}

export default InactivesCommand;