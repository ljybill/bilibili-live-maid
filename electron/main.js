// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
} = require('electron');
const { DanmakuService } = require('bilibili-live');
const EventEmitter = require('events');
const path = require('path');

// var list
let online = 0;
const eventEmitter = new EventEmitter();
const danmakuClient = new DanmakuService({
  roomId: 9167635
});

danmakuClient.connect();
danmakuClient
  .on('open', () => {
    console.log('正在连接至弹幕服务器...');
    eventEmitter.emit('open');
  })
  .on('data', (msg) => {
    eventEmitter.emit('data', msg);
  })
  .on('close', () => {
    console.log('已断开与弹幕服务器的连接');
    eventEmitter.emit('close');
  })
  .on('error', () => {
    console.log('与弹幕服务器的连接出现错误');
    eventEmitter.emit('error');
  });

function invokeMessageFromMain(win) {
  if (!win || !win.webContents) {
    return;
  }
  eventEmitter.removeAllListeners();
  eventEmitter.on('data', (msg) => {
    console.log(msg);
    // 通过不同的msg，进行不同的事件上报
    if (msg.op === 'SEND_SMS_REPLY') {
      if (msg.cmd === 'INTERACT_WORD') {
        // 进入直播间
        win.webContents.send('user_join', {
          nickname: msg.data.uname,
        });
      }

      if (msg.cmd === 'DANMU_MSG') {
        try {
          // 弹幕消息
          const data = {
            nickname: msg.info[2][1],
            message: msg.info[1]
          };
          win.webContents.send('danmu_message', data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (msg.op === 'HEARTBEAT_REPLY') {
      // 心跳包
      if (online !== msg.online) {
        // 直播间人气发生变化
        online = msg.online;
        win.webContents.send('online_changed', online);

        // win.webContents.send('user_join', {
        //   nickname: '随机名字' + Math.random(),
        // });
      }
    }
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 360,
    height: 600,
    titleBarStyle: 'hidden',
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL('http://127.0.0.1:8080');
  mainWindow.loadFile(
    path.resolve(__dirname, '../', 'dist/index.html'),
    {
      protocol: 'file:',
      slashes: true,
    },
  );
  mainWindow.setAlwaysOnTop(true);

  mainWindow.webContents.on('did-finish-load', () => {
    invokeMessageFromMain(mainWindow);
  });
  mainWindow.on('close', () => {
    eventEmitter.removeAllListeners();
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
