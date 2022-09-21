<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between p-2">
      <h3 class="mb-3 mt-2">Create Channel</h3>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_CHANNELS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
    <div class="d-flex flex-column justify-content-between w-100" id="chan-list">
      <div>
        <input
            v-model="channelName"
            class="form-control me-2"
            placeholder="my awesome channel"
            maxlength="64"
        />
        <div class="d-flex flex-row justify-content-between my-4 w-100">
              <span>
                Should channel be private?
              </span>
          <input
              type="checkbox"
              v-model="isChannelPrivate"
              class="me-2"
              :disabled="channelPassword.length > 0"
          />
        </div>
        <input
            v-model="channelPassword"
            class="form-control me-2"
            placeholder="my secret password"
            maxlength="128"
        />
      </div>
      <button class="btn btn-primary" @click="createChannel()">
        Create!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";
import { channelNameMaxSize, passwordMaxSize } from "@/utils/const";



const channelName = ref("");
const channelPassword = ref("");
const isChannelPrivate = ref(false);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function createChannel() {
  if (channelName.value.length > channelNameMaxSize || channelPassword.value.length > passwordMaxSize) {
    store.dispatch("alert/addWarning", "Channel name or password too long");
    return;
  }
  store.dispatch("chat/createChannel", {
    name: channelName.value,
    private: isChannelPrivate.value,
    password: channelPassword.value || null
  });

  channelName.value = "";
  channelPassword.value = "";
  isChannelPrivate.value = false;
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>