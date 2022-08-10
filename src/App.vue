<template>
  <NavBar />
  <div class="container">
    <LoginView v-if="!connected" />
    <router-view v-else />
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import LoginView from "./views/LoginView.vue";
import { store } from "@/store/index";
import { computed } from "vue";
import NavBar from "@/components/NavBar";

const connected = computed(() => store.getters["auth/isConnected"]);

import "bootstrap/dist/js/bootstrap";
</script>

<style>
a:hover {
  cursor: pointer !important;
}
</style>
