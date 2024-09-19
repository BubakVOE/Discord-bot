import { Message } from 'discord.js';
import {commands, ICommand} from '../index';

export class HelpCommand implements ICommand {
    name = 'help';
    async execute(message: Message, args: Array<string>): Promise<void> {

        let command_names = commands.map((command: ICommand) => command.name).join('\n');

        message.reply(`Available commands: \`\`\`${command_names}\`\`\``);
    }
}
