import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { WebSocket } from "ws";
import { Root } from "@/types/twitch";
import * as dotenv from "dotenv";
dotenv.config();

const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

console.log("[Discord] connecting ....");
discord.login(process.env.DISCORD_TOKEN).then(() => {
    const ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

    ws.onmessage = async (event) => {
        try {
            const data = JSON.parse(event.data.toString());

            console.log(data);

            if (data.metadata.message_type === "session_welcome") {
                const sessionId = data.payload.session.id;
                await subscribeToLiveStream(sessionId);
            }

            if (
                data.metadata.message_type === "notification" &&
                data.payload.event.type === "live"
            ) {
                await sendDiscordLiveMessage();
            }
        } catch (error: any) {
            console.error("Error parsing JSON data", error);
        }
    };

    ws.onclose = async () => {
        await getAllSubscriptions();
    };
});

async function sendDiscordLiveMessage() {
    try {
        const channelId = process.env.DISCORD_CHANNEL_ID; // Ensure this environment variable is set
        if (!channelId) {
            console.error("DISCORD_CHANNEL_ID is not set");
            return;
        }

        const channel = (await discord.channels.fetch(channelId)) as TextChannel;
        if (!channel) {
            console.error("Channel not found");
            return;
        }

        const streamLink = "https://www.twitch.tv/bubakvoe";
        const message = `
**🎉 Stream právě začal! 🎉**

Klikni na odkaz níže a pojď se podívat! 🎥:
🔗 [Sledujte stream zde](${streamLink})

Užívej stream! 🎬
        `;

        await channel.send(message);
        console.log("Message sent to Discord channel");
    } catch (error: any) {
        console.error("Error sending message to Discord channel", error);
    }
}

async function subscribeToLiveStream(sessionId: number, userId = 64_874_795) {
    fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Client-Id": `q6batx0epp608isickayubi39itsckt`,
            Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
        },
        body: JSON.stringify({
            type: "stream.online",
            version: "1",
            condition: {
                broadcaster_user_id: `${userId}`,
            },
            transport: {
                method: "websocket",
                session_id: sessionId,
            },
        }),
    })
        .then((response) => response.json())
        // .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
}

export async function getAllSubscriptions() {
    fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
        method: "GET",

        headers: {
            Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
            "Client-Id": `q6batx0epp608isickayubi39itsckt`,
        },
    })
        .then((response) => response.json())
        .then((data) => deleteAllSubscriptions(data))
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function deleteAllSubscriptions(subscriptions: Root) {
    for (let index = 0; index < subscriptions.data.length; index++) {
        const element = subscriptions.data[index];

        try {
            const response = await fetch(
                "https://api.twitch.tv/helix/eventsub/subscriptions?id=" + element.id,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
                        "Client-Id": `q6batx0epp608isickayubi39itsckt`,
                    },
                }
            );

            if (!response.ok) {
                console.error(
                    `Failed to delete subscription ${element.id}: ${response.statusText}`
                );
                continue;
            }

            const contentLength = response.headers.get("content-length");

            if (contentLength && parseInt(contentLength) > 0) {
                const data = await response.json();
                console.log(`Deleted subscription ${element.id}:`, data);
            } else {
                console.log(`Deleted subscription ${element.id} with no content`);
            }
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    }
}
