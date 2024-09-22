import { Message } from 'discord.js';
import { ICommand } from '../index';
import axios from 'axios';
import { isHeStreaming } from '@/services/twitch/TwitchService';

export class StreamingCommand implements ICommand {
    name = 'streaming';
    async execute(
        message: Message,
        args: Array<string>
    ): Promise<void> {
        const channel = args[0] ?? 'bubakvoe';
        const response = await isHeStreaming(channel);
        if (response) {
            message.reply(`Yes, **${channel}** is streaming!`);
        }
        else {
            message.reply(`No, **${channel}** is not streaming!`);
        }
    }
}
