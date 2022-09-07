<template>
	<div class="form-control py-3">
		<h2 class="mb-4">
			Matchmaking
		</h2>
		<div v-if="!isQueued">
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
		<div v-else class="d-flex-col justify-content-between w-100">
			<div class="d-flex justify-content-between w-100">
				<h4 class="ms-4 text-primary">
					Looking for opponent...
				</h4>
				<span class="me-4 spinner-border text-primary"/>
			</div>
			<button @click="stopMatchmaking()" class="mt-2 btn btn-primary d-flex justify-content-around w-100">
				<div>
					Stop matchmaking
					<i class="ms-2 bi-square-fill" />
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { ref, computed } from "vue";

const selectedGameType = ref("classic");
const isQueued = computed(() => store.getters["game/isQueued"]);
const queueType = computed(() => store.state.game.queueType);

function startMatchmaking() {
	store.dispatch("game/addQueue", selectedGameType.value);
}

function stopMatchmaking() {
	store.dispatch("game/delQueue");
}
</script>