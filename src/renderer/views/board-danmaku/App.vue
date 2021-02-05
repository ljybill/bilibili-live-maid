<style lang="stylus" scoped>
.container
  height 100%
  background darkcyan
  box-sizing border-box
  overflow hidden

header
  padding 12px 6px
  display flex
  justify-content space-between

nav
  flex none

main
  display flex

.content
  flex 1
  padding-left 6px
</style>

<template>
  <div class="container">
    <header>
      <div>收起</div>
      <div>人气: {{ online }}</div>
    </header>
    <main>
      <nav>
        <div>
          <p>1a2b</p>
          <p>1a2b</p>
        </div>
      </nav>
      <div class="content">
        <div v-for="item in msgList" :key="item.timeStamp">
          <p v-if="item.type === MESSAGE_TYPE_DANMU"></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { MESSAGE_TYPE_DANMU, MESSAGE_TYPE_JOIN } from '@/shared/constants';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'danmaku',
  data() {
    return {
      msgList: [] as Array<any>,
      online: 0,
    };
  },
  methods: {
    listenMainProcessMessage() {
      window.ipcRenderer.on(MESSAGE_TYPE_JOIN, (evt: any, messageData: any) => {
        console.log(messageData);
        this.msgList.push(messageData);
      });

      window.ipcRenderer.on(MESSAGE_TYPE_DANMU, (evt: any, messageData: any) => {
        console.log(messageData);
        this.msgList.push(messageData);
      });

      window.ipcRenderer.on('online_changed', (evt: any, online: number) => {
        // 直播间人气发生变化
        this.online = online;
      });

      window.ipcRenderer.on('other', () => {
        console.log('other');
      });
    },
  },

  mounted() {
    this.listenMainProcessMessage();
  },
  setup() {
    return {
      MESSAGE_TYPE_DANMU,
    };
  },
});
</script>
