import { ICtx } from '@/electron/types';
import { createClient } from '../services/danmakuService';
import Constants from '../constants';

export function createBilibiliClient(ctx: ICtx) {
  const danmakuClient = createClient(9167635);
  danmakuClient.connect();
  danmakuClient
    .on('open', () => {
      ctx.customEventEmitter.emit(Constants.DANMU_CONNECT);
    })
    .on('data', (msg: any) => {
      ctx.customEventEmitter.emit(Constants.DANMU_DATA, msg);
    })
    .on('close', () => {
      ctx.customEventEmitter.emit(Constants.DANMU_DISCONNECT);
    })
    .on('error', () => {
      ctx.customEventEmitter.emit(Constants.DANMU_ERROR);
    });
}

export default {
  createBilibiliClient,
};
