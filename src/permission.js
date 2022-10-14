import router from "@/router";
import store from "./store";
import { getToken } from "@/composables/auth.js";
import { toast, showFullLoading, hideFullLoading } from "@/composables/util.js";

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 显示loading
  showFullLoading();
  const token = getToken();

  // 没有登录,强制跳转到登录页
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({ path: "/login" });
  }

  // 防止重复登录
  if (token && to.path == "/login") {
    toast("请勿重复登录", "error");
    return next({ path: from.path ? from.path : "/" });
  }

  // 如果用户登录了 就获取用户信息 并存储到vuex
  if (token) {
    try {
      // try  catch 捕获await的错误
      // await 配合 async 处理异步操作
      const res = await store.dispatch("getInfo");
      console.log("res", res);
    } catch (err) {
      console.log(err + "  getInfo");
    }
  }

  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title : ""}   - xx后台管理系统`;
  
  next(); // 如果有next 一定要放行
});

// 全局后置守卫
router.afterEach(() => {
  hideFullLoading();
});
