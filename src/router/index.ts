import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFound.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import PongView from "@/views/PongView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "HomeView",
    meta: {
      title: "Home",
    },
    component: HomeView,
  },
  {
    path: "/profile",
    name: "UserProfileView",
    meta: {
      title: "Profile",
    },
    component: UserProfileView,
  },
  {
    path: "/pong",
    name: "PongView",
    meta: {
      title: "Pong",
    },
    component: PongView,
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)",
    meta: {
      title: "Not Found",
    },
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
