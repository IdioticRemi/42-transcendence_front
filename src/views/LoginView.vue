<template>
  <h2 v-if="failedLogin" style="color: #ff4242">
    Failed to authenticate, please retry !
  </h2>
  <h1>Welcome To Transcendence</h1>
</template>

<script setup>
import { store } from "@/store/index";
import { onMounted } from "vue";

let failedLogin = false;

onMounted(async () => {
  const query = new URLSearchParams(window.location.search);

  if (query.get("token")) {
    localStorage.setItem("token", query.get("token"));
    window.history.replaceState(
      {},
      null,
      window.location.origin + window.location.pathname
    );
  }
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("token") === "null") {
      failedLogin = true;
      store.commit("auth/logout");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/auth/check?token=" + token, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:8081",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET",
      },
    });
    const json_data = await res.json();

    if (!res.ok) {
      failedLogin = true;
      store.commit("auth/logout");
      return;
    }

    store.commit("auth/login", { token, user: json_data });
  }
});
</script>
