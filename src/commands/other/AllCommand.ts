import { Message } from 'discord.js';
import { ICommand } from '../index';

export class ShowAllCommand implements ICommand {
    name = 'help';
    async execute(message: Message, args: Array<string>): Promise<void> {
        message.reply('```.who \n.streaming```');
    }
}
