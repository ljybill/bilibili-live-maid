import { MESSAGE_TYPE_DANMU, MESSAGE_TYPE_JOIN, MESSAGE_TYPE_OTHER } from '@/shared/constants';
import { unix2normal } from '../utils';

interface IFansMedal {
  medalName: string;
  medalLevel: number;
}

class MessageModel {
  type: string;

  nickname: string;

  private userId: string;

  private content: string;

  private userLevel: number;

  private userColor: string | undefined;

  private timeStamp: number;

  private hasFansMedal: boolean;

  private fansMedal: IFansMedal;

  constructor(data: any) {
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
    this.fansMedal = {
      medalName: '',
      medalLevel: 1,
    };

    this.parse(data);
  }

  private parse(data: any) {
    if (data.op === 'SEND_SMS_REPLY') {
      switch (data.cmd) {
        case 'INTERACT_WORD': {
          this.type = MESSAGE_TYPE_JOIN;
          this.nickname = data.data.uname;
          this.userId = data.data.uid;
          this.userColor = data.data.uname_color;
          this.timeStamp = unix2normal(data.data.timestamp);
          this.hasFansMedal = !!data.data.fans_medal.medal_name;
          this.fansMedal = this.parseMedal(data.data.fans_medal);
          break;
        }
        case 'DANMU_MSG': {
          this.type = MESSAGE_TYPE_DANMU;
          try {
            // 因为是B站数据，所以结构不是自己能控制的。
            // eslint-disable-next-line prefer-destructuring
            this.nickname = data.info[2][1];
            // eslint-disable-next-line prefer-destructuring
            this.content = data.info[1];
            // eslint-disable-next-line prefer-destructuring
            this.userId = data.info[2][0];
            // eslint-disable-next-line prefer-destructuring
            this.userLevel = data.info[4][0];
            // eslint-disable-next-line prefer-destructuring
            this.fansMedal.medalName = data.info[3][1];
            // eslint-disable-next-line prefer-destructuring
            this.fansMedal.medalLevel = data.info[3][0];
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
          } else if (/开通了/.test(data.msg_self) && data.roomid !== 9167635) {
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

  // eslint-disable-next-line class-methods-use-this
  private parseMedal(medalData: any): IFansMedal {
    return {
      medalLevel: medalData?.medal_level ?? 0,
      medalName: medalData?.medal_name ?? '',
    };
  }

  public toData(): any {
    if (this.type === MESSAGE_TYPE_DANMU) {
      return {
        type: this.type,
        nickname: this.nickname,
        userId: this.userId,
        content: this.content,
        timeStamp: this.timeStamp,
        fansMedalName: this.fansMedal.medalName,
        fansMedalLevel: this.fansMedal.medalLevel,
      };
    }

    if (this.type === MESSAGE_TYPE_JOIN) {
      return {
        type: this.type,
        nickname: this.nickname,
        userId: this.userId,
        timeStamp: this.timeStamp,
        userColor: this.userColor,
        fansMedalName: this.fansMedal.medalName,
        fansMedalLevel: this.fansMedal.medalLevel,
      };
    }
    return {};
  }
}

export default MessageModel;
