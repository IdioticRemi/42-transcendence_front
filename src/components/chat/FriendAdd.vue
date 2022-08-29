<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between p-2">
      <h3 class="mb-3 mt-2">Add a friend</h3>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_CHANNELS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
    <div class="d-flex flex-column justify-content-between w-100" id="chan-list">
      <div>
        <input
            v-model="friendName"
            class="form-control me-2"
            placeholder="my awesome friend"
        />
      </div>
      <button class="btn btn-primary" @click="addFriend()">
        Send friend request
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const friendName = ref("");

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function addFriend() {
  store.dispatch("chat/sendFriendRequest", friendName.value);
  friendName.value = "";

  store.dispatch("chat/setAction", ChatActions.FRIEND_LIST);
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>