<template>
  <div class="d-flex flex-column w-100">
    <div class="d-flex flex-row justify-content-between p-2">
      <h3 class="mb-3 mt-2">Channel Settings</h3>
      <div class="d-flex flex-row">
        <button class="btn btn-primary my-2" @click="setAction(ChatActions.CHANNEL_VIEW)">
          <i class="bi bi-arrow-return-left" />
        </button>
      </div>
    </div>
    <div class="d-flex flex-column justify-content-between w-100" id="chan-list">
      <div>
        <input
            v-model="channelName"
            class="form-control me-2"
            placeholder="my awesome channel"
            :disabled="myPermLevel < 1"
        />
        <div class="d-flex flex-row justify-content-between my-4 w-100">
              <span>
                Should channel be private?
              </span>
          <input
              type="checkbox"
              v-model="isChannelPrivate"
              class="me-2"
              :disabled="myPermLevel < 1 || channelPassword.length > 0"
          />
        </div>
        <input
            v-model="channelPassword"
            class="form-control me-2"
            placeholder="my secret password"
            :disabled="myPermLevel < 1"
        />
      </div>
      <div class="row">
        <div class="col-12">
          <button class="btn btn-primary my-2 w-100" @click="updateChannel(selected)">
            Update Channel
            <i class="bi bi-arrow-clockwise" />
          </button>
        </div>
        <div class="col-12 col-md-6">
          <button class="btn btn-warning my-2 w-100" @click="leaveChannel(selected)">
            Leave channel
            <i class="bi bi-door-open" />
          </button>
        </div>
        <div class="col-12 col-md-6">
          <button :class="`btn btn-${myPermLevel >= 1 ? 'danger' : 'secondary'} my-2 w-100`" @click="deleteChannel(selected)" :disabled="myPermLevel < 1">
            Delete channel
            <i class="bi bi-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";

const selected = computed(() => store.state.chat.selected);
const user = computed(() => store.state.auth.user);
const myPermLevel = computed(() => store.state.chat.tempUserList?.users.find(u => u.id === user.value?.id)?.perm);

const channelPassword = ref("");
const channelName = ref(store.state.chat.channels.get(selected.value || -1)?.name);
const isChannelPrivate = ref(store.state.chat.channels.get(selected.value || -1)?.isPrivate);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function updateChannel(channelId: number) {
  if (channelId < 0)
    return;

  store.dispatch("chat/updateChannel", {
    password: channelPassword.value,
    name: channelName.value,
    isPrivate: isChannelPrivate.value });
  channelPassword.value = "";
  setAction(ChatActions.CHANNEL_VIEW);
}

function deleteChannel(channelId: number) {
  if (channelId < 0)
    return;
  store.dispatch("chat/deleteChannel", channelId);
  unselectChannel();
}

function leaveChannel(channelId: number) {
  if (channelId < 0)
    return;
  store.dispatch("chat/leaveChannel", channelId);
  unselectChannel();
}

function unselectChannel() {
  store.dispatch("chat/unselectChannel");
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>