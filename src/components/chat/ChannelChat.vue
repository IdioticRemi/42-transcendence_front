<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
      <h3>#{{ selectedChannel?.name }}</h3>
      <div>
        <button class="btn btn-danger" @click="deleteChannel(selected)">
          <i class="bi bi-trash" />
        </button>
        <button class="btn btn-warning mx-2" @click="leaveChannel(selected)">
          <i class="bi bi-door-open" />
        </button>
        <button class="btn btn-primary" @click="unselectChannel()">
          <i class="bi bi-arrow-return-left" />
        </button>
      </div>
    </div>
    <div class="overflow-scroll" id="msg-list">
      <div v-for="(msg, id) in messages" class="w-100" :key="id">
        <router-link class="m-0 p-0 mb-1" :to="'/user/' + msg.user">{{
            msg.user
          }}</router-link>
        <p class="text-secondary m-0 p-0">{{ msg.content }}</p>
        <hr class="w-auto m-2" />
      </div>
    </div>
    <div class="d-flex flex-row justify-content-end">
      <input
          v-model="messageContent"
          class="form-control me-2"
          placeholder="message..."
          @keydown.enter="sendMessage()"
      />
      <button class="btn btn-primary" @click="sendMessage()">
        <i class="bi bi-send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {store} from "@/store";

const messageContent = ref("");

const selected = computed(() => store.state.chat.selected);
const channels = computed(() => store.state.chat.channels);
const selectedChannel = computed(() => channels.value.get(selected.value || -1));
const messages = computed(
    () => channels.value.get(selected.value || -1)?.messages
);

function sendMessage() {
  store.dispatch("chat/newMessage", messageContent.value);
  messageContent.value = "";
}

function deleteChannel(channelId: number) {
  if (channelId < 0)
    return;
  store.dispatch("chat/deleteChannel", channelId);
  unselectChannel();
}

function leaveChannel(channelId: number) {
  if (channelId < 0)
    return;
  store.dispatch("chat/leaveChannel", channelId);
  if (selected.value === channelId)
    unselectChannel();
}

function unselectChannel() {
  store.dispatch("chat/unselectChannel");
}
</script>

<style scoped>
#msg-list {
  height: calc(99vh - 40px - 2rem - 7rem);
}
</style>