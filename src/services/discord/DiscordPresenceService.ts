import { ActivityType, Client } from 'discord.js';

export default function discordPresenceService(client: Client) {
    if (!client || !client.user) {
        Log('[Discord] bot presence not set');
        return;
    }

    Log('[Discord] setting bot presence');

    client.user.setPresence({
        activities: [
            {
                name: '.help',
                type: ActivityType.Watching,
                state: 'Type .help for commands',
            }
        ],
        status: 'online',
    });
}
