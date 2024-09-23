import { Message } from 'discord.js';
import { ICommand } from '../index';
import { testStream } from '@/services/twitch/TwitchService';

export class StreamingCommand implements ICommand {
    name = 'streaming';
    async execute(
        message: Message,
        args: Array<string>
    ): Promise<void> {

        const channel = args[0] ?? 'bubakvoe';
        const response = await testStream(channel);
        if (response) {
            message.reply(`Yes, **${channel}** is streaming!`);
        }
        else {
            message.reply(`No, **${channel}** is not streaming!`);
        }
    }
}


// type TwitchTokenResponse = {
//     access_token: string;
//     expires_in: number;
//     token_type: string;
//   };

//   let expiresAt = 0;
//   let cachedTokenResponse = {
//     access_token: "",
//     expires_in: 0,
//     token_type: "",
//   };

//   async function getTokenResponse() {
//     if (process.env.TWITCH_CLIENT_ID === undefined) {
//         throw new Error("Twitch client ID is not defined");
//     }

//     if (process.env.TWITCH_TOKEN === undefined) {
//         throw new Error("Twitch token is not defined");
//     }

//     if (cachedTokenResponse && expiresAt > Date.now()) {
//       return cachedTokenResponse;
//     }

//     const tokenParams = new URLSearchParams();
//     tokenParams.append("client_id", process.env.TWITCH_CLIENT_ID);
//     tokenParams.append("client_secret", process.env.TWITCH_TOKEN);
//     tokenParams.append("grant_type", "client_credentials");

//     try {
//       const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
//         method: "POST",
//         headers: {
//           "content-type": "application/x-www-form-urlencoded",
//         },
//         body: tokenParams,
//       });

//       const tokenData: TwitchTokenResponse = await tokenResponse.json();
//       if (tokenData.access_token === undefined) {
//         return undefined;
//       }

//       expiresAt = Date.now() + tokenData.expires_in * 1_000;
//       cachedTokenResponse = tokenData;

//       return tokenData;
//     } catch (error: any) {
//       console.error("Error getting Twitch token", error);
//       return undefined;
//     }
//   }

//   export function isHeStreaming(channel = "bubakvoe") {
//     return new Promise(async (resolve, reject) => {
//       const tokenResponse = await getTokenResponse();
//       if (tokenResponse === undefined) {
//         return reject(false);
//       }

//       const twitchToken = tokenResponse.access_token;

//       const url = new URL("https://api.twitch.tv/helix/streams");
//       url.searchParams.append("user_login", channel);

//       try {
//         const response = await fetch(url, {
//           headers: {
//             "Client-ID": process.env.TWITCH_CLIENT_ID,
//             Authorization: `Bearer ${twitchToken}`,
//           },
//         });

//         const streamingData = await response.json();

//         return resolve(streamingData.data[0] !== null);
//       } catch (error: any) {
//         console.error("Error checking stream status", error);
//         return reject(false);
//       }
//     });
//   }
