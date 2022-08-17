<template>
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark mb-4">
    <div class="container">
      <ul class="navbar-nav d-flex flex-row">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li v-if="connected" class="nav-item">
          <router-link class="nav-link mx-2" to="/pong">Pong</router-link>
        </li>
      </ul>

      <div v-if="connected" class="navbar-nav d-flex flex-row">
        <router-link class="nav-link p-0" to="/profile">
          <img
            v-if="user.hasOwnProperty('username')"
            class="rounded"
            style="object-fit: cover; width: 40px; height: 40px"
            :src="CONST.BackendURL + '/users/avatar/' + user.username"
            alt="profile picture"
          />
        </router-link>
        <router-link class="nav-link mx-2 py-2" to="/profile">
          {{ user.username }}
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
import { store } from "@/store/index";
import { computed } from "vue";

const connected = computed(() => store.getters["auth/isConnected"]);
const user = computed(() => store.state.auth.user);

function logoutUser() {
  store.commit("auth/logout");
  window.location = "http://localhost:8081/";
}

function loginUser() {
  window.location = "http://localhost:3000/auth";
}
</script>
