import Electron from 'electron';
import * as Events from 'events';

export interface ICtx {
  app: Electron.App;
  windowsMap: Map<string, Electron.BrowserWindow>;
  eventName: string;
  windowName?: string;
  setWindow: (name: string, window: Electron.BrowserWindow) => void;
  removeWindow: (name: string) => void;
  customEventEmitter: Events.EventEmitter;
}
