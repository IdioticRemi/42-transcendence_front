<template>
  <h1>Home page</h1>
  <br><br>
  <div class="row w-100 d-flex justify-content-around">
    <div class="col-12 col-lg-10 col-xl-8">
      <PlayMenu v-if="isConnected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayMenu from "@/components/PlayMenu.vue";
import { computed } from "@vue/runtime-core";
import { store } from "@/store"

const isConnected = computed(() => store.getters["auth/isConnected"]);

</script>