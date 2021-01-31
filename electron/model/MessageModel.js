const { unix2normal } = require('../utils/index');
const MESSAGE_TYPE_DANMU = 'danmu'; // 弹幕消息
const MESSAGE_TYPE_JOIN = 'join'; // 进场消息
const MESSAGE_TYPE_GIFT = 'gift'; // 礼物消息
const MESSAGE_TYPE_OTHER = 'other'; // 其他消息

class MessageModel {
  constructor(data) {
    this.type = MESSAGE_TYPE_OTHER;
    this.nickname = '';
    this.userId = '';
    this.content = '';
    this.userLevel = 0;
    this.userColor = undefined;
    this.timeStamp = Date.now();
    // 粉丝相关
    this.hasFansMedal = false;
    // TODO: 之后再整理粉丝牌子的数据
    this.fansMedal = {};

    this._parse(data);
  }

  _parse(data) {
    if (data.op === 'SEND_SMS_REPLY') {
      switch (data.cmd) {
        case 'INTERACT_WORD': {
          this.type = MESSAGE_TYPE_JOIN;
          this.nickname = data.data.uname;
          this.userId = data.data.uid;
          this.userColor = data.data.uname_color;
          this.timeStamp = unix2normal(data.data.timestamp);
          this.hasFansMedal = !!data.data.fans_medal.medal_name;
          this.fansMedal = data.data.fans_medal;
          break;
        }
        case 'DANMU_MSG': {
          this.type = MESSAGE_TYPE_DANMU;
          try {
            // 因为是B站数据，所以结构不是自己能控制的。
            this.nickname = data.info[2][1];
            this.content = data.info[1];
            this.userId = data.info[2][0];
            this.userLevel = data.info[4][0];
            this.timeStamp = unix2normal(data.info[9].ts);
          } catch (e) {
            console.log('error!!!');
            console.error(e);
          }
          break;
        }
        case 'NOTICE_MSG': {
          if (/快来围观吧/.test(data.msg_self)) {
            // 其他房间的礼物消息，过滤掉
          } else if (/开通了/.test(data.msg_self) && data.roomid !== 9167635/*currentRoomId*/) {
            // 其他房间有人上船
          } else {
            console.error('未定义行为!', data);
          }
          break;
        }
        default: {
          console.error('未定义行为!', data);
        }
      }
    }
  }

  toData() {
    if (this.type === MESSAGE_TYPE_DANMU) {
      return {
        type: this.type,
        nickname: this.nickname,
        userId: this.userId,
        content: this.content,
        timeStamp: this.timeStamp,
      };
    }

    if (this.type === MESSAGE_TYPE_JOIN) {
      return {
        type: this.type,
        nickname: this.nickname,
        userId: this.userId,
        timeStamp: this.timeStamp,
        userColor: this.userColor,
        hasFansMedal: this.hasFansMedal,
      };
    }
  }
}

module.exports = MessageModel;
