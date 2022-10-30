import { ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";

export function useTabList() {
  const route = useRoute();
  const router = useRouter();
  const cookie = useCookies();

  // 获取刷新后激活的tab
  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  // 添加标签导航
  const addTab = (tab) => {
    let noTab = !tabList.value.some((t) => t.path == tab.path);
    if (noTab) {
      tabList.value.push(tab);
      cookie.set("tabList", tabList.value);
    }
  };

  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };

  // 添加一个导航守卫，在当前位置即将更新时触发
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  // 初始化标签导航列表  从cookie中获取数据
  function initTabList() {
    let tbs = cookie.get("tabList");
    if (tbs) {
      tabList.value = tbs;
    }
  }

  initTabList();

  let ff = 11111; // 在模板中可以使用 但是数值改变 模板不会变 非响应式变化

  const removeTab = (t) => {
    let tabs = tabList.value;
    let a = activeTab.value;
    if (a == t) {
      let tabIndex = tabs.findIndex((tab) => tab.path == t);
      let nextTab = tabs[tabIndex + 1] || tabs[tabIndex - 1]; // 下一个tab
      if (nextTab) {
        a = nextTab.path;
      }
    }

    activeTab.value = a; // 拿到激活的path
    tabList.value = tabList.value.filter((tab) => tab.path != t);

    cookie.set("tabList", tabList.value);
  };

  // 关闭处理
  const handleClose = (command) => {
    if (command == "clearAll") {
      // 切换回首页
      activeTab.value = "/";
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
    } else {
      // 过滤 只剩下首页和当前激活
      tabList.value = tabList.value.filter(
        (tab) => tab.path == "/" || tab.path == activeTab.value
      );
    }
    cookie.set("tabList", tabList.value);
  };

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
  };
}
