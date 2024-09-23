import { Message } from 'discord.js';
import { ICommand } from '@/commands';
import { getAllSubscriptions } from '@/services/twitch/LiveStreamingTwitchService';

export class LiveStreamingCommand implements ICommand {
    name = 'live';
    async execute(
        message: Message,
        args: Array<string>
    ): Promise<void> {
        await getAllSubscriptions();
        message.reply('deleting subscriptions!');
    }
}
