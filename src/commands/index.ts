import { Message } from 'discord.js';
// Discord
import { WhoAmICommand } from '@/commands/discord/WhoAmICommand';
// Twitch
import { LiveStreamingCommand } from '@/commands/twitch/LiveStreamingCommand';
import { StreamingCommand } from '@/commands/twitch/StreamingCommand';
// Other
import { HelpCommand } from "@/commands/other/HelpCommand";
import { TestCommand } from "@/commands/other/TestCommand";
import { BanCommand } from "@/commands/discord/BanCommand";

export interface ICommand {
    name: string;
    execute: (message: Message, args: Array<string>) => Promise<void>;
}

export const commands: ICommand[] = [
    new WhoAmICommand(),

    // new LiveStreamingCommand(),
    new StreamingCommand(),

    new HelpCommand(),
    new TestCommand(),

    new BanCommand(),
];
