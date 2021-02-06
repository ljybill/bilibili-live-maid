import got from 'got';
import config from 'config';

export async function getToken(): Promise<string> {
  const res = await got(`https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.get('tts_apiKey')}&client_secret=${config.get('tts_secret')}`);
  return JSON.parse(res.body).access_token;
}

export default {
  getToken,
};
