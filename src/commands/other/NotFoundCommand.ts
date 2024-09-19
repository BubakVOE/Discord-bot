import { Message } from 'discord.js';
import { ICommand } from '../index';

export class NotFoundCommand implements ICommand {
    name = '404';
    async execute(message: Message, args: Array<string>): Promise<void> {
        message.reply('Command not found. Use `help` to see all available commands.');
    }
}
