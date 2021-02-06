import { IpcRenderer } from 'electron';
import { createApp } from 'vue';
import App from './App.vue';
import '@/renderer/styles/index.styl';

createApp(App)
  .mount('#app');

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    btts: any;
  }
}
