<template>
  <div class="bg-light rounded w-100">
    <div class="px-2 py-0 m-0 w-100 d-flex flex-column" id="chat-list">
      <div v-if="selected" class="d-flex flex-column w-100">
        <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
          <h3>#{{ selectedChannel.name }}</h3>
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
      <div v-else class="d-flex flex-column w-100">
        <h3 class="mb-3 mt-2">Channels</h3>
        <div class="overflow-scroll" id="chan-list">
          <div v-for="chan in channels.values()" class="w-100" :key="chan">
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
import { computed, onMounted, ref } from "vue";
import { store, StoreState } from "@/store/index";
import { ChatChannel, ChatMessage } from "@/store/modules/chat";
import { getChannels } from "@/utils/user";

const messageContent = ref("");
const selected = computed(() => (store.state as StoreState).chat.selected);
const channels = computed(() => (store.state as StoreState).chat.channels);
const messages = computed(
  () => channels.value.get(selected.value || -1)?.messages
);
const selectedChannel = computed(() => (store.state as StoreState).chat.channels.get(selected.value || -1));

function selectChannel(name: string) {
  store.commit("chat/selectChannel", name);
}

function unselectChannel() {
  store.commit("chat/unselectChannel");
}

function sendMessage() {
  console.log(messageContent);
  store.commit("chat/newMessage", {
    user: (store.state as StoreState).auth.user?.username,
    content: messageContent.value,
  } as ChatMessage);
  messageContent.value = "";
}

onMounted(async () => {
  const chans = await getChannels();
  
  console.debug(chans);
  chans.payload.forEach((chan: { id: number, name: string }) => {
    store.commit("chat/newChannel", chan);
  });
});
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
