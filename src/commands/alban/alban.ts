import { discordClient, robloxClient, robloxGroup } from '../../main';
import { TextChannel } from 'discord.js';
import { GetGroupRoles } from 'bloxy/src/client/apis/GroupsAPI';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
 
class AlbanCommand extends Command {
    constructor() {
        super({
            trigger: 'alban',
            description: 'Sends the information about alban.',
            type: 'ChatInput',
            module: 'alban',
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


        const albanEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .addField("Her birthday:", `27 April 2007`)
        .addField("Her favourite color:", `Yellow`, true)
        .addField("Her favourite game:", `Roblox`, true)
        .addField("Her roblox profile:", `[Alban](https://www.roblox.com/users/438016092/profile)`, true)
        .setFooter(`Best person on the server`)
        .setTimestamp()

        const choices = ctx.command.options[0].choices // get choices of first option

        ctx.reply({ embeds: [albanEmbed] });

    }
    }
 
export default AlbanCommand;