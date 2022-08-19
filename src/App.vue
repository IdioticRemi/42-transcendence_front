<template>
  <NavBar />
  <div class="container-fluid row">
    <div class="d-none d-lg-flex col-0 col-lg-3 px-lg-0">
      <SideChat v-if="connected" />
    </div>
    <div class="col-12 col-lg-9">
      <div class="container">
        <LoginView v-if="!connected" />
        <router-view v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import LoginView from "./views/LoginView.vue";
import { store } from "@/store";
import { computed } from "vue";
import NavBar from "@/components/NavBar";
import SideChat from "@/components/SideChat";

const connected = computed(() => store.getters["auth/isConnected"]);

import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
</script>

<style>
a:hover {
  cursor: pointer !important;
}
</style>
