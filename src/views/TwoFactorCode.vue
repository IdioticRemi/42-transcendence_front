<template>
	<div class="">
    <h3 class="mb-4">Two-Factor Authentication</h3>
    <input type="text" v-model="code" placeholder="input 6-digit Code..." class="form-control mb-2" />

    <div class="d-flex justify-content-between">
      <button @keypress.enter="sendCode()"
        @click="sendCode()"
        class="btn btn-primary justify-content-around d-flex w-100"
      >
      <div class="">
                Authenticate
      </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { store } from "@/store";
import { sendBackendRequest } from "@/utils/user";
import router from "@/router";

// const show2faCodeModal = computed(() => store.state.show2faCodeModal);

const code = ref("");
let userId: string | null;

onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  userId = query.get("userId");
})

async function sendCode() {
  if (!code.value || !userId) {
    console.debug("error", code.value, userId);
    return;
  }

  console.debug("sending code to backend");
  const r = await sendBackendRequest('/auth/verify-2fa', {method: 'POST', body: JSON.stringify({'2fa_code': code.value, 'userId': parseInt(userId)}), headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  }});
  console.debug(r.payload);
  if (r.status === 'success') {
	  store.state.auth.token = r.payload.token;
	  console.debug(store.state.auth.token);
    store.dispatch("alert/addSuccess", "2FA authentified");
    router.push(`/login?token=${r.payload.token}`)
  }
  else {
    store.dispatch("alert/addError", r.message);
  }
  // close2faCodeModal();
}

// function close2faCodeModal() {
//   store.state.show2faCodeModal = false;
// }

</script>

<style scoped>


</style>