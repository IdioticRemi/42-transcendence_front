<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">Channels</h3>
    <div>
      <button class="btn btn-primary my-2 me-2" @click="setAction(ChatActions.FRIEND_LIST)">
        <i class="bi bi-people" />
      </button>
      <button class="btn btn-primary my-2 me-2" @click="setAction(ChatActions.CREATE_CHANNEL)">
        <i class="bi bi-plus" />
      </button>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_AVAILABLE_CHANNELS)">
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
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const channels = computed(() => store.state.chat.channels);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function selectChannel(channelId: number) {
  store.dispatch("chat/selectChannel", channelId);
}

onMounted(() => {
  store.dispatch("chat/getMyChannels");
})
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>