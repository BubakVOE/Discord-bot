import { Message } from 'discord.js';
import {commands, ICommand} from '../index';

export class ShowAllCommand implements ICommand {
    name = 'help';
    async execute(message: Message, args: Array<string>): Promise<void> {
        const replyPayload = commands.map(command => {
            return `.${command.name}`;
        }).join('\n');

        message.reply('```'+replyPayload+'```');
    }
}
