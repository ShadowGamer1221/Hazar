import { robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { getRoleListEmbed } from '../../handlers/locale';
import { config } from '../../config';

class RolesCommand extends Command {
    constructor() {
        super({
            trigger: 'ranks',
            description: 'Displays a list of roles on the group.',
            type: 'ChatInput',
            module: 'information',
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
        const roles = await robloxGroup.getRoles();
        return ctx.reply({ embeds: [ getRoleListEmbed(roles) ] });
    }
}

export default RolesCommand;