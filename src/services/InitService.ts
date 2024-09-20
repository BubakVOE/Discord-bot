import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from "dotenv";
dotenv.config();

import botPresenceService from '@/services/discord/BotPresenceService';
import MessageService from '@/services/MessageService';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

export default async function InitService() {
    console.log('[Init] connecting - ' + new Date().toLocaleString());

    await client.login(process.env.DISCORD_TOKEN);

    client.on('ready', connectedToDiscord);
}

function connectedToDiscord() {
    console.log('[Init] connected to discord - ' + new Date().toLocaleString());

    botPresenceService(client);

    client.on("messageCreate", MessageService);
}
