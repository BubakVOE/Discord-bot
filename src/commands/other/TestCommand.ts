import { Message } from 'discord.js';
import { ICommand } from '../index';

export class TestCommand implements ICommand {
    name = 'test';
    async execute(message: Message, args: Array<string>): Promise<void> {
        message.reply('This is a test command.');
    }
}
