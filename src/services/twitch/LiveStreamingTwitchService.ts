import * as dotenv from "dotenv";
dotenv.config();

import { WebSocket } from "ws";

const ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

ws.onmessage = async (event) => {
    try {
        const data = JSON.parse(event.data.toString());
        if (data.metadata.message_type === "session_welcome") {
            const sessionId = data.payload.session.id;
            await subscribeToLiveStream(sessionId);
        }

        console.log(data);
    } catch (error: any) {
        console.error("Error parsing JSON data", error);
    }
};

ws.onclose = async () => {
    await getAllSubscriptions();
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
        .then((data) => console.log(data))
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
            fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${element.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
                    "Client-Id": `q6batx0epp608isickayubi39itsckt`,
                },
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => {
                    console.error("Error:", error);
                });
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    }
}

export interface Root {
    total: number
    data: Daum[]
    max_total_cost: number
    total_cost: number
    pagination: Pagination
}

export interface Daum {
    id: string
    status: string
    type: string
    version: string
    condition: Condition
    created_at: string
    transport: Transport
    cost: number
}

export interface Condition {
    broadcaster_user_id: string
}

export interface Transport {
    method: string
    session_id: string
    connected_at: string
    disconnected_at: string
}

export interface Pagination { }
