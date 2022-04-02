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
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import axios from 'axios';
import fetch from 'node-fetch';
 
class AdviceCommand extends Command {
    constructor() {
        super({
            trigger: 'advice',
            description: '',
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

		try {
			const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
			const embed = new MessageEmbed()
				.setDescription(`💡 ${data.slip.advice}`);
			ctx.reply({ embeds: [embed] });
		} catch (err) {
            const errorEmbed = new MessageEmbed()
            .setAuthor(`Error`, xmarkIconUrl)
            .addFields(
				{
					name: 'Full error details: ',
					value: `${err}`,
					inline: true,
				}
            )
            .setFooter(`Please send this to <@832932513936441375>`)
            .setColor(redColor);

            ctx.reply({ embeds: [errorEmbed] })

            console.log(err)
		}
	}
	}
 
export default AdviceCommand;
