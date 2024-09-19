import { Message } from 'discord.js';
// Discord
import { WhoAmICommand } from './discord/WhoAmICommand';
// Twitch
import { StreamingCommand } from './twitch/StreamingCommand';
// Other
import { ShowAllCommand } from './other/AllCommand';
import { TestCommand } from './other/TestCommand';

export interface ICommand {
    name: string;
    execute: (message: Message, args: Array<string>) => Promise<void>;
}

export const commands: ICommand[] = [
    new WhoAmICommand(),

    new StreamingCommand(),

    new ShowAllCommand(),
    new TestCommand(),
];
