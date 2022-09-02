<template>
  <div class="d-flex justify-content-end position-fixed" style="top: 1rem; right: 1rem; z-index: 1500 !important;">
    <div class="d-flex-col">
      <TransitionGroup name="fade">
        <div v-for="(alert, id) in alerts" :class="`alert alert-${alert.type}`" :key="id">
          {{ alert.message }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { store } from "@/store";

const alerts = computed(() => store.state.alert.alerts);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
