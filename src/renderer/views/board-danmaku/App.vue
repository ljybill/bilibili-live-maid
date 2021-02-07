<style lang="stylus" scoped>
.container
  background-color rgba(0, 0, 0, .4)
  color aliceblue
  height 100%
  box-sizing border-box
  overflow hidden
  display flex
  flex-direction column

header
  padding 26px 6px 6px
  display flex
  justify-content space-between
  align-items center
  border-bottom 1px solid red
  flex none

nav
  flex none
  box-sizing border-box
  padding 12px 6px
  transition all 0.3s
  display flex
  flex-direction column

  & > i
    margin-bottom 10px

  &.hide
    visibility hidden
    width 0
    padding 12px 0
    font-size 0

main
  flex 1
  height calc(100% - 59px)
  display flex

.content
  flex 1
  // 因为 header 高度51px
  height 100%
  padding-left 6px
  overflow-y auto

.fan-medal
  background-color #CC6600
  margin-right 0.4em
</style>

<template>
  <div class="container">
    <header>
      <div>
        <i
          @click="isShowNav = !isShowNav"
          class="icon-btn"
          :class="isShowNav ? 'icon-expand' : 'icon-collapse'"
        />
      </div>
      <div>人气: <span class="rainbow">{{ online }}</span></div>
    </header>
    <main>
      <nav :class="{'hide': !isShowNav}">
        <i class="icon-btn icon-game"></i>
        <i
          @click="isPin = !isPin"
          class="icon-btn" :class="isPin ? 'icon-pin' : 'icon-pin-outline'"
        />
        <i
          @click="isBotNotice = !isBotNotice"
          class="icon-btn" :class="isBotNotice ? 'icon-alarm' : 'icon-alarm-cancel'"
        />
      </nav>
      <div class="content">
        <div v-for="item in msgList" :key="item.timeStamp">
          <p v-if="item.type === MESSAGE_TYPE_DANMU">
            <span
              v-if="item.fansMedalName"
              class="fan-medal">
              Lv{{ item.fansMedalLevel }} {{ item.fansMedalName }}
            </span>
            <b>{{ item.nickname }}</b>
            <span>说：{{ item.content }}</span>
          </p>
          <p v-else-if="item.type === MESSAGE_TYPE_JOIN">
            <span
              v-if="item.fansMedalName"
              class="fan-medal">
              Lv{{ item.fansMedalLevel }} {{ item.fansMedalName }}
            </span>
            <b>{{ item.nickname }}</b>
            <span style="font-size: 0.8em;">进入了直播间，欢迎</span>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { MESSAGE_TYPE_DANMU, MESSAGE_TYPE_JOIN, UPDATE_TTS_TOKEN } from '@/shared/constants';
import { defineComponent } from 'vue';
import btts from '@/renderer/services/btts';

export default defineComponent({
  name: 'danmaku',
  data() {
    return {
      msgList: [] as Array<any>,
      online: 0 as number,
      isShowNav: true as boolean,
      isPin: false as boolean,
      isBotNotice: false as boolean,
      token: '' as string,
    };
  },
  methods: {
    listenMainProcessMessage() {
      window.ipcRenderer.on(MESSAGE_TYPE_JOIN, (evt: any, messageData: any) => {
        this.msgList.push(messageData);

        this.scrollBoxToBottom('main > .content');
        if (this.isBotNotice) {
          this.speak(`欢迎 ${messageData.nickname} 进入直播间`);
        }
      });

      window.ipcRenderer.on(MESSAGE_TYPE_DANMU, (evt: any, messageData: any) => {
        this.msgList.push(messageData);

        this.scrollBoxToBottom('main > .content');
        if (this.isBotNotice) {
          this.speak(`${messageData.nickname} 说 ${messageData.content}`);
        }
      });

      window.ipcRenderer.on('online_changed', (evt: any, online: number) => {
        // 直播间人气发生变化
        this.online = online;
      });

      window.ipcRenderer.on(UPDATE_TTS_TOKEN, (evt: any, token: string) => {
        localStorage.setItem('token', token);
        this.token = token;
      });
    },

    scrollBoxToBottom(selector: string) {
      setTimeout(() => {
        document.querySelector(selector)
          ?.scrollTo({
            top: 999999,
            left: 0,
          });
      }, 100);
    },

    sendMessageToWindow() {
      window.ipcRenderer.send('change_window_pin', this.isPin);
    },

    speak(text: string) {
      if (!text) {
        return;
      }
      btts({
        tex: text,
        tok: this.token,
        cuid: 'hello_world',
        spd: 5,
        pit: 5,
        vol: 15,
        per: 4,
      }, {
        volume: 0.5,
        autoDestroy: true,
        timeout: 10000,
        hidden: true,
        autoplay: true,
      });
    },
  },
  watch: {
    isPin() {
      this.sendMessageToWindow();
    },
  },

  mounted() {
    this.listenMainProcessMessage();
    this.sendMessageToWindow();
    this.token = localStorage.getItem('token') || '';
  },
  setup() {
    return {
      MESSAGE_TYPE_DANMU,
      MESSAGE_TYPE_JOIN,
    };
  },
});
</script>
