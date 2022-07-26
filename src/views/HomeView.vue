<template>
  <div class="home">
    <register-username></register-username>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RegisterUsername from "@/components/RegisterUsername.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    RegisterUsername,
  },
});
</script>
