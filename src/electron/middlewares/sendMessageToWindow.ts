import { ICtx } from '@/electron/types';
import assert from 'assert';
import MessageModel from '../models/MessageModel';

let online = 0;

export function onConnect() {
  console.log('我收到了消息 onConnect');
}

export function onMessage(ctx: ICtx, msg: any) {
  assert(ctx.windowsMap.has('main'), '找不到main窗口');
  if (msg.op === 'SEND_SMS_REPLY') {
    const message = new MessageModel(msg);
    (ctx.windowsMap.get('main') as Electron.BrowserWindow)
      .webContents
      .send(message.type, message.toData());
  } else if (msg.op === 'HEARTBEAT_REPLY') {
    // 心跳包
    if (online !== msg.online) {
      online = msg.online;
      (ctx.windowsMap.get('main') as Electron.BrowserWindow)
        .webContents
        .send('online_changed', online);
    }
  } else {
    // 未处理行为
    console.log('未处理消息', msg);
  }
}

export function onDisConnect() {
  console.log('我收到了消息 onDisConnect');
}

export function onError() {
  console.log('我收到了消息 onError');
}

export default {
  onConnect,
  onMessage,
  onDisConnect,
  onError,
};
