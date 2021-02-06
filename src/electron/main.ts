import * as Electron from 'electron';
import { ICtx } from '@/electron/types';
import assert from 'assert';
import Events from 'events';
import {
  DANMU_CONNECT, DANMU_DATA, DANMU_DISCONNECT, DANMU_ERROR,
} from './constants';
import { changeWindowPinStatus, createMainWindow } from './middlewares/windowController';
import { createBilibiliClient } from './middlewares/bilibiliClient';
import {
  onConnect, onMessage, onDisConnect, onError,
} from './middlewares/sendMessageToWindow';

const AppEvents: Array<string> = [
  'will-finish-launching',
  'ready',
  'window-all-closed',
  'before-quit',
  'will-quit',
  'quit',
  'open-file',
  'open-url',
  'activate',
  'did-groupe-active',
  'continue-activity',
  'will-continue-activity',
  'continue-activity-error',
  'activity-was-continued',
  'update-activity-state',
  'new-window-for-tab',
  'browser-window-blur',
  'browser-window-focus',
  'browser-window-created',
  'web-contents-created',
  'certificate-error',
  'select-client-certificate',
  'login',
  'gpu-info-update',
  'render-process-gone',
  'child-process-gone',
  'accessibility-support-changed',
  'session-created',
  'second-instance',
  'desktop-capturer-get-sources',
  'remote-require',
  'remote-get-global',
  'remote-get-builtin',
  'remote-get-current-window',
  'remote-get-current-web-contents',
];

const windowEvents: Array<string> = [
  'page-title-updated',
  'close',
  'closed',
  'session-end',
  'unresponsive',
  'responsive',
  'blur',
  'focus',
  'show',
  'hide',
  'ready-to-show',
  'maximize',
  'unmaximize',
  'minimize',
  'restore',
  'will-resize',
  'resize',
  'resized',
  'will-move',
  'move',
  'moved',
  'enter-full-screen',
  'leave-full-screen',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'always-on-top-changed',
  'app-command',
  'scroll-touch-begin',
  'scroll-touch-end',
  'scroll-touch-edge',
  'swiper',
  'rotate-gesture',
  'sheet-begin',
  'sheet-end',
  'new-window-for-tab',
  'system-context-menu',
];

function addMap(map: Map<string, Set<any>>, name: string, obj: any) {
  if (!map.has(name)) {
    map.set(name, new Set());
  }
  (map.get(name) as Set<any>).add(obj);
}

class MyApp {
  private readonly electronApp: Electron.App;

  private appEventHandlerMap: Map<string, Set<any>> = new Map();

  private windowEventHandlerMap: Map<string, Set<any>> = new Map();

  private customEventHandlerMap: Map<string, Set<any>> = new Map();

  private windowsMap: Map<string, Electron.BrowserWindow> = new Map();

  private customEventEmitter: Events.EventEmitter = new Events();

  private readonly ctx: ICtx;

  constructor(electronApp: Electron.App) {
    this.electronApp = electronApp;

    this.ctx = {
      app: this.electronApp,
      windowsMap: this.windowsMap,
      eventName: 'ready',
      setWindow: this.setWindow.bind(this),
      removeWindow: this.removeWindow.bind(this),
      customEventEmitter: this.customEventEmitter,
    };

    this.listenIpc();
    this.mountElectronApp();
  }

  private setWindow(name: string, window: Electron.BrowserWindow) {
    assert(!this.windowsMap.has(name), `${name} 窗口名已经被占用！`);
    this.windowsMap.set(name, window);
    this.mountWindow(name, window);
  }

  private removeWindow(name: string) {
    assert(this.windowsMap.has(name), `不存在 ${name} window`);

    this.windowsMap.delete(name);
  }

  private mountElectronApp() {
    AppEvents.forEach((eventName) => {
      this.electronApp.on(eventName as any, async (...args) => {
        if (!this.appEventHandlerMap.has(eventName)) {
          // 没有事件监听 直接return
          return;
        }
        this.ctx.eventName = eventName;
        // eslint-disable-next-line no-restricted-syntax
        for await (const handler of this.appEventHandlerMap.get(eventName) as Set<any>) {
          handler(this.ctx, ...args);
        }
      });
    });
  }

  private listenIpc() {
    Electron.ipcMain.on('change_window_pin', (event, args) => {
      this.customEventEmitter.emit('change_window_pin', args);
    });
  }

  private mountWindow(name: string, window: Electron.BrowserWindow) {
    windowEvents.forEach((eventName) => {
      window.on(eventName as any, async (...args) => {
        if (!this.windowEventHandlerMap.has(eventName)) {
          return;
        }
        this.ctx.eventName = eventName;
        this.ctx.windowName = name;
        // eslint-disable-next-line no-restricted-syntax
        for await (const handler of this.windowEventHandlerMap.get(eventName) as Set<any>) {
          handler(this.ctx, ...args);
        }
      });
    });
  }

  /**
   * @description 绑定事件
   * @param type
   * @param eventName
   * @param handler
   */
  use(type: string, eventName: string, handler: any) {
    switch (type) {
      case 'app': {
        addMap(this.appEventHandlerMap, eventName, handler);
        break;
      }
      case 'window': {
        addMap(this.windowEventHandlerMap, eventName, handler);
        break;
      }
      case 'custom': {
        this.customEventEmitter.on(eventName, (...args) => {
          this.ctx.eventName = eventName;
          handler(this.ctx, ...args);
        });
        break;
      }
      default: {
        console.error(`unCatch type ${type}, name: ${eventName}`);
        break;
      }
    }
  }
}

const myapp = new MyApp(Electron.app);

myapp.use('app', 'ready', createMainWindow);
myapp.use('app', 'ready', createBilibiliClient);
myapp.use('custom', DANMU_CONNECT, onConnect);
myapp.use('custom', DANMU_DATA, onMessage);
myapp.use('custom', DANMU_ERROR, onError);
myapp.use('custom', DANMU_DISCONNECT, onDisConnect);
myapp.use('custom', 'change_window_pin', changeWindowPinStatus);
