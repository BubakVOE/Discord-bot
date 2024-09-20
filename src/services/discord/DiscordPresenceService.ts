import { ActivityType, Client } from 'discord.js';

export default function discordPresenceService(client: Client) {
    if (!client || !client.user) {
        console.log('[Discord] bot presence not set - ' + new Date().toLocaleString());
        return;
    }

    console.log('[Discord] setting bot presence - ' + new Date().toLocaleString());

    client.user.setPresence({
        activities: [
            {
                name: '.help',
                type: ActivityType.Watching,
                state: 'Type .help for commands'
            }
        ],
        status: 'online',
    });
}
