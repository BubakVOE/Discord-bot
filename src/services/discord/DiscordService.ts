import { Client, GatewayIntentBits, Message } from 'discord.js';
import { commands, ICommand } from '@/commands';
import { NotFoundCommand } from "@/commands/other/NotFoundCommand";
import discordPresenceService from '@/services/discord/DiscordPresenceService';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

export default async function discordService() {
    Log('[Discord] connecting ....');

    await client.login(process.env.DISCORD_TOKEN);

    client.on('ready', connectedToDiscord);
}

function connectedToDiscord() {
    Log('[Discord] connected!');

    discordPresenceService(client);

    client.on("messageCreate", handleMessageCreate);
}

function handleMessageCreate(message: Message) {
    if (message.author.bot || !message.content.startsWith(process.env.PREFIX as string)) return;
    const { command_name, args } = parseCommand(message.content);

    let command = commands.find((command: ICommand) => command.name === command_name) ?? new NotFoundCommand(args[0]);

    command.execute(message, args);
}

function parseCommand(content: string) {
    if(!process.env.PREFIX) {
        return { command_name: null, args: ['ENV variable PREFIX not set'] };
    }

    if (!content.startsWith(process.env.PREFIX as string)) {
        return { command_name: null, args: ['Use ' + process.env.PREFIX as string] };
    }

    const words = content.split(' ');

    if (words.length < 2) {
        return { command_name: null, args: ['not enough arguments'] };
    }

    const args = content.slice(process.env.PREFIX.length + 1).trim().split(/ +/g);

    const command_name = args.shift()?.toLowerCase();

    return { command_name, args };
}
