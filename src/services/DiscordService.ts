import {ActivityType, Client, GatewayIntentBits, Message} from 'discord.js';
import {commands, ICommand} from '../commands';


import dotenv from "dotenv";
import {NotFoundCommand} from "../commands/other/NotFoundCommand";
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

export async function connectingToDiscord() {
    console.log('[Discord] connecting .... - ' + new Date().toLocaleString());

    await client.login(process.env.DISCORD_TOKEN);
    client.on('ready', connectedToDiscord);
}

function connectedToDiscord() {
    console.log('[Discord] connected! - ' + new Date().toLocaleString());

    setBotPresence();
    client.on("messageCreate", handleMessageCreate);
}

function setBotPresence() {
    if (!client || !client.user) {
        console.log('[Discord] bot presence not set - ' + new Date().toLocaleString());
        return;
    }
    console.log('[Discord] setting bot presence - ' + new Date().toLocaleString());

    client.user.setPresence({
        activities: [
            {
                name: '.help',
                type: ActivityType.Watching
            }, {
                name: 'your messages',
                type: ActivityType.Listening
            }
        ],
        status: 'dnd',
    });
}

function handleMessageCreate(message: Message) {
    if (message.author.bot || !message.content.startsWith(".")) return;

    const { commandName, args } = parseCommand(message.content);

    if (!commandName) return;

    let command = commands.find((command: ICommand) => command.name === commandName);

    if (!command) {
        command = new NotFoundCommand;
    }

    command.execute(message, args);
}

function parseCommand(content: string) {
    if (!content.startsWith('.god')) {
        return { commandName: null, args: [] };
    }

    const args = content.slice(5).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    return { commandName, args };
}
