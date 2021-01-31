const assert = require('assert');
const { DanmakuService } = require('bilibili-live');
const { messageEventEmitter } = require('./globalEventBus');
const Constants = require('../constants');

/**
 * 连接到弹幕服务器
 * @param {number} roomId
 * @returns {any} 返回值并不重要，我们可以通过引入globalEventBus获取监听事件
 */
function createClient(roomId) {
  assert(roomId, 'roomId不能为空');
  const danmakuClient = new DanmakuService({
    roomId: roomId,
  });
  // 连接指定房间的弹幕服务器
  danmakuClient.connect();
  danmakuClient
    .on('open', () => {
      messageEventEmitter.emit(Constants.DANMU_CONNECT);
    })
    .on('data', (msg) => {
      messageEventEmitter.emit(Constants.DANMU_DATA, msg);
    })
    .on('close', () => {
      messageEventEmitter.emit(Constants.DANMU_DISCONNECT);
    })
    .on('error', () => {
      messageEventEmitter.emit(Constants.DANMU_ERROR);
    });

  return danmakuClient;
}

module.exports = {
  createClient,
};
