<template>
  <div v-if="message.type === 'msg'" class="message__item">
    <p><span><b>{{ message.nickname }}</b>说：</span><span>{{ message.content }}</span></p>
  </div>
  <div v-else-if="message.type === 'join'" class="message__item">
    <p><span><b>{{message.nickname}}</b> 进入了直播间，欢迎！</span></p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  name: 'danmu_item',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
});
</script>
