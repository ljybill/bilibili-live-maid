import path from 'path';
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
    await mainWindow.loadFile(path.resolve(__dirname, '../dist', 'index.html'));
  } catch (e) {
    // TODO: logger
    console.error(e);
  }
}

export default {
  createMainWindow,
};
