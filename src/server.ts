import { ActivityType, Client, GatewayIntentBits, Message } from 'discord.js';
import { commands, ICommand } from './commands';
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

export async function startDiscordBot() {
    console.log(new Date().toLocaleString() + ' - DiscordBot starting ...');

    await client.on('ready', () => {
        console.log(new Date().toLocaleString() + ' - DiscordBot started.');

        client.user?.setPresence({
            activities: [
                {
                    name: '.help',
                    type: ActivityType.Watching
                }
            ],
            status: 'online'
        });
    }).login(process.env.DISCORD_TOKEN);

    client.on("messageCreate", (message: Message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(".")) return;
        const args = message.content.slice(1).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;
        const command = commands.find((command: ICommand) => command.name === commandName);
        if (!command) return;
        command.execute(message, args);
    });
}

startDiscordBot();
