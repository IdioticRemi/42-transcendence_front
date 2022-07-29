import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFound.vue";
import AboutView from "@/views/AboutView.vue";
import UserProfileView from "@/views/UserProfileView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "LoginView",
    meta: {
      title: "Login",
    },
    component: LoginView,
  },
  {
    path: "/home",
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
    name: "NotFound",
    path: "/:pathMatch(.*)",
    meta: {
      title: "Not Found",
    },
    component: NotFoundView,
  },
  {
    path: "/about",
    name: "about",
    meta: {
      title: "About",
    },
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
