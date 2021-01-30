import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/index.styl';

declare global {
  interface Window {
    ipcRenderer: any; // 自定义全局变量
  }
}

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
