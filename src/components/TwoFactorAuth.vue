<template>
    <div class="d-flex-col justify-content-end">
		<button v-if="twoFactorEnabled" class="btn btn-danger" @click="disable2fa()">Disable 2FA</button>
		<button v-else class="btn btn-sm btn-primary my-2 " @click="enable2fa()">Enable 2FA</button>

		<img v-if="qrcode" :src="qrcodeURI" alt="qrcode">
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { store } from "@/store";
import { sendBackendRequest } from "@/utils/user";

const twoFactorEnabled = computed(() => store.state.auth.user?.otp_enabled);
const qrcodeURI = ref("");
const qrcode = ref(false);

async function enable2fa() {
	const r = await sendBackendRequest('auth/generate', {method: 'POST'});
	if (r.status === 'success') {
		qrcodeURI.value = r;
		qrcode.value = true;
	}
}

async function disable2fa() {
	const r = await sendBackendRequest('auth/disable-2fa', {method: 'POST'});
	if (r.status === 'success')
		store.state.auth.user!.otp_enabled = false; //TODO mutation ??
}

</script>

<style scoped>


</style>