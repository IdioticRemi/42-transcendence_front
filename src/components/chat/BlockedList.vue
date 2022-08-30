<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">Blocked Users</h3>
    <div>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.FRIEND_LIST)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
  </div>
  <div class="overflow-scroll" id="chan-list">
    <div v-for="user in blocked.values()" class="w-100" :key="user.id">
      <div class="d-flex flex-row justify-content-between w-100">
        <div class="d-flex flex-row text-secondary m-0 py-2 px-0 mw-50">
          <h6>{{ user.nickname }}</h6>
          <span class="ms-1 pb-0 pt-1 badge rounded-pill text-bg-danger" style="height: 1.3rem; margin-top: 0.1rem">blocked</span>
        </div>
        <button @click="unblockUser(user.id)" class="btn btn-success">
          <i class="bi bi-x-octagon" />
          Unblock
        </button>
      </div>
      <hr class="w-auto my-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const blocked = computed(() => store.state.chat.blocked);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function unblockUser(userId: number) {
  store.dispatch("chat/unblockUser", userId);
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>