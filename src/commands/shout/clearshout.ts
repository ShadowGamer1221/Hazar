import { robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getUnexpectedErrorEmbed,
    getSuccessfulShoutEmbed,
    getSuccessfulClearShoutEmbed,
} from '../../handlers/locale';
import { config } from '../../config';
import { logAction } from '../../handlers/handleLogging';

class ClearshoutCommand extends Command {
    constructor() {
        super({
            trigger: 'clearshout',
            description: 'Clears the group shout.',
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
        try {
            await robloxGroup.updateShout('');
            ctx.reply({ embeds: [ await getSuccessfulClearShoutEmbed() ]});
            logAction('Clear Shout', ctx.user);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
    }
}

export default ClearshoutCommand;