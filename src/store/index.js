import { createStore } from "vuex";
import { login, getInfo } from "@/api/manager.js";
import { setToken, removeToken } from "@/composables/auth.js";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边栏宽度 在菜单组件 中间组件都用到width 所以定义到Vuex中
      asideWidth: "250px",
      menus: [],
      ruleNames: [],
    };
  },
  mutations: {
    // 用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    // 展开/收起侧边
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
    // 菜单
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    // 登录 解构赋值
    login({ commit }, { usename, password }) {
      return new Promise((resolve, reject) => {
        login(usename, password)
          .then((res) => {
            // 存储cookie
            // const cookie = useCookies()
            // cookie.set('admin-token', res.token)
            setToken(res.token);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取当前用户登录信息
    getInfo({ commit }) {
      // 返回promise
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            commit("SET_USERINFO", res);
            commit("SET_MENUS", res.menus);
            commit("SET_RULENAMES", res.ruleNames);

            // f;
            resolve(res);
          })
          // .catch((err) => reject(err + "  111"));
          .catch((err) => {
            // console.log(reject(err + "  111")); // undefined
            reject(err + "  111");
          });
      });
    },
    // 退出登陆 默认返回一个promise
    logout({ commit }) {
      // 清除token
      removeToken();
      // 清空vuex
      commit("SET_USERINFO", {});
    },
    test() {
      return new Promise((resolve, reject) => {});
    },
  },
});

export default store;
