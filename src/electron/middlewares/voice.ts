import assert from 'assert';
import { ICtx } from '@/electron/types';
import { UPDATE_TTS_TOKEN } from '@/shared/constants';

export async function onTTSAvailable(ctx: ICtx, token: string) {
  assert(ctx.windowsMap.get('main'), '找不到主窗口');
  const mainWindow = ctx.windowsMap.get('main') as Electron.BrowserWindow;
  mainWindow.webContents.send(UPDATE_TTS_TOKEN, token);
}

export default {
  onTTSAvailable,
};
