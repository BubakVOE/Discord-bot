import { Message } from 'discord.js';
import { commands, ICommand } from '@/commands';
import { NotFoundCommand } from "@/commands/other/NotFoundCommand";

export default function MessageService(message: Message){
    if (message.author.bot || !message.content.startsWith(".")) return;

    const { commandName, args } = parseCommand(message.content);

    let command = commands.find((command: ICommand) => command.name === commandName) ?? new NotFoundCommand(args[0]);

    command.execute(message, args);
}

function parseCommand(content: string) {
    if (!content.startsWith(process.env.PREFIX as string)) {
        return { commandName: null, args: ['bad prefix'] };
    }

    const words = content.split(' ');

    if (words.length < 2) {
        return { commandName: null, args: ['not enough arguments'] };
    }

    const args = content.slice(5).trim().split(/ +/g);

    const commandName = args.shift()?.toLowerCase();

    return { commandName, args };
}
