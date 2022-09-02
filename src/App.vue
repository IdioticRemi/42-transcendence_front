<template>
  <NavBar />
  <ErrorList />
  <div class="container-fluid row mx-0">
    <div class="d-none d-lg-flex col-0 col-lg-4 col-xl-3 px-lg-0">
      <SideChat v-if="connected" />
    </div>
    <div class="col-12 col-lg-8 col-xl-9">
      <div class="container">
        <router-view :key="router.currentRoute.value.fullPath"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import { store } from "@/store";
import { computed } from "vue";
import router from "@/router"
import NavBar from "@/components/NavBar";
import SideChat from "@/components/SideChat";
import ErrorList from "@/components/AlertList";

const connected = computed(() => store.getters["auth/isConnected"]);

import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
</script>

<style>
a:hover {
  cursor: pointer !important;
}
</style>
