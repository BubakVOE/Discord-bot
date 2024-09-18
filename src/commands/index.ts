import { Message } from 'discord.js';
import { TestCommand } from './TestCommand';
import { WhoAmICommand } from './WhoAmICommand';
import { StreamingCommand } from './StreamingCommand';

export interface ICommand {
    name: string;
    execute: (message: Message, args: Array<string>) => Promise<void>;
}

export const commands: ICommand[] = [
    new TestCommand(),
    new WhoAmICommand(),
    new StreamingCommand(),
];
