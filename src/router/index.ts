import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFound.vue";
import AboutView from "@/views/AboutView.vue";

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
    path: "/register",
    name: "RegisterView",
    meta: {
      title: "Register",
    },
    component: RegisterView,
  },
  // {
  //   path: "/login",
  //   name: "LoginView",
  //   meta: {
  //     title: "Login",
  //   },
  //   component: LoginView,
  // },
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
