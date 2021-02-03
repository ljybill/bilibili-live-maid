import { ICtx } from '@/electron/types';
import assert from 'assert';
import MessageModel from '../models/MessageModel';

export function onConnect() {
  console.log('我收到了消息 onConnect');
}

export function onMessage(ctx: ICtx, msg: any) {
  console.log(ctx.eventName);
  const message = new MessageModel(msg);
  assert(ctx.windowsMap.has('main'), '找不到main窗口');
  console.log(typeof ctx.windowsMap.get('main')?.webContents.send);
  (ctx.windowsMap.get('main') as Electron.BrowserWindow)
    .webContents
    .send(message.type, message.toData());
  console.log('我收到了消息 onMessage', message);
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
