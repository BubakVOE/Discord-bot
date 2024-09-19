import { connectingToDiscord } from './services/DiscordService';
import { isHeStreaming } from './services/TwitchService';

async function startServices() {
    await connectingToDiscord();
    // await isHeStreaming();
}

startServices();
