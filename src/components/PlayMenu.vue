<template>
	<div class="form-control py-3">
		<h2 class="mb-4">
			Matchmaking
		</h2>
		<div>
			<label class="ms-1 mb-1">Game type</label>
			<div class="d-flex justify-content-between">
				<select v-model="selectedGameType" class="form-select">
  				<option value="classic">Classic</option>
  				<option value="custom">Custom</option>
				</select>
				<button @click="startMatchmaking()" class="ms-2 btn btn-outline-success d-flex">
					Play
					<i class="ms-2 bi-play-fill" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedGameType = ref("classic");

function startMatchmaking() {
	console.debug(selectedGameType.value);
}
</script>