<template>
  <nav-bar />
  <div>
    <h1>User Profile</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  name: "UserProfileView",
  components: {
    NavBar,
  },
  methods: {},
});
</script>
