import path from 'path';
import config from 'config';
import { ICtx } from '@/electron/types';
import { BrowserWindow } from 'electron';
import assert from 'assert';
import { UPDATE_TTS_TOKEN } from '@/shared/constants';

export async function createMainWindow(ctx: ICtx) {
  try {
    const mainWindow = new BrowserWindow({
      width: 500,
      height: 600,
      titleBarStyle: 'hidden',
      transparent: true,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    ctx.setWindow('main', mainWindow);

    if (config.get('isDev')) {
      await mainWindow.loadURL(config.get('danmakuPath'));
    } else {
      await mainWindow.loadFile(path.resolve(__dirname, '../dist', config.get('danmakuPath')));
    }

    if (config.get('isDev')) {
      mainWindow.webContents.openDevTools();
    }

    if (ctx.ttsToken) {
      setTimeout(() => {
        mainWindow.webContents.send(UPDATE_TTS_TOKEN, ctx.ttsToken);
      }, 1000);
    }
  } catch (e) {
    // TODO: logger
    console.error(e);
  }
}

export async function changeWindowPinStatus(ctx: ICtx, isPin: boolean) {
  assert(ctx.windowsMap.get('main'), '没有找到主窗口');
  (ctx.windowsMap.get('main') as Electron.BrowserWindow).setAlwaysOnTop(isPin);
}

export default {
  createMainWindow,
  changeWindowPinStatus,
};
