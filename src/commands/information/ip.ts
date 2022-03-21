import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { PartialUser, User, GroupMember } from 'bloxy/dist/structures';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { config } from '../../config';
import {
    getInvalidRobloxUserEmbed,
    getNoDatabaseEmbed,
    getPartialUserInfoEmbed,
    getRobloxUserIsNotMemberEmbed,
    getUnexpectedErrorEmbed,
    getUserInfoEmbed,
    infoIconUrl,
    mainColor,
    redColor,
    xmarkIconUrl,
} from '../../handlers/locale';
import { provider } from '../../database/router';
import axios from 'axios';
import { Message, MessageEmbed } from 'discord.js';
import { values } from 'lodash';

class IpCommand extends Command {
    constructor() {
        super({
            trigger: 'ip',
            description: 'Shows you the information about someones IP <:theharv:942500350756270141>.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'ip',
                    description: 'The IP that you got.',
                    autocomplete: false,
                    required: true,
                    type: 'String',
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

        const errorEmbed = new MessageEmbed()
        .setAuthor(`Error`, xmarkIconUrl)
        .setDescription(`Please enter a valid IP`)
        .setColor(redColor)
        .setTimestamp();

    const baseUrl = 'https://ipinfo.io';

    let url; let response; let
        corona;

    try {
        url = `${baseUrl}/${ctx.args['ip']}?token=ef5a1e90d04467`;
        response = await axios.get(url);
        corona = response.data;
    } catch (error) {
        ctx.reply({ embeds: [errorEmbed] }); return
    }

    const responseEmbed = new MessageEmbed()
    .setAuthor(`IP Information`, infoIconUrl)
    .addFields(
		{ name: 'IP', value: `${corona.ip || `Not a valid IP`}`, inline: true },
		{ name: 'City', value: `${corona.city || `Not a valid city`} `, inline: true },
		{ name: 'Region', value: `${corona.region || `Not a valid region`}`, inline: true },
		{ name: 'Country', value: `${corona.country || `Not a valid country`}`, inline: true },
        { name: 'Location', value: `${corona.loc || `Not a valid loc`}`, inline: true },
        { name: 'Anycast', value: `${corona.anycast || `Not a valid anycast`}`, inline: true },
        { name: 'Organization', value: `${corona.org || `Not a valid organization`}`, inline: true },
        { name: 'Postal', value: `${corona.postal || `Not a valid postal`}`, inline: true },
        { name: 'Timezone', value: `${corona.timezone || `Not a valid timezone`}`, inline: true },
	)
    .setColor(mainColor)
    .setTimestamp();

    ctx.reply({ embeds: [responseEmbed] });


    }
}

export default IpCommand;