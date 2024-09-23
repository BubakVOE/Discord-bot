import { Message } from 'discord.js';
import { ICommand } from '../index';
import { getAllSubscriptions } from '@/services/twitch/LiveStreamingTwitchService';

export class LiveStreamingCommand implements ICommand {
    name = 'live';
    async execute(
        message: Message,
        args: Array<string>
    ): Promise<void> {
        const response = await getAllSubscriptions();
            message.reply('deleting subscriptions!');
    }
}
