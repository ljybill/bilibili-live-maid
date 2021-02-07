import path from 'path';
import config from 'config';
import { ICtx } from '@/electron/types';
import { BrowserWindow } from 'electron';
import assert from 'assert';
import { UPDATE_TTS_TOKEN } from '@/shared/constants';

let isInGame = false;

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
      await mainWindow.loadFile(path.resolve(__dirname, '../dist/danmaku.html'));
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

export async function create1a2bGame(ctx: ICtx, payload: { user: string }) {
  if (isInGame) {
    return;
  }
  isInGame = true;
  const gameWindow = new BrowserWindow({
    width: 300,
    height: 400,
    titleBarStyle: 'hidden',
    transparent: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  ctx.setWindow(`1a2b-${payload.user}`, gameWindow);
  await gameWindow.loadURL(`http://127.0.0.1:8080/1a2b.html?nickname=${payload.user}`);

  setTimeout(() => {
    gameWindow.webContents.send('init', payload.user);
  }, 2000);
}

export async function close1a2bGame(ctx: ICtx) {
  if (ctx.windowName?.startsWith('1a2b-')) {
    // 遇上对的人
    ctx.windowsMap.delete(ctx.windowName);
    isInGame = false;
    // TODO: 可以搞个排行榜
  }
}

export default {
  createMainWindow,
  changeWindowPinStatus,
};
