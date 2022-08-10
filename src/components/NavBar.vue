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
        <li v-if="connected" class="nav-item">
          <router-link class="nav-link" to="/profile">Profile</router-link>
        </li>
      </ul>

      <div v-if="connected" class="d-flex flex-row">
        <img
          v-if="user.hasOwnProperty('username')"
          class="rounded"
          style="
            object-fit: cover;
            width: 2rem;
            height: 2rem;
            cursor: pointer !important;
          "
          v-bind:src="'http://localhost:3000/users/avatar/' + user.username"
          alt="profile picture"
        />
        <p class="my-2 mx-2 text-light">{{ user.username }}</p>
        <a class="my-2 nav-link link-danger" @click="logoutUser">Logout</a>
      </div>
      <div v-else>
        <a class="my-2 nav-link link-success" @click="loginUser">Login</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
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
