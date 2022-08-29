<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">My Friends</h3>
    <div>
      <button class="btn btn-primary my-2 me-2" @click="setAction(ChatActions.FRIEND_ADD)">
        <i class="bi bi-plus" />
      </button>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_CHANNELS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
  </div>
  <div class="overflow-scroll" id="chan-list">
    <div v-for="friend in friends.values()" class="w-100" :key="friend.id">
      <div class="d-flex flex-row justify-content-between w-100">
        <div class="text-secondary m-0 py-2 px-0" style="max-width: 50%">
          <span :class="friend.status === FriendStatus.ONLINE ? 'text-success' : friend.status === FriendStatus.OFFLINE ? 'text-secondary' : 'text-warning'">{{ friend.nickname }}</span>
        </div>
        <button class="btn btn-primary" @click="selectFriend(friend.id)">
          <i class="bi bi-send" />
        </button>
      </div>
      <hr class="w-auto my-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {store} from "@/store";
import {ChatActions, FriendStatus} from "@/store/modules/chat";

const friends = computed(() => store.state.chat.friends);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function selectFriend(friendId: number) {
  store.dispatch("chat/selectFriend", friendId);
}

onMounted(() => {
  store.dispatch("chat/getMyFriends");
})
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>