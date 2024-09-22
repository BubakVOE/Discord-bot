import axios from 'axios';

export const isHeStreaming = async (
    channel: string = 'bubakvoe'
): Promise<boolean> => {
    const TOKEN_URL = "https://id.twitch.tv/oauth2/token";

    return new Promise<boolean>((resolve, reject) => {

        const STREAMING_PARAMS = [
            "client_id=" + process.env.TWITCH_CLIENT_ID,
            "client_secret=" + process.env.TWITCH_TOKEN,
            "grant_type=client_credentials"
        ];

        axios.post(TOKEN_URL, STREAMING_PARAMS.join('&'), {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        }).then((token) => {
            const tokenResponse = token.data;
            const twitchToken = tokenResponse.access_token;
            if (!twitchToken) {
                resolve(false);
            }
            axios.get("https://api.twitch.tv/helix/streams?user_login="+channel, {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${twitchToken}`
                }
            }).then((streaming) => {
                // console.log(streaming);
                resolve(streaming.data.data[0] != null);
            }).catch((error) => {
                console.error('Error checking stream status:', error);
                resolve(false);
            });
        }).catch((error) => {
            console.error('Error getting Twitch token:', error);
            resolve(false);
        });
    });
}
