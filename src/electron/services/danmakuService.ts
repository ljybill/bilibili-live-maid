import assert from 'assert';
import { DanmakuService } from 'bilibili-live';

/**
 * @description 连接到弹幕服务器
 * @param {number} roomId
 * @returns {any} 返回值并不重要，我们可以通过引入globalEventBus获取监听事件
 */
export function createClient(roomId: number) {
  assert(roomId, 'roomId不能为空');
  const danmakuClient = new DanmakuService({
    roomId,
  });
  return danmakuClient;
}

export default {
  createClient,
};
