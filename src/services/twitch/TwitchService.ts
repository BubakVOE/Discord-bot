import { TwitchTokenResponse } from "@/types/twitch";

let expiresAt = 0;
let cachedTokenResponse = {
    access_token: "",
    expires_in: 0,
    token_type: "",
};

export async function testStream(
    channel: string = "bubakvoe"
): Promise<boolean> {
    console.log('[Twitch] connecting .... - ' + new Date().toLocaleString());

    const url = "https://id.twitch.tv/oauth2/token";
    const tokenParams = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID || '',
        client_secret: process.env.TWITCH_TOKEN || '',
        grant_type: 'client_credentials'
    });

    try {
        console.log('[Twitch] checking stream status - ' + new Date().toLocaleString());

        const tokenResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tokenParams.toString()
        });

        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();
        const twitchToken = tokenData.access_token;
        if (!twitchToken) return false;

        const streamResponse = await fetch("https://api.twitch.tv/helix/streams?user_login=" + channel, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID || '',
                'Authorization': `Bearer ${twitchToken}`
            }
        });

        if (!streamResponse.ok) {
            throw new Error(`Failed to fetch stream status: ${streamResponse.statusText}`);
        }

        const streamData = await streamResponse.json();
        return streamData.data[0] != null;
    } catch (error) {
        console.error('Error checking stream status:', error);
        return false;
    }
}


export function isHeStreaming(channel = "bubakvoe") {
    return new Promise(async (resolve, reject) => {
        if (process.env.TWITCH_CLIENT_ID === undefined) {
            throw new Error("Twitch client ID is not defined");
        }

        if (process.env.TWITCH_TOKEN === undefined) {
            throw new Error("Twitch token is not defined");
        }

        const tokenResponse = await getTokenResponse();
        if (tokenResponse === undefined) {
            return reject(false);
        }

        const twitchToken = tokenResponse.access_token;

        const url = new URL("https://api.twitch.tv/helix/streams");
        url.searchParams.append("user_login", channel);

        try {
            const response = await fetch(url, {
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${twitchToken}`,
                },
            });

            const streamingData = await response.json();

            console.log(streamingData)

            return resolve(streamingData.data[0] !== null);
        } catch (error: any) {
            console.error("Error checking stream status", error);
            return reject(false);
        }
    });
}

async function getTokenResponse() {
    if (process.env.TWITCH_CLIENT_ID === undefined) {
        throw new Error("Twitch client ID is not defined");
    }

    if (process.env.TWITCH_TOKEN === undefined) {
        throw new Error("Twitch token is not defined");
    }

    if (cachedTokenResponse && expiresAt > Date.now()) {
        return cachedTokenResponse;
    }

    const tokenParams = new URLSearchParams();
    tokenParams.append("client_id", process.env.TWITCH_CLIENT_ID);
    tokenParams.append("client_secret", process.env.TWITCH_TOKEN);
    tokenParams.append("grant_type", "client_credentials");

    try {
        const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: tokenParams,
        });

        const tokenData: TwitchTokenResponse = await tokenResponse.json();
        if (tokenData.access_token === undefined) {
            return undefined;
        }

        expiresAt = Date.now() + tokenData.expires_in * 1_000;
        cachedTokenResponse = tokenData;

        return tokenData;
    } catch (error: any) {
        console.error("Error getting Twitch token", error);
        return undefined;
    }
}
