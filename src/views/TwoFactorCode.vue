<template>
	<div>
    <h3 class="mb-4">Two-Factor Authentication</h3>
    <input @keydown.enter="sendCode()" type="text" v-model="code" placeholder="6-digit code..." class="form-control mb-2" />

    <div class="d-flex justify-content-between">
      <button 
        @click="sendCode()"
        class="btn btn-primary justify-content-around d-flex w-100"
      >
        <div>
          Authenticate
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { store } from "@/store";
import { sendBackendRequest } from "@/utils/user";
import router from "@/router";

const code = ref("");
let userId: string | null;

onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  userId = query.get("userId");
})

async function sendCode() {
  if (!code.value || !userId) {
    return;
  }

  const r = await sendBackendRequest('/auth/verify-2fa', {method: 'POST', body: JSON.stringify({'2fa_code': code.value, 'userId': parseInt(userId)}), headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  }});
  if (r.status === 'success') {
	  store.state.auth.token = r.payload.token;
    store.dispatch("alert/addSuccess", "2FA authentified");
    router.push(`/login?token=${r.payload.token}`)
  }
  else {
    store.dispatch("alert/addError", r.message);
  }
}

</script>

<style scoped>


</style>