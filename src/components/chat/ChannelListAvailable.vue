<template>
  <div>
    <div class="d-flex flex-row justify-content-between p-2">
      <h3 class="mb-3 mt-2">Public Channels</h3>
      <div>
        <button class="btn btn-primary my-2 me-3 me-xl-2" :key="refresh" @click="fetchAvailableChannels()">
          <i class="bi bi-arrow-repeat" />
        </button>
        <button class="btn btn-primary my-2 me-2 d-none d-xl-inline-block" @click="setAction(ChatActions.CHANNEL_JOIN_PRIVATE)">
          <i class="bi bi-lock" />
        </button>
        <button class="btn btn-primary my-2" @click="setAction(ChatActions.LIST_CHANNELS)">
          <i class="bi bi-arrow-return-left" />
        </button>
        <button class="btn btn-primary my-2 me-2 d-block d-xl-none" @click="setAction(ChatActions.CHANNEL_JOIN_PRIVATE)">
          Private
          <i class="ms-2 bi bi-lock" />
        </button>
      </div>
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
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {getChannels} from "@/utils/user";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const refresh = ref(false);
const availableChannels = ref(new Map<number, string>());
const channels = computed(() => store.state.chat.channels);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function joinChannel(channelId: number) {
  store.dispatch("chat/joinChannel", channelId);
}

async function fetchAvailableChannels() {
  refresh.value = !refresh.value;
  const chans = await getChannels();
  if (!chans || chans.status === 'error') {
    store.dispatch("alert/addError", "Failed to fetch channels, (expired token?)");
    return;
  }

  availableChannels.value.clear();
  chans.payload.forEach((chan: { id: number, name: string }) => {
    if (!channels.value.has(chan.id))
      availableChannels.value.set(chan.id, chan.name);
  });
}

onMounted(async () => {
  await fetchAvailableChannels();
})
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>