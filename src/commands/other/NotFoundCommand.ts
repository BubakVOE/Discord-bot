import { Message } from 'discord.js';
import { ICommand } from '../index';

export class NotFoundCommand implements ICommand {
    private commandName: string;

    constructor(commandName: string = '') {
        this.commandName = commandName;
    }

    name = '404';

    async execute(message: Message, args: Array<string>): Promise<void> {
        let error_message = this.commandName ? '`'+ this.commandName +'.` ' : '`Command not found.`';

        message.reply(error_message + 'Use `help` to see all available commands.');
    }
}
