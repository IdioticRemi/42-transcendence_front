<template>
  <h1>Authenticating...</h1>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { ref, onMounted } from "vue";
import router from "@/router";
import { BackendURL } from "@/utils/const";

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

    const res = await fetch(`${BackendURL}/auth/check?token=${token}`);
    const json_data = await res.json();


    if (!res.ok || json_data.status === 'error') {
      failedLogin.value = true;
      await store.dispatch("auth/logout");
    } else {
      const user = json_data.payload;

      await store.dispatch("auth/login", { token, user });
    }
    sendToHome(true);
  }
});
</script>
