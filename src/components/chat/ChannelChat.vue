<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
      <h3>#{{ selectedChannel?.name }}</h3>
      <div>
        <button class="btn btn-primary" @click="setAction(ChatActions.CHANNEL_SETTINGS)">
          <i class="bi bi-gear" />
        </button>
        <button class="btn btn-primary mx-2" @click="setAction(ChatActions.CHANNEL_USERS)">
          <i class="bi bi-person-lines-fill" />
        </button>
        <button class="btn btn-primary" @click="unselectChannel()">
          <i class="bi bi-arrow-return-left" />
        </button>
      </div>
    </div>
    <div class="overflow-scroll" id="msg-list">
      <ChatMessage v-for="(msg, id) in messages" :msg="msg" :myUserId="myUserId" :refresh="refresh" :key="id" />
    </div>
    <div class="d-flex flex-row justify-content-end">
      <input
          v-model="messageContent"
          class="form-control me-2"
          placeholder="message..."
          @keydown.enter="sendMessage()"
          :disabled="mySanctions?.muted"
      />
      <button class="btn btn-primary" @click="sendMessage()" :disabled="mySanctions?.muted || messageContent.length > MsgMaxSize">
        <i class="bi bi-send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import { MsgMaxSize } from "@/utils/const"

let interval;

const messageContent = ref("");
const refresh = ref(false);

const mySanctions = computed(() => store.getters["chat/getMySanctions"]);
const selected = computed(() => store.state.chat.selected);
const channels = computed(() => store.state.chat.channels);
const blocked = computed(() => store.state.chat.blocked);
const selectedChannel = computed(() => channels.value.get(selected.value || -1));
const myUserId = computed(() => store.state.auth.user?.id);
const messages = computed(
    () => channels.value.get(selected.value || -1)?.messages.filter(m => !blocked.value.has(m.user))
);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function sendMessage() {
  if (/^\s*$/.test(messageContent.value)) {
    return;
  }
  
  if (messageContent.value.length > MsgMaxSize) {
    store.dispatch("alert/addWarning", `You cannot send more than ${MsgMaxSize} characters`);
    return;
  }
  store.dispatch("chat/newMessage", messageContent.value);
  messageContent.value = "";
}

function unselectChannel() {
  store.dispatch("chat/unselectChannel");
}

onMounted(() => {
  store.dispatch("chat/getChannelSanctions");
  store.dispatch("chat/getChannelUsers");

  interval = setInterval(() => {
    refresh.value = !refresh.value;
  }, 60e3)
})

onUnmounted(() => clearInterval(interval));
</script>

<style scoped lang="scss">
#msg-list {
  height: calc(99vh - 40px - 2rem - 7rem);
}
</style>