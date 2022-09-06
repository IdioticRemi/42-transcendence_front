<template>
  <h1>Authenticating...</h1>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { ref, onMounted } from "vue";
import router from "@/router";

const failedLogin = ref(false);

function sendToHome(success: boolean) {
  router.push(success ? "/" : "/?login=fail");
}

onMounted(async () => {
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");

  if (token) {
    localStorage.setItem("token", token);
  }
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("token") === "null") {
      failedLogin.value = true;
      await store.dispatch("auth/logout");
      sendToHome(false);
      return;
    }

    const token = localStorage.getItem("token");

    //TODO: replace with real URI
    const res = await fetch("http://localhost:3000/auth/check?token=" + token);
    const json_data = await res.json();

    if (!res.ok || json_data.error) {
      failedLogin.value = true;
      await store.dispatch("auth/logout");
    } else {
      await store.dispatch("auth/login", { token, user: json_data.content });
    }
    sendToHome(true);
  }
});
</script>
