// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
} = require('electron');
const { DanmakuService } = require('bilibili-live');
const EventEmitter = require('events');
const path = require('path');
const danmakuService = require('./service/danmakuService');
const { messageEventEmitter } = require('./service/globalEventBus');
const Constants = require('./constants');
const MessageModel = require('./model/MessageModel');

// var list
let online = 0;
const roomId = 9167635;

function bindEventEmitter(eventEmitter, win) {
  eventEmitter.on(Constants.DANMU_DATA, (msg) => {
    // 通过不同的msg，进行不同的事件上报
    if (msg.op === 'SEND_SMS_REPLY') {
      const message = new MessageModel(msg);
      console.log('send a event, type is:', message.type);
      win.webContents.send(message.type, message.toData());
    } else if (msg.op === 'HEARTBEAT_REPLY') {
      // 心跳包
      if (online !== msg.online) {
        // 直播间人气发生变化
        online = msg.online;
        win.webContents.send('online_changed', online);
      }
    } else {
      // 未处理消息
      console.log('未处理消息:', msg);
    }
  });
}

function invokeMessageFromMain(win) {
  if (!win || !win.webContents) {
    return;
  }
  // 连接弹幕服务器
  danmakuService.createClient(roomId);
  // 清掉之前的事件绑定，如果存在的话
  messageEventEmitter.removeAllListeners();
  // 绑定弹幕服务器消息事件
  bindEventEmitter(messageEventEmitter, win);
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  // dev mode
  mainWindow.loadURL('http://127.0.0.1:8080');

  // build mode
  // mainWindow.loadFile(
  //   path.resolve(__dirname, '../', 'dist/index.html'),
  //   {
  //     protocol: 'file:',
  //     slashes: true,
  //   },
  // );

  // build mode
  // mainWindow.setAlwaysOnTop(true);

  mainWindow.webContents.on('did-finish-load', () => {
    invokeMessageFromMain(mainWindow);
  });
  mainWindow.on('close', () => {
    // 窗口关闭后去掉所有的监听事件，因为在窗口再次打开时会重新绑定事件
    messageEventEmitter.removeAllListeners();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
  .then(() => {
    createWindow();

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
