import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "nprogress/nprogress.css";

import "./permission";

const app = createApp(App);
app.use(router);
app.use(store);
// 引入所有的icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
import "virtual:windi.css";

import permission from "@/directives/permission.js";
app.use(permission);

app.mount("#app");
