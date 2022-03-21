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
    infoIconUrl,
} from '../../handlers/locale';
import { config } from '../../config';
import { provider } from '../../database/router';
import { GuildMember, MessageEmbed } from 'discord.js';


class IsboosterCommand extends Command {
    constructor() {
        super({
            trigger: 'ban',
            description: 'Bans a member.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
                {
                    trigger: 'member',
                    description: 'The member that you want to ban.',
                    autocomplete: false,
                    required: true,
                    type: 'DiscordUser',
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
    }
}

export default IsboosterCommand;