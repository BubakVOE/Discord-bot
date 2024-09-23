import { Message } from 'discord.js';
import { ICommand } from '../index';

export class TestCommand implements ICommand {

    name = 'test';
    async execute(message: Message, args: Array<string>): Promise<void> {

        console.log('test');
        console.error('test')
        console.debug('test')
        console.info('test')

        const streamLink = 'https://www.twitch.tv/bubakvoe';
        const response = `
@doggo 🐶

**🎉 Stream právě začal! 🎉**

Klikni na odkaz níže a pojď se podívat! 🎥:
🔗 [Sledujte stream zde](${streamLink})

Užívej stream! 🎬
        `;
        message.reply(response);
    }
}
