<template>
  <div
    v-if="failedLogin"
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
  >
    Your session token has expired or is invalid, please log back in.
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    />
  </div>
  <h1>Welcome To Transcendence</h1>
</template>

<script setup>
import { store } from "@/store";
import { ref, onMounted } from "vue";

const failedLogin = ref(false);

function resetURL() {
  window.history.replaceState(
    {},
    null,
    window.location.origin + window.location.pathname
  );
}

onMounted(async () => {
  const query = new URLSearchParams(window.location.search);

  if (query.get("token")) {
    localStorage.setItem("token", query.get("token"));
    resetURL();
  }
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("token") === "null") {
      failedLogin.value = true;
      store.commit("auth/logout");
      resetURL();
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/auth/check?token=" + token);
    resetURL();
    const json_data = await res.json();

    if (!res.ok || json_data.error) {
      failedLogin.value = true;
      await store.dispatch("auth/logout");
    } else {
      await store.dispatch("auth/login", { token, user: json_data.content });
    }
  }
});
</script>
