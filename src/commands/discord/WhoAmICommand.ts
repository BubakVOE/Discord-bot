import { Message } from 'discord.js';
import { ICommand } from '../index';

export class WhoAmICommand implements ICommand {
    name = 'who';
    async execute(message: Message, args: Array<string>): Promise<void> {
        message.reply(`https://ludwigtomas.cz/`);
    }
}
