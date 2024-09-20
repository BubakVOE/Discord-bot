import discordService from '@/services/discord/DiscordService';
import twitchService from '@/services/twitch/TwitchService';
import Log from '@/helper/Logging';


export default async function InitService() {
    Log('[Init] connecting');

    await discordService();
    await twitchService();
}
