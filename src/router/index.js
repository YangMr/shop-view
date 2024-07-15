import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/screen",
  },
  {
    path: "/screen",
    name: "Screen",
    component: () => import("@/views/ScreenPage.vue"),
  },
  {
    path: "/seller",
    name: "Seller",
    component: () => import("@/views/sellerPage/index.vue"),
  },
  {
    path: "/trend",
    name: "Trend",
    component: () => import("@/views/trendPage/index.vue"),
  },
  {
    path: "/hot",
    name: "Hot",
    component: () => import("@/views/hotPage/index.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("@/views/mapPage/index.vue"),
  },
  {
    path: "/rank",
    name: "Rank",
    component: () => import("@/views/rankPage/index.vue"),
  },
  {
    path: "/stock",
    name: "Stock",
    component: () => import("@/views/stockPage/index.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
