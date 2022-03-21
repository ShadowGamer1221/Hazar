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
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import axios from 'axios';
 
class MemeCommand extends Command {
    constructor() {
        super({
            trigger: 'meme',
            description: 'Will show you a random meme <:kekw:943841369410138112>',
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
        const errorEmbed = new MessageEmbed()
        .setAuthor(`Error`, xmarkIconUrl)
        .setDescription(`Error with fetching the api website.`)
        .setColor(redColor)
        .setTimestamp();
      const baseUrl = 'https://meme-api.herokuapp.com';

		let url; let response; let
			corona;

		try {
			url = `${baseUrl}/gimme`;
			response = await axios.get(url);
			corona = response.data;
		} catch (error) {
			return ctx.reply({ embeds: [errorEmbed] });
		}

		const embed = new MessageEmbed()
            .setImage(`${corona.url}`)
			.setColor(greenColor);

		return ctx.reply({ embeds: [embed] });
  }
}
 
export default MemeCommand;