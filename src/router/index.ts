import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFound.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import PongView from "@/views/PongView.vue";
import LoginView from "@/views/LoginView.vue";
import ChatView from "@/views/ChatView.vue";
import TwoFactorCode from "@/views/TwoFactorCode.vue";
import SpectateView from "@/views/SpectateView.vue";
import {store} from "@/store";

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
    path: "/login",
    name: "LoginView",
    meta: {
      title: "Login callback"
    },
    component: LoginView,
  },
  {
    path: "/2fa",
    name: "TwoFactorCode",
    meta: {
      title: "Two-Factor Auth"
    },
    component: TwoFactorCode,
  },
  {
    path: "/chat",
    name: "ChatView",
    meta: {
      title: "Chat"
    },
    component: ChatView,
  },
  {
    path: "/profile/:id",
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
    path: "/spectate",
    name: "Spectate",
    meta: {
      title: "Spectate",
    },
    component: SpectateView,
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

router.beforeEach(async (to) => {
  if (!(store.getters["auth/isConnected"]) && !['/', '/login', '/2fa'].includes(to.path))
    return { path: '/' }
});

export default router;
