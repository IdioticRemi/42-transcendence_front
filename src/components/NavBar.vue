<template>
  <nav class="position-sticky sticky-top navbar navbar-dark navbar-expand-lg bg-dark mb-4">
    <div class="container">
      <ul class="navbar-nav d-flex flex-row">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li v-if="connected && isPlaying" class="nav-item">
          <router-link class="nav-link ms-2" to="/pong">Pong</router-link>
        </li>
        <li v-if="connected" class="nav-item d-block d-lg-none">
          <router-link class="nav-link ms-2" to="/chat">Chat</router-link>
        </li>
        <li v-if="connected && !isPlaying" class="nav-item">
          <router-link class="nav-link ms-2" to="/spectate">Spectate</router-link>
        </li>
      </ul>

      <div v-if="connected" class="navbar-nav d-flex flex-row">
        <router-link class="nav-link p-0" :to="`/profile/${user.id}`">
          <img
            v-if="user.hasOwnProperty('username')"
            class="rounded"
            style="object-fit: cover; width: 40px; height: 40px"
            :src="`${CONST.BackendURL}/users/avatar/${user.id}/${refresh}`"
            alt="profile picture"
          />
        </router-link>
        <router-link class="nav-link mx-2 py-2" :to="`/profile/${user.id}`">
          {{ user.nickname }}
        </router-link>
        <a class="nav-link link-danger" @click="logoutUser">Logout</a>
      </div>
      <div v-else>
        <a class="nav-link link-success" @click="loginUser">Login</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import CONST from "@/utils/const";
import { store } from "@/store";
import { computed, onMounted } from "vue";
import router from "@/router";

const connected = computed(() => store.getters["auth/isConnected"]);
const user = computed(() => store.state.auth.user);
const refresh = computed(() => store.state.refreshAvatar);
const isPlaying = computed(() => !!store.state.game.gameData);

function logoutUser() {
  store.dispatch("auth/logout");
  window.location = `${CONST.BackendURL}/`;
}

function loginUser() {
  window.location = `${CONST.BackendURL}/auth`;
}

onMounted(async () => {
  if (localStorage.getItem("token") && !connected.value) {
    router.push("/login");
  }
});
</script>
