<template>
  <div class="bg-light rounded w-100">
    <div class="px-2 py-0 m-0 w-100 d-flex flex-column" id="chat-list">
      <div v-if="selected" class="d-flex flex-column w-100">
        <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
          <h3>#{{ selectedChannel?.name }}</h3>
          <button class="btn btn-primary" @click="unselectChannel()">
            <i class="bi bi-arrow-return-left" />
          </button>
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
      <div v-else-if="creatingChannel" class="d-flex flex-column w-100">
        <div class="d-flex flex-row justify-content-between p-2">
          <h3 class="mb-3 mt-2">Create Channel</h3>
          <button class="btn btn-primary my-2" @click="toggleCreateChannel()">
            <i class="bi bi-arrow-return-left" />
          </button>
        </div>
        <div class="d-flex flex-column justify-content-between w-100" id="chan-list">
          <div>
            <input
                v-model="messageContent"
                class="form-control me-2"
                placeholder="my awesome channel"
            />
            <div class="d-flex flex-row justify-content-between my-4 w-100">
              <span>
                Should channel be private?
              </span>
              <input
                  type="checkbox"
                  v-model="isChannelPrivate"
                  class="me-2"
              />
            </div>
            <input
                v-model="channelPassword"
                class="form-control me-2"
                placeholder="my secret password"
            />
          </div>
          <button class="btn btn-primary" @click="createChannel()">
            Create!
          </button>
        </div>
      </div>
      <div v-else-if="joiningChannel">
        <div class="d-flex flex-row justify-content-between p-2">
          <h3 class="mb-3 mt-2">Available Channels</h3>
          <button class="btn btn-primary my-2" @click="toggleJoiningChannel()">
            <i class="bi bi-arrow-return-left" />
          </button>
        </div>
        <div class="overflow-scroll" id="chan-list">
          <div v-for="[channelId, channelName] in availableChannels.entries()" class="w-100" :key="channelId">
            <div class="d-flex flex-row justify-content-between w-100">
              <div class="text-secondary m-0 py-2 px-0" style="max-width: 50%">
                {{ channelName }}
              </div>
              <button class="btn btn-primary" @click="joinChannel(channelId)">
                <i class="bi bi-plus" />
              </button>
            </div>
            <hr class="w-auto my-2" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="d-flex flex-row justify-content-between p-2">
          <h3 class="mb-3 mt-2">My Channels</h3>
          <div>
            <button class="btn btn-primary my-2 me-2" @click="toggleCreateChannel()" data-toggle="modal" data-target=".create-channel-modal">
              <i class="bi bi-pencil" />
            </button>
            <button class="btn btn-primary my-2" @click="toggleJoiningChannel()">
              <i class="bi bi-list" />
            </button>
          </div>
        </div>
        <div class="overflow-scroll" id="chan-list">
          <div v-for="chan in channels.values()" class="w-100" :key="chan.id">
            <div class="d-flex flex-row justify-content-between w-100">
              <div class="text-secondary m-0 py-2 px-0" style="max-width: 50%">
                {{ chan.name }}
              </div>
              <button class="btn btn-primary" @click="selectChannel(chan.id)">
                <i class="bi bi-send" />
              </button>
            </div>
            <hr class="w-auto my-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { store } from "@/store";
import { getChannels } from "@/utils/user";

const messageContent = ref("");
const isChannelPrivate = ref(false);
const channelPassword = ref("");
const joiningChannel = ref(false);
const creatingChannel = ref(false);
const availableChannels = ref(new Map<number, string>());
const selected = computed(() => store.state.chat.selected);
const channels = computed(() => store.state.chat.channels);
const messages = computed(
  () => channels.value.get(selected.value || -1)?.messages
);
const selectedChannel = computed(() => store.state.chat.channels.get(selected.value || -1));

async function toggleJoiningChannel() {
  if (!joiningChannel.value)
    await fetchAvailableChannels();
  joiningChannel.value = !joiningChannel.value;
}

async function toggleCreateChannel() {
  if (creatingChannel.value) {
    messageContent.value = "";
    isChannelPrivate.value = false;
    channelPassword.value = "";
  }
  creatingChannel.value = !creatingChannel.value;
}

function joinChannel(channelId: number) {
  store.dispatch("chat/joinChannel", channelId);
  selectChannel(channelId);
  joiningChannel.value = false;
}

function leaveChannel(channelId: number) {
  store.dispatch("chat/leaveChannel", channelId);
  if (selected.value === channelId)
    unselectChannel();
}

function selectChannel(channelId: number) {
  store.dispatch("chat/selectChannel", channelId);
}

function unselectChannel() {
  store.dispatch("chat/unselectChannel");
}

function createChannel() {
  store.dispatch("chat/createChannel", { name: messageContent.value, private: isChannelPrivate.value, password: channelPassword.value || null });
  messageContent.value = "";
  isChannelPrivate.value = false;
  channelPassword.value = "";

  toggleCreateChannel();
}

function sendMessage() {
  store.dispatch("chat/newMessage", messageContent.value);
  messageContent.value = "";
}

async function fetchAvailableChannels() {
  const chans = await getChannels();

  availableChannels.value.clear();
  chans.payload.forEach((chan: { id: number, name: string }) => {
    if (!channels.value.has(chan.id))
      availableChannels.value.set(chan.id, chan.name);
  });
}

onMounted(() => {
  store.dispatch("chat/getMyChannels");
})
</script>

<style scoped>
#chat-list {
  height: calc(99vh - 40px - 2rem);
}

#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}

#msg-list {
  height: calc(99vh - 40px - 2rem - 7rem);
}
</style>
