<style lang="stylus" scoped>
.small
  font-size 0.8em
  color whitesmoke

</style>
<template>
  <div v-if="message.type === 'danmu'" class="message__item">
    <p><span><b>{{ message.nickname }}</b>说：</span><span>{{ message.content }}</span></p>
  </div>
  <div v-else-if="message.type === 'join'" class="message__item">
    <p>
      <b>{{ message.nickname }}</b><span class="small">进入了直播间，欢迎！</span>
    </p>
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
  mounted() {
    console.log('data', this.message);
  },
});
</script>
