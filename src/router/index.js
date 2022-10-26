import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/admin.vue"),
      children: [
        {
          path: "/",
          component: () => import("../views/HomeView.vue"),
          meta: {
            title: "首页",
          },
        },
        {
          path: "goods/list",
          component: () => import("../views/goods/list.vue"),
          meta: {
            title: "首页",
          },
        },
        {
          path: "category/list",
          component: () => import("../views/category/list.vue"),
          meta: {
            title: "分类页面",
          },
        },
      ],
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
  ],
});

export default router;
