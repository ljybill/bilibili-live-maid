<style lang="stylus">
body
  padding-top 34px
  box-sizing border-box
  background-color rgba(0, 0, 0, .4)

.online
  position fixed
  right 0
  top 0
  line-height 34px
  padding-right 8px
  color aliceblue

.list
  height 100%
  padding 0 8px
  color aliceblue
  font-weight 600
  display flex
  flex-direction column

  .a
    flex 1
    overflow auto
    border-bottom 2px solid #db0021

  .b
    flex 3
    overflow auto
</style>
<template>
  <div class="online">人气：{{ online }}</div>
  <div class="list">
    <div id="abc" class="a">
      <MessageItem v-for="(item) in joinList" :key="'join - ' + item.timeStamp" :message="item"/>
    </div>
    <div id="cba" class="b">
      <MessageItem v-for="(item) in messageList" :key="'msg -' + item.timeStamp" :message="item"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
} from 'vue';
import MessageItem from './Item.vue';

// interface IMessage {
//   type: 'msg' | 'join'; // 消息类型
//   nickname: string; // 用户昵称
//   content?: string; // 消息内容
// }

const MESSAGE_TYPE_DANMU = 'danmu'; // 弹幕消息
const MESSAGE_TYPE_JOIN = 'join'; // 进场消息
const MESSAGE_TYPE_GIFT = 'gift'; // 礼物消息

export default defineComponent({
  name: 'danmu_list',
  props: {},
  components: {
    MessageItem,
  },
  data() {
    return {
      messageList: [] as Array<any>,
      joinList: [] as Array<any>,
      online: 0,
    };
  },
  watch: {},
  methods: {
    listenMainProcessMessage() {
      window.ipcRenderer.on(MESSAGE_TYPE_JOIN, (evt: any, messageData: any) => {
        this.joinList.push(messageData);
        this.scrollToBottom('#abc');
      });

      window.ipcRenderer.on(MESSAGE_TYPE_DANMU, (evt: any, messageData: any) => {
        this.messageList.push(messageData);
        this.scrollToBottom('#cba');
      });

      window.ipcRenderer.on('online_changed', (evt: any, online: number) => {
        // 直播间人气发生变化
        this.online = online;
      });
    },
    scrollToBottom(selector: string) {
      nextTick(() => {
        document.querySelector(selector)
          ?.scrollTo({
            top: 999999,
            left: 0,
            behavior: 'smooth',
          });
      });
    },
  },
  mounted() {
    this.listenMainProcessMessage();
  },
});
</script>
