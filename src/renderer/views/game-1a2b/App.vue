<style lang="stylus" scoped>
.container
  background-color rgba(0, 0, 0, .4)
  color aliceblue
  height 100%
  box-sizing border-box
  overflow hidden
  display flex
  flex-direction column
  padding-top 16px

.answer
  flex none
  display flex
  justify-content center
  align-items center
  padding 12px 0

  & > span
    border 1px solid red
    font-size 1.5em
    line-height 1.5em
    width 1.5em
    text-align center
    margin 0 8px

.log
  font-family Verdana;
  display flex
  flex-direction column-reverse
  max-height calc(100% - 32px)
  overflow auto

  &-container
    flex 1
    padding 0 6px;
    overflow hidden;

    & > .status
      margin-block-start 0
      margin-block-end 0
      display flex
      justify-content space-between
      line-height 32px

  &-item
    display flex

    & > span:nth-child(1)
      flex 1;

    & > span:nth-child(2)
      flex 2;

    & > span:nth-child(3)
      flex 2;
</style>

<template>
  <div class="container">
    <div class="answer" @dblclick="isRight = !isRight">
      <span>{{ isRight ? answer[0] : '?' }}</span>
      <span>{{ isRight ? answer[1] : '?' }}</span>
      <span>{{ isRight ? answer[2] : '?' }}</span>
      <span>{{ isRight ? answer[3] : '?' }}</span>
    </div>
    <div class="log-container">
      <p class="status">
        <span>记录</span>
        <span>挑战者: {{ nickname }}</span>
      </p>
      <div class="log">
        <p class="log-item" v-for="(item, index) in logs" :key="index">
          <span>{{ index + 1 }}:</span>
          <span>{{ item.input }}</span>
          <span v-if="item.isRight">回答正确!</span>
          <span v-else>{{ item.feedback }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { genAnswer, judge, validate } from '@/renderer/services/1a2b';

export default defineComponent({
  name: 'game-1a2b',
  data() {
    return {
      logs: [] as Array<any>,
      answer: genAnswer(),
      startTime: Date.now(),
      endTime: Date.now(),
      isRight: false,
      nickname: '',
    };
  },
  methods: {
    listenMainProcessMessage() {
      window.ipcRenderer.on('1a2b_input', (evt: any, data: string) => {
        if (!validate(data)) {
          // 输入错误
        }
        const result = judge(data, this.answer);
        if (result.isRight) {
          this.isRight = true;
          this.endTime = Date.now();
        }
        this.logs.push({
          input: data,
          ...result,
        });
      });

      window.ipcRenderer.on('init', (evt: any, nickname: string) => {
        this.nickname = nickname;
      });
    },
  },
  mounted() {
    this.listenMainProcessMessage();
  },
});
</script>
