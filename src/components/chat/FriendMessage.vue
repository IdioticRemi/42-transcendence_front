<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between w-100 mb-3 mt-2">
      <div class="d-flex flex-row">
        <h3>@{{ selectedFriend?.nickname }}</h3>
        <i :class="`mt-1 ms-1 bi-circle-fill text-${selectedFriend?.status === FriendStatus.ONLINE ? 'success' : selectedFriend?.status === FriendStatus.OFFLINE ? 'secondary' : 'warning'}`" />
      </div>
      <div>
        <button class="btn btn-danger me-2" @click="blockUser()">
          <i class="bi bi-x-octagon" />
        </button>
        <button class="btn btn-warning me-2" @click="removeFriend()">
          <i class="bi bi-person-dash" />
        </button>
        <button class="btn btn-primary" @click="unselectFriend()">
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
import {FriendStatus} from "@/store/modules/chat";

const messageContent = ref("");

const selected = computed(() => store.state.chat.selectedFriend);
const friends = computed(() => store.state.chat.friends);
const selectedFriend = computed(() => friends.value.get(selected.value || -1));
const messages = computed(() => selectedFriend.value?.messages);

function sendMessage() {
  store.dispatch("chat/newFriendMessage", messageContent.value);
  messageContent.value = "";
}

function unselectFriend() {
  store.dispatch("chat/unselectFriend");
}

function blockUser() {
  if (selectedFriend.value)
    store.dispatch("chat/blockUser", selectedFriend.value.id);
}

function removeFriend() {
  messageContent.value = "";
  store.dispatch("chat/unfriend");
}
</script>

<style scoped>
#msg-list {
  height: calc(99vh - 40px - 2rem - 7rem);
}
</style>