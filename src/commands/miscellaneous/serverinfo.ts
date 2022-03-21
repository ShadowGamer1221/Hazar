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
    xmarkIconUrl,
    redColor,
    greenColor,
    mainColor,
    infoIconUrl,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import axios from 'axios';
 
class ServerinfoCommand extends Command {
    constructor() {
        super({
            trigger: 'serverinfo',
            description: 'Gives you the information about the server.',
            type: 'ChatInput',
            module: 'miscellaneous',
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
			.setThumbnail(ctx.guild.iconURL({ dynamic: true }))
			.setColor(mainColor)
			.setAuthor(`${ctx.guild.name} server stats`, infoIconUrl)
			.addFields(
				{
					name: 'Owner: ',
					value: `<@832932513936441375>`,
					inline: true,
				},
				{
					name: 'Members: ',
					value: `There are ${ctx.guild.memberCount} users!`,
					inline: true,
				},
				{
					name: 'Total Bots: ',
					value: `There are ${ctx.guild.members.cache.filter((m) => m.user.bot).size} bots!`,
					inline: true,
				},
				{
					name: 'Creation Date: ',
					value: ctx.guild.createdAt.toLocaleDateString('en-us'),
					inline: true,
				},
				{
					name: 'Roles Count: ',
					value: `There are ${ctx.guild.roles.cache.size} roles in this server.`,
					inline: true,
				},
				{
					name: 'Verified: ',
					value: ctx.guild.verified ? 'Server is verified' : 'Server isn\'t verified',
					inline: true,
				},
				{
					name: 'Boosters: ',
					value: ctx.guild.premiumSubscriptionCount >= 1 ? `There are ${ctx.guild.premiumSubscriptionCount} Boosters` : 'There are no boosters',
					inline: true,
				},
				{
					name: 'Emojis: ',
					value: ctx.guild.emojis.cache.size >= 1 ? `There are ${ctx.guild.emojis.cache.size} emojis!` : 'There are no emojis',
					inline: true,
				},
			);
		return ctx.reply({ embeds: [embed] });
  }
}
 
export default ServerinfoCommand;