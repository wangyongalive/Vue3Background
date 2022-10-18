import axios from "axios";
import { getToken } from "@/composables/auth.js";
import { toast } from "@/composables/util.js";
import store from "./store"; // js中引入store

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // const cookie = useCookies();
    // const token = cookie.get("admin-token");
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data.data;
  },
  function (error) {
    // ElNotification({
    //   message: `${error.response.data.msg}` || "请求失败",
    //   type: "error",
    //   duration: 3000,
    // });
    const msg = `${error.response.data.msg}` || "请求失败";
    if (msg === "非法token，请先登录！") {
      // 退出登陆 logout 清空token vuex  最后刷新页面
      store.dispatch("logout").finally(() => location.reload());
    }
    toast(msg, "error");
    return Promise.reject(error);
  }
);

export default instance;
