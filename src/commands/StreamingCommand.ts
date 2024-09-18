import { Message } from 'discord.js';
import { ICommand } from './index';
import axios from 'axios';

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
        if (!twitchToken) return false;
        const streaming = await axios.get("https://api.twitch.tv/helix/streams?user_id=64874795", { headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID, 'Authorization': `Bearer ${twitchToken}` } });
        return streaming.data.data[0] != null;
    } catch (error) {
        console.error('Error checking stream status:', error);
        return false;
    }
}

export class StreamingCommand implements ICommand {
    name = 'streaming';
    async execute(message: Message, args: Array<string>): Promise<void> {
        const response = await isHeStreaming();
        if (response) {
            message.reply("yes");
        } else {
            message.reply("no");
        }
    }
}
