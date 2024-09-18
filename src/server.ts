import axios from "axios";
import { ActivityType, Client, GatewayIntentBits, Message } from 'discord.js';
const { PermissionsBitField } = require('discord.js');
import dotenv from "dotenv"
dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

interface ICommand {
    name: string;
    execute: (message: Message, args: Array<string>) => Promise<void>;
}

export class TestCommand implements ICommand {
    name = 'test';
    async execute(message: Message, args: Array<string>): Promise<void> {
        return new Promise((resolve, reject) => {
            message.reply('This is a test command.');
            resolve()
        })
    }
}

export class WhoAmICommand implements ICommand {
    name = 'who';
    async execute(message: Message, args: Array<string>): Promise<void> {
        return new Promise((resolve, reject) => {

            // mention the user who sent the message
            message.reply(`https://ludwigtomas.cz/`);
            resolve()
        })
    }
}

export class StreamingCommand implements ICommand {
    name = 'streaming'
    async execute(message: Message, args: Array<string>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const response = await isHeStreaming();
            if (response) {
                message.reply("yes")
            } else {
                message.reply("no")
            }
            resolve()
        })
    }
}

const isHeStreaming = async () => {
    try {
        const token = await axios.post("https://id.twitch.tv/oauth2/token", `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_TOKEN}&grant_type=client_credentials`, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
        });
        const tokenResponse = token.data;
        const twitchToken = tokenResponse.access_token;
        if(!twitchToken) return false;
        const streaming = await axios.get("https://api.twitch.tv/helix/streams?user_id=64874795", { headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID, 'Authorization': `Bearer ${twitchToken}` }})
        console.log(streaming.data)
        return streaming.data.data[0] != null;
    } catch (error) {
        console.error('Error checking stream status:', error);
        return false;
    }
}

export async function startDiscordBot() {

    const registeredCommands: Array<ICommand> = [
        new TestCommand(),
        new StreamingCommand(),
        new WhoAmICommand(),
    ]

    console.log(`[AV] ${new Date().toLocaleString()} - Starting Discord bot...`)

    await client.on('ready', () => {
        console.log(
            `[AV] ${new Date().toLocaleString()} - Discord bot is ready`
        );
        client.user?.setPresence({
            activities: [
                {
                    name: 'for .help',
                    type: ActivityType.Watching
                }
            ],
            status: 'online'
        })
    }).login(process.env.DISCORD_TOKEN);

    client.on("messageCreate", (message: Message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(".")) return;
        const args = message.content.slice(1).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;
        const command = registeredCommands.find((command: ICommand) => command.name === commandName);
        if (!command) return;
        command.execute(message, args);
    })
}

startDiscordBot();
