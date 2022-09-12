<template>
  <div class="d-flex justify-content-between w-100">
    <h2>Current games</h2>
    <button :key="refresh" @click="getGames()" class="btn btn-primary">Refresh 
      <i class="bi bi-arrow-repeat"></i>
    </button>
  </div>
  <div
    v-for="(game, id) in games"
    :key="id"
    class="d-flex-col w-100 w-75-lg card mt-3"
  >
    <h5 class="card-header">
      <span class="text-primary">{{ game.p1Nick }}</span> vs
      <span class="text-danger">{{ game.p2Nick }}</span>
    </h5>
    <div class="row w-100 card-body">
      <div class="col-6">
        <h5>Game type</h5>
        <h5 class="card-subtitle text-muted">{{ game.type }}</h5>
      </div>
      <div class="col-6">
        <h5>Score</h5>
        <h5 class="card-subtitle">
          <span class="text-primary">{{ game.p1Score }}</span> /
          <span class="text-danger">{{ game.p2Score }}</span>
        </h5>
      </div>
    </div>
    <div class="card-footer">
		<button @click="spectateGame(game.id)" class="btn btn-primary">Spectate</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "@vue/runtime-core";
import { store } from "@/store";

const games = computed(() => store.state.game.gameList);

const refresh = ref(false);

function getGames() {
  refresh.value = !refresh.value;
  store.dispatch("game/getGames");

}

function spectateGame(gameId: string) {
  store.dispatch("game/spectateGame", gameId);
}

onMounted(() => {
  store.dispatch("game/getGames");
});
</script>