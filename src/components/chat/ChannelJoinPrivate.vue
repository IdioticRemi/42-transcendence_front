<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between p-2">
      <h3 class="mb-3 mt-2">Join Private Channel</h3>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_AVAILABLE_CHANNELS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
    <div class="d-flex flex-column justify-content-between w-100" id="chan-list">
      <div>
        <input
            v-model="channelName"
            class="form-control me-2 mb-2"
            placeholder="channel name (case sensitive)"
        />
        <input
            v-model="channelPassword"
            class="form-control me-2"
            placeholder="channel password if set"
        />
      </div>
      <button class="btn btn-primary" @click="joinPrivateChannel()">
        Join Private Channel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const channelName = ref("");
const channelPassword = ref("");

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function joinPrivateChannel() {
  store.dispatch("chat/joinPrivateChannel", {
    channelName: channelName.value,
    password: channelPassword.value
  });

  channelName.value = "";
  channelPassword.value = "";
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>