<template>
  <LoginView v-if="!co" />
  <router-view v-else />
</template>

<script>
import LoginView from "./views/LoginView.vue";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    LoginView,
  },
  data() {
    return {
      co: false,
    };
  },
  mounted() {
    const store = useStore();
    this.co = computed(() => store.getters["auth/isConnected"]);
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
