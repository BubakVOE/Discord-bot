import { Message } from 'discord.js';
import { commands, ICommand } from '@/commands';

export class HelpCommand implements ICommand {
    name = 'help';
    async execute(message: Message, args: Array<string>): Promise<void> {
        const prefix = process.env.PREFIX || '';

        let command_names = commands.map((command: ICommand) => '\`' + prefix + ' ' + command.name +'\`').join('\n');

        let custom_command = '\`'+ prefix +' streaming [streamer_name]\`';

        // Add custom_command to command_names
        command_names += '\n' + custom_command;

        const helpMessage = `
**Available Commands:**
${command_names}

*Type \`${prefix} help\` for more information on a specific command.*
        `;

        message.reply(helpMessage);
    }
}
