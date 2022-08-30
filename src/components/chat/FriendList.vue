<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">Friends</h3>
    <div>
      <button class="btn btn-danger my-2 me-2" @click="setAction(ChatActions.BLOCKED_LIST)">
        <i class="bi bi-clipboard-x" />
      </button>
      <button class="btn btn-success my-2 me-2" @click="setAction(ChatActions.FRIEND_ADD)">
        <i class="bi bi-person-plus" />
      </button>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_CHANNELS)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
  </div>
  <div class="overflow-scroll" id="chan-list">
    <div v-for="friend in friends.values()" class="w-100" :key="friend.id">
      <div class="d-flex flex-row justify-content-between w-100">
        <div class="d-flex flex-row text-secondary m-0 py-2 px-0 mw-50">
          <h6>{{ friend.nickname }}</h6>
          <span :class="`ms-1 pb-0 pt-1 badge rounded-pill text-bg-${getStatusColor(friend)}`" style="height: 1.3rem; margin-top: 0.1rem">{{ friend.status }}</span>
        </div>
        <button class="btn btn-primary" :disabled="friend.status === FriendStatus.PENDING" @click="selectFriend(friend.id)">
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
import {ChatActions, Friend, FriendStatus} from "@/store/modules/chat";

const friends = computed(() => store.state.chat.friends);

function getStatusColor(friend: Friend) {
  return friend.status === FriendStatus.ONLINE ? 'success' : friend.status === FriendStatus.OFFLINE ? 'secondary' : 'warning'
}

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