import { ICtx } from '@/electron/types';
import MessageModel from '@/electron/models/MessageModel';
import { MESSAGE_TYPE_DANMU } from '@/shared/constants';

export async function listen1a2bMessage(ctx: ICtx, msg: any) {
  if (msg.op === 'SEND_SMS_REPLY') {
    const message = new MessageModel(msg);
    const data = message.toData();
    if (data.type === MESSAGE_TYPE_DANMU && ctx.windowsMap.has(`1a2b-${data.nickname}`)) {
      // 存在
      const win = ctx.windowsMap.get(`1a2b-${data.nickname}`);
      console.log('send', data.content);
      (win as Electron.BrowserWindow).webContents.send('1a2b_input', data.content);
    }
  }
}

export default {};
