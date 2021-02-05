import path from 'path';
import config from 'config';
import { ICtx } from '@/electron/types';
import { BrowserWindow } from 'electron';

export async function createMainWindow(ctx: ICtx) {
  try {
    const mainWindow = new BrowserWindow({
      width: 500,
      height: 600,
      titleBarStyle: 'default',
      transparent: false,
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
  } catch (e) {
    // TODO: logger
    console.error(e);
  }
}

export default {
  createMainWindow,
};
