import { createRouter, createWebHashHistory } from "vue-router";

// 默认路由
const routes = [
  {
    path: "/",
    name: "admin",
    component: () => import("@/layouts/admin.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/LoginView.vue"),
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/404View.vue"),
    meta: {
      title: "页面不存在",
    },
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("../views/test.vue"),
    meta: {
      title: "test",
    },
  },
];

// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: () => import("../views/goods/list.vue"),
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: () => import("../views/category/list.vue"),
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: () => import("../views/user/list.vue"),
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: () => import("../views/order/list.vue"),
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: () => import("../views/manager/list.vue"),
    meta: {
      title: "管理员列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: () => import("../views/comment/list.vue"),
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: () => import("../views/image/list.vue"),
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: () => import("../views/notice/list.vue"),
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: () => import("../views/setting/base.vue"),
    meta: {
      title: "配置",
    },
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: () => import("../views/setting/buy.vue"),
    meta: {
      title: "支付设置",
    },
  },
  {
    path: "/setting/ship",
    name: "/setting/ship",
    component: () => import("../views/setting/ship.vue"),
    meta: {
      title: "物流设置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: () => import("../views/coupon/list.vue"),
    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: () => import("../views/access/list.vue"),
    meta: {
      title: "菜单权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: () => import("../views/role/list.vue"),
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: () => import("../views/skus/list.vue"),
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: () => import("../views/level/list.vue"),
    meta: {
      title: "会员等级",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

// 动态添加路由的方法
export function addRoutes(menus) {
  // 是否有新的路由
  let hasNewRoutes = false;
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRoutes = true;
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child);
      }
    });
  };

  findAndAddRoutesByMenus(menus);

  return hasNewRoutes;
}
