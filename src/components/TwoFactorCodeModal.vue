<template>
	<div class="modal fade show d-block modal-bg" role="dialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Two-Factor Authentication Code</h3>
        </div>
        <div class="modal-body">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { store } from "@/store";
import { sendBackendRequest } from "@/utils/user";

const show2faCodeModal = computed(() => store.state.show2faCodeModal);

const code = ref("");


async function sendCode() {
  if (!code.value)
    return;
  const r = await sendBackendRequest('/auth/verify-2fa', {method: 'POST', body: JSON.stringify({'2fa_code': code.value}), headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }});
  console.debug(r);
  if (r.status === 'success') {
	  store.state.auth.otp_token = r.payload.token;
	  console.debug(store.state.auth.otp_token);
    store.dispatch("alert/addSuccess", "2FA authentified");
    close2faCodeModal();
  }
  else
    store.dispatch("alert/addError", r.message);
}

function close2faCodeModal() {
  store.state.show2faCodeModal = false;
}

</script>

<style scoped>


</style>