<template>

	<div class="modal fade show d-block modal-bg" role="dialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Two-Factor Authentication</h3>
          <button @click="close2faModal()" class="btn-close"></button>
        </div>
        <div v-if="!twoFactorEnabled" class="modal-body">
			<div class="row w-100">
				<div class="col-lg-6 col-12 my-2">
					<img :src="qrcodeURI" alt="QRcode image">
				</div>
				<div class="col-lg-6 col-12 my-2">
					Scan QRcode with your 2fa application and input code below
				</div>

			</div>
          <input type="text" v-model="code" placeholder="input 6-digit Code..." class="form-control mb-2" />

          <div class="d-flex justify-content-between">
            <button
              @click="enable2fa()"
              class="btn btn-primary justify-content-around d-flex w-100"
            >
            <div class="">
                      Enable 2fa
            </div>
            </button>
          </div>
        </div>
        <div v-else class="modal-body d-flex justify-content-between">
          <button @click="disable2fa()" class="btn btn-danger w-100">Disable 2fa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { store } from "@/store";
import { sendBackendRequest } from "@/utils/user";

const twoFactorEnabled = computed(() => store.state.auth.user?.otp_enabled);
const qrcodeURI = ref("");
const qrcode = ref(false);
const code = ref("");

onMounted(() => {
  generateQRcode();
})

async function generateQRcode() {
	const r = await sendBackendRequest('/auth/generate', {method: 'POST'});
	if (r.status === 'success') {
		qrcodeURI.value = r.payload;
		qrcode.value = true;
	}
}

async function enable2fa() {
  if (!code.value)
    return;
  const r = await sendBackendRequest('/auth/enable-2fa', {method: 'POST', body: JSON.stringify({'2fa_code': code.value}), headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }});
  console.debug(r);
  if (r.status === 'success') {
    store.state.auth.user!.otp_enabled = true;
    store.dispatch("alert/addSuccess", "2FA is now enabled on your account");
    close2faModal();
  }
  else
    store.dispatch("alert/addError", r.message);
}
async function disable2fa() {
	const r = await sendBackendRequest('/auth/disable-2fa', {method: 'POST'});
	if (r.status === 'success') {
		store.state.auth.user!.otp_enabled = false;
    store.dispatch("alert/addSuccess", "2FA is now disabled on your account");
    close2faModal();
  }
  else {
    store.dispatch("alert/addError", r.message);
  }
}

function close2faModal() {
  store.state.show2faModal = false;
}

</script>

<style scoped>


</style>