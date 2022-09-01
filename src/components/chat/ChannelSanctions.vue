<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">Sanction list</h3>
    <div>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.CHANNEL_USERS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
  </div>
  <div class="overflow-scroll" id="chan-list">
    <div v-for="user in sanctions" class="w-100" :key="user.id">
      <div class="d-flex-col w-100">
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex"> <!-- LEFT PART (INFORMATIONS/ROLES) -->
            <div class="text-secondary m-0 py-2 px-0">
              {{ user.nickname }}
            </div>
          </div>
          <div class="d-flex flex-row"> <!-- RIGHT PART (ACTIONS LIKE BAN/MUTE/KICK/...) -->
            <button v-if="user.banned && myPermLevel > 0" class="btn btn-danger">
              Unban
            </button>
            <button v-if="user.muted && myPermLevel > 0" class="ms-2 btn btn-warning">
              Unmute
            </button>
          </div>
        </div>
      </div>
      <hr class="w-auto my-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const users = computed(() => store.state.chat.tempUserList?.users.sort((a, b) => b.perm - a.perm));
const authUser = computed(() => store.state.auth.user);
const myPermLevel = computed(() => store.state.chat.tempUserList?.users.find(u => u.id === authUser.value?.id)?.perm);
const sanctions = computed(() => store.state.chat.tempSanctionsList?.users);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>