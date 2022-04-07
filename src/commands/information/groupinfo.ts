import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getUnexpectedErrorEmbed,
    getSuccessfulShoutEmbed,
    getInvalidRobloxUserEmbed,
    getSuccessfulTrainingEmbed,
    getSuccessfulShiftingEmbed,
    checkIconUrl,
    greenColor,
    infoIconUrl,
    mainColor,
    xmarkIconUrl,
    redColor,
} from '../../handlers/locale';
import { config } from '../../config';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { MessageEmbed, TextChannel } from 'discord.js';
import { DatabaseUser } from '../../structures/types';
import { group } from 'console';
import { err } from 'lexure';

class GroupinfoCommand extends Command {
    constructor() {
        super({
            trigger: 'groupinfo',
            description: 'Gets the group info about a roblox group.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'group-id',
                    description: 'The group ID of the group.',
                    required: true,
                    type: 'Number',
                },
            ],
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
        
             const fetchuser = await robloxClient.getGroup(ctx.args['groupId']);
        
                    
            const embed = new MessageEmbed()
                .setAuthor(`Information: ${await fetchuser.name}`, infoIconUrl)
                .setColor(mainColor)
                .setFooter(`Group ID: ${await fetchuser.id}`)
                .setTimestamp()
                .addField('Membercount', `${await fetchuser.memberCount}`, true)
                .addField('Group Name', `${await fetchuser.name}`, true)
                .addField('Description', `${await fetchuser.description || 'No Description'}`, true)
                .addField('Owner', `${await fetchuser.owner.name || `No Owner`}`, true)
                .addField('Public Entry Allowed?', `${await fetchuser.publicEntryAllowed ? `✅` : 'False'}`, true)
                .addField('Shout', `${await fetchuser.shout.content || 'No Shout'}`, true)
                .addField('Owner Info', `Use \`!!info ${await fetchuser.owner.name}\` to view the user info`, true)
        
            ctx.reply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setAuthor(`Error`, xmarkIconUrl)
            .setDescription(`Something went wrong. Please try a other group ID.`)
            .setColor(redColor)
            .setTimestamp();

            ctx.reply({ embeds: [errorEmbed] });
        }
    }
}

export default GroupinfoCommand;
