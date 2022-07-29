<template>
  <nav-bar />
  <pong-game />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PongGame from "@/components/PongGame.vue";
import NavBar from "@/components/NavBar.vue";
export default defineComponent({
  name: "PongView",
  components: {
    PongGame,
    NavBar,
  },
});
</script>
