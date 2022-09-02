<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
      <h3>#{{ selectedChannel?.name }}</h3>
      <div>
        <button class="btn btn-primary" @click="goToSettings()">
          <i class="bi bi-gear" />
        </button>
        <button class="btn btn-primary mx-2" @click="goToUserList()">
          <i class="bi bi-people" />
        </button>
        <button class="btn btn-primary" @click="unselectChannel()">
          <i class="bi bi-arrow-return-left" />
        </button>
      </div>
    </div>
    <div class="overflow-scroll" id="msg-list">
      <div v-for="(msg, id) in messages" class="w-100" :key="id">
        <router-link class="m-0 p-0 mb-1" :to="`/profile/${msg.user}`">{{
            msg.nick
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
          :disabled="mySanctions?.muted"
      />
      <button class="btn btn-primary" @click="sendMessage()" :disabled="mySanctions?.muted">
        <i class="bi bi-send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const messageContent = ref("");

const mySanctions = computed(() => store.getters["chat/getMySanctions"]);
const selected = computed(() => store.state.chat.selected);
const channels = computed(() => store.state.chat.channels);
const blocked = computed(() => store.state.chat.blocked);
const selectedChannel = computed(() => channels.value.get(selected.value || -1));
const messages = computed(
    () => channels.value.get(selected.value || -1)?.messages.filter(m => !blocked.value.has(m.user))
);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function sendMessage() {
  store.dispatch("chat/newMessage", messageContent.value);
  messageContent.value = "";
}

function goToUserList() {
  store.dispatch("chat/getChannelUserList");
  setAction(ChatActions.CHANNEL_USERS);
}

function goToSettings() {
  store.dispatch("chat/getChannelUserList");
  setAction(ChatActions.CHANNEL_SETTINGS);
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