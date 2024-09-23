import { Message } from 'discord.js';
import { ICommand } from '@/commands';

export class WhoAmICommand implements ICommand {
    name = 'who';
    async execute(message: Message, args: Array<string>): Promise<void> {

        const link = 'http://ludwigtomas.cz/';

        const test = `
**💻 Stream právě začal! 💻**

Webový programátor, který se učí nové věci a rád se podělí o své znalosti. 🎥:
🔗 [Více o mně zde](${link})

Užívej discord server! 🎬
        `;

        message.reply(test);
    }
}
