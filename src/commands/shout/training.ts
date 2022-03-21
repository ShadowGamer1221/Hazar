import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getUnexpectedErrorEmbed,
    getSuccessfulShoutEmbed,
    getInvalidRobloxUserEmbed,
    getSuccessfulTrainingEmbed,
    checkIconUrl,
    greenColor,
} from '../../handlers/locale';
import { config } from '../../config';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { MessageEmbed, TextChannel } from 'discord.js';

class TrainingCommand extends Command {
    constructor() {
        super({
            trigger: 'training',
            description: 'Announces the training.',
            type: 'ChatInput',
            module: 'shout',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.shout,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {

        const usermember = ctx.user.id
        const realmember = await ctx.guild.members.fetch(usermember)

        let robloxUser: User | PartialUser;
                try {
                    const idQuery = ctx.user;
                    const discordUser = await discordClient.users.fetch(idQuery);
                    const linkedUser = await getLinkedRobloxUser(discordUser.id, ctx.guild.id);
                    console.log(linkedUser)
                    if(!linkedUser) throw new Error();
                    robloxUser = linkedUser;
                } catch (err) {
                    return ctx.reply({ embeds: [ getInvalidRobloxUserEmbed() ]});
                }

        try {
            await robloxGroup.updateShout(`Greetings! There is a training being hosted by ${robloxUser.name}. Join for a chance of being promoted!\n\n~| GAME LINK: https://www.roblox.com/games/6589778170/Eastside-Cafe-Training-Center?\n\nsigned,\n${robloxUser.name}`);
            ctx.reply({ embeds: [ await getSuccessfulTrainingEmbed() ]});
            logAction('Training Announcement', ctx.user);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }

        let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945372794651283536') as TextChannel;
        console.log(channelSend)

        const successEmbed = new MessageEmbed()
        .setColor(greenColor)
        .setDescription(`Greetings! There is a training being hosted by ${robloxUser.name}. Join for a chance of being promoted!\n\n~| GAME LINK: https://www.roblox.com/games/6589778170/Eastside-Cafe-Training-Center?\n\nsigned,\n${robloxUser.name}`)
        .setTimestamp();

        await channelSend.send({ embeds: [successEmbed] })

        let message = await channelSend.send({
            content: '<@&945394793796747285>',
            allowedMentions: { roles: ['945394793796747285'] },
        });
    }
}

export default TrainingCommand;