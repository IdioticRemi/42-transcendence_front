<template>
  <h2 v-if="failedLogin">Failed to authenticate, please retry !</h2>
  <h1>Welcome To Transcendence</h1>
  <a class="button" href="http://localhost:3000/auth">Proceed to login</a>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "LoginComponent",
  methods: {},
  data() {
    return {
      failedLogin: false,
    };
  },
  async mounted() {
    const store = useStore();
    const query = new URLSearchParams(window.location.search);

    if (query.get("token")) {
      localStorage.setItem("token", query.get("token"));
      history.pushState({}, null, this.$route.path);
    }
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("token") === "null") {
        this.failedLogin = true;
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/auth/check?token=" + token,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://127.0.0.1:8081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET",
          },
        }
      );
      const json_data = await res.json();

      if (!res.ok) {
        this.failedLogin = true;
        localStorage.removeItem("token", token);
        return;
      }

      store.commit("auth/login", { token, user: json_data });
    }
  },
};
</script>

<style scoped></style>
