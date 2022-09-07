<template>
  <div class="modal fade show d-block modal-bg" role="dialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Invite to play</h3>
          <button @click="cancelInvite()" class="btn-close"></button>
        </div>
        <div v-if="!isQueued" class="modal-body">
          <label class="ms-1 mb-1">Nickname</label>
          <input type="text" v-model="targetUser" class="form-control mb-2" />

          <label class="ms-1 mb-1">Game type</label>
          <div class="d-flex justify-content-between">
            <select v-model="selectedGameType" class="form-select">
              <option value="classic">Classic</option>
              <option value="custom">Custom</option>
            </select>
            <button
              @click="inviteUser()"
              class="ms-2 btn btn-outline-success d-flex"
            >
              Play
              <i class="ms-2 bi-play-fill" />
            </button>
          </div>
        </div>
        <div v-else class="modal-body d-flex justify-content-between">
          <h4 class="text-primary">Waiting for response...</h4>
          <span class="spinner-border text-primary" />
        </div>
        <div v-if="isQueued" class="modal-footer">
          <button
            @click="cancelInvite()"
            class="btn btn-primary d-flex justify-content-around w-100"
          >
            <div>
              Cancel invite
              <i class="ms-2 bi-square-fill" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { store } from "@/store";
import { ref, computed, onMounted } from "vue";

const targetUser = ref("");

const selectedGameType = ref("classic");
const isQueued = computed(() => store.getters["game/isQueued"]);

function inviteUser() {
  store.dispatch("game/inviteUser", { nickname: targetUser.value, type: selectedGameType.value });
}

function cancelInvite() {
  if (isQueued.value) {
    store.dispatch("game/uninviteUser", { nickname: targetUser.value, type: selectedGameType.value });
  } 
  store.state.game.isInviting = false;
}

onMounted(() => {
  targetUser.value = store.state.game.inviteTarget;
  store.state.game.inviteTarget = "";
});
</script>

<style scoped>
.modal-bg {
  background: rgba(0, 0, 0, 0.25) !important;
}
</style>

