import axios from 'axios';

export default async function twitchService() {
    console.log('[Twitch] connecting .... - ' + new Date().toLocaleString());

    const url = "https://id.twitch.tv/oauth2/token";

    const tokenParams = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_TOKEN}&grant_type=client_credentials`;

    try {
        console.log('[Twitch] checking stream status - ' + new Date().toLocaleString());

        const token = await axios.post(url, tokenParams, {
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
