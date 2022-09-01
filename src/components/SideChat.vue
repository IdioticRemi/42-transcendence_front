<template>
  <div class="position-fixed fixed-bottom" style="width: inherit !important;">
    <div class="bg-light rounded px-2 py-0 m-0 w-100 d-flex flex-column" id="chat-list">
      <ChannelChat v-if="action === ChatActions.CHANNEL_VIEW" />
      <ChannelUsers v-else-if="action === ChatActions.CHANNEL_USERS" />
      <ChannelSanctions v-else-if="action === ChatActions.CHANNEL_SANCTIONS" />
      <ChannelSettings v-else-if="action === ChatActions.CHANNEL_SETTINGS" />
      <ChannelCreate v-else-if="action === ChatActions.CREATE_CHANNEL" />
      <ChannelListAvailable v-else-if="action === ChatActions.LIST_AVAILABLE_CHANNELS" />
      <ChannelJoinPrivate v-else-if="action === ChatActions.CHANNEL_JOIN_PRIVATE" />
      <FriendList v-else-if="action === ChatActions.FRIEND_LIST" />
      <FriendAdd v-else-if="action === ChatActions.FRIEND_ADD" />
      <FriendMessage v-else-if="action === ChatActions.FRIEND_MESSAGE" />
      <BlockedList v-else-if="action === ChatActions.BLOCKED_LIST" />
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
import FriendList from "@/components/chat/FriendList.vue";
import FriendAdd from "@/components/chat/FriendAdd.vue";
import FriendMessage from "@/components/chat/FriendMessage.vue";
import BlockedList from "@/components/chat/BlockedList.vue";
import ChannelJoinPrivate from "@/components/chat/ChannelJoinPrivate.vue";
import ChannelUsers from "@/components/chat/ChannelUsers.vue";
import ChannelSettings from "@/components/chat/ChannelSettings.vue";
import ChannelSanctions from "@/components/chat/ChannelSanctions.vue";

const action = computed(() => store.state.chat.action);
</script>

<style scoped>
#chat-list {
  height: calc(99vh - 40px - 2rem);
}
</style>
