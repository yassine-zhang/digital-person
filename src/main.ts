import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import piniaPersist from 'pinia-plugin-persist';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VConsole from 'vconsole';

const vConsole = new VConsole();

import "@/assets/index.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(naive);
app.use(autoAnimatePlugin);

app.mount("#app");
