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


class GroupbansCommand extends Command {
    constructor() {
        super({
            trigger: 'groupbans',
            description: 'Allows the viewing of all concurrent group bans.',
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
        const suspensions = await provider.findBannedUsers();
        let mainEmbed = new MessageEmbed();
        mainEmbed.setTimestamp();
        mainEmbed.setColor(mainColor);
        mainEmbed.setTitle('Current Group Bans');
        for (var i in suspensions) {
            isThere = true;
            const user = await robloxClient.getUser(suspensions[i].robloxId);

            mainEmbed.addField(user.name, `${suspensions[i].reasonForBan}` ? `Reason: ${suspensions[i].reasonForBan}` : 'N/A', true);
        }
        if (!isThere) mainEmbed.setDescription("**No Current Bans!**");
        return ctx.reply({embeds: [mainEmbed]});
    }
}

export default GroupbansCommand;