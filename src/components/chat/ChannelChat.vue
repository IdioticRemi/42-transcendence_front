<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
      <h3>#{{ selectedChannel?.name }}</h3>
      <div>
        <button class="btn btn-primary" @click="setAction(ChatActions.CHANNEL_SETTINGS)">
          <i class="bi bi-gear" />
        </button>
        <button class="btn btn-primary mx-2" @click="setAction(ChatActions.CHANNEL_USERS)">
          <i class="bi bi-people" />
        </button>
        <button class="btn btn-primary" @click="unselectChannel()">
          <i class="bi bi-arrow-return-left" />
        </button>
      </div>
    </div>
    <div class="overflow-scroll" id="msg-list">
      <div v-for="(msg, id) in messages" :class="`d-flex ${msg.user === myUserId ? 'text-end justify-content-end pe-2' : ''} w-100`" :key="id">
        <div class="card mb-2" style="min-width: 40%; max-width: 70%;">
          <div class="card-front">
            <div v-if="msg.user !== myUserId" @click="toggleUserSettings(id)" class="card-header custom-card-header d-flex justify-content-between p-1">
              <a class="nav-link text-primary mx-0 px-1">{{ msg.nick }}</a>
              <div>
                <span v-if="refresh" class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(msg.createdAt) }}</span>
                <span v-else class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(msg.createdAt) }}</span>
                <i :class="`ms-2 bi-caret-${messageSettings === id ? 'up' : 'down'}`" />
              </div>
            </div>
            <div v-if="msg.user === myUserId" class="card-header d-flex justify-content-between p-1">
              <span v-if="refresh" class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(msg.createdAt) }}</span>
              <span v-else class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(msg.createdAt) }}</span>
              <span class="nav-link text-primary mx-0 px-1">me</span>
            </div>
            <div v-if="messageSettings === id && msg.user !== myUserId" class="card-header d-flex justify-content-start p-1">
              <router-link class="btn btn-sm btn-outline-primary py-0 me-1" :to="`/profile/${msg.user}`">Profile</router-link>
              <button @click="addFriend(msg.user)" class="btn btn-sm btn-outline-success py-0 me-1">Friend</button>
              <button class="btn btn-sm btn-outline-secondary py-0 me-1">Play</button>
              <button @click="blockUser(msg.user)" class="btn btn-sm btn-outline-danger py-0">Block</button>
            </div>
            <div class="card-body p-1 m-0">
              <p class="p-0 ps-1 m-0">{{ msg.content }}</p>
            </div>
          </div>

        </div>
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
import {ref, computed, onMounted, onUnmounted} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";
import moment from "moment";

let interval;

const messageSettings = ref(-1);
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

function toggleUserSettings(messageId: number) {
  if (messageId === messageSettings.value)
    messageSettings.value = -1;
  else messageSettings.value = messageId;
}

function getDateFromNow(date: number) {
  return moment(date - (new Date().getTimezoneOffset() * 60e3)).fromNow();
}

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function sendMessage() {
  store.dispatch("chat/newMessage", messageContent.value);
  messageContent.value = "";
}

function unselectChannel() {
  store.dispatch("chat/unselectChannel");
}

function addFriend(userId: number) {
  store.dispatch("chat/sendFriendRequest", userId);
}

function blockUser(userId: number) {
  store.dispatch("chat/blockUser", userId);
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

.custom-card-header {
  cursor: default !important;
  transition: 0.5s;
}

.custom-card-header:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  cursor: pointer !important;
}
</style>