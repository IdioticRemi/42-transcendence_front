<template>
  <home-component />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomeComponent from "@/components/HomeComponent.vue";
export default defineComponent({
  name: "LoginView",
  components: {
    HomeComponent,
  },
});
</script>
