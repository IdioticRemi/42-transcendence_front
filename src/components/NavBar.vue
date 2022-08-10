<template>
  <div>
    <router-view />
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/pong">Pong</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/about">About</router-link>
      <button @click="logoutUser">Logout</button>
    </nav>
  </div>
</template>

<script>
import { store } from "@/store/index";

export default {
  name: "NavBar",
  methods: {
    logoutUser() {
      store.commit("auth/logout");
    },
  },
};
</script>

<style scoped></style>
