<template>
  <div class="d-flex justify-content-end position-fixed" style="top: 4rem; right: 1rem; z-index: 1500 !important;">
    <div class="d-flex-col">
      <TransitionGroup name="fade">
        <div v-for="(error, id) in errors" class="alert alert-danger" :key="id">
          {{ error }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { store } from "@/store";

const errors = computed(() => store.state.error.errors);
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
