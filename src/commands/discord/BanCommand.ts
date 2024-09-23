import { Message } from 'discord.js';
import { ICommand } from '@/commands';

export class BanCommand implements ICommand {
    name = 'ban';
    async execute(message: Message, args: Array<string>): Promise<void> {
        // Check if @everyone was mentioned
        if (message.mentions.everyone || args.includes('@everyone')) {
            message.reply('You cannot ban everyone.');
            return;
        }
        // Check if the message has a mention
        if (message.mentions.users.size === 0) {
            message.reply('You need to mention a user to ban.');
            return;
        }

        const replyPayload = message.mentions.users.map(user => {
            return `Banned <@${user.id}>`;
        }).join('\n');

        message.reply(replyPayload);
    }
}
