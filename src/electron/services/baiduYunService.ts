import got from 'got';

const ttsApiKey = 'dEXKX6WMPbYRvYZMt3aq5tqS';
const ttsSecret = 'jQpMUYfyKIqhxBPUNwfUon0GmAxbPwzN';

export async function getToken(): Promise<string> {
  const res = await got(`https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ttsApiKey}&client_secret=${ttsSecret}`);
  return JSON.parse(res.body).access_token;
}

export default {
  getToken,
};
