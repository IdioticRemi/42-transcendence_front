<template>
  <div class="bg-light rounded w-100">
    <div class="px-2 py-0 m-0 w-100 d-flex flex-column" id="chat-list">
      <ChannelChat v-if="action === ChatActions.CHANNEL_VIEW" />
      <ChannelCreate v-else-if="action === ChatActions.CREATE_CHANNEL" />
      <ChannelListAvailable v-else-if="action === ChatActions.LIST_AVAILABLE_CHANNELS" />
      <ChannelList v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import { store } from "@/store";
import {ChatActions} from "@/store/modules/chat";
import ChannelCreate from "@/components/chat/ChannelCreate.vue";
import ChannelListAvailable from "@/components/chat/ChannelListAvailable.vue";
import ChannelList from "@/components/chat/ChannelList.vue";
import ChannelChat from "@/components/chat/ChannelChat.vue";

const action = computed(() => store.state.chat.action);
</script>

<style scoped>
#chat-list {
  height: calc(99vh - 40px - 2rem);
}
</style>
