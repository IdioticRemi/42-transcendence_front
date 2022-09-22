<template>
	<div :class="`d-flex ${props.msg.user === props.myUserId ? 'text-end justify-content-end pe-2' : ''} w-100`">
        <div class="card mb-2" style="min-width: 40%; max-width: 70%;">
          <div class="card-front">
            <div v-if="props.msg.user !== props.myUserId" @click="toggleMessageSettings()" class="card-header custom-card-header d-flex justify-content-between p-1">
              <a class="nav-link text-primary mx-0 px-1">{{ props.msg.nick }}</a>
              <div>
                <span v-if="props.refresh" class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(props.msg.createdAt) }}</span>
                <span v-else class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(props.msg.createdAt) }}</span>
                <i :class="`ms-2 bi-caret-${showSettings ? 'up' : 'down'}`" />
              </div>
            </div>
            <div v-if="props.msg.user === props.myUserId" class="card-header d-flex justify-content-between p-1">
              <span v-if="props.refresh" class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(props.msg.createdAt) }}</span>
              <span v-else class="text-secondary mt-1" style="font-size: 12px;">{{ getDateFromNow(props.msg.createdAt) }}</span>
              <span class="nav-link text-primary mx-0 px-1">me</span>
            </div>
            <div v-if="showSettings && props.msg.user !== props.myUserId" class="card-header d-flex justify-content-start p-1">
              <router-link class="btn btn-sm btn-outline-primary py-0 me-1" :to="`/profile/${props.msg.user}`">Profile</router-link>
              <button @click="addFriend(props.msg.user)" class="btn btn-sm btn-outline-success py-0 me-1">Friend</button>
              <button @click="inviteToPlay(props.msg.user)" class="btn btn-sm btn-outline-secondary py-0 me-1">Play</button>
              <button @click="blockUser(props.msg.user)" class="btn btn-sm btn-outline-danger py-0">Block</button>
            </div>
            <div class="card-body p-1 m-0">
              <p class="p-0 ps-1 m-0">{{ props.msg.content }}</p>
            </div>
          </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, defineProps} from "vue";
import {store} from "@/store";
import moment from "moment";
import { getUser } from "@/utils/user";

const props = defineProps(['msg', 'myUserId', 'refresh']);
const showSettings = ref(false);

function toggleMessageSettings(messageId: number) {
  showSettings.value = !showSettings.value;
}

function getDateFromNow(date: string) {
  return moment(new Date(date).getTime() - (new Date().getTimezoneOffset() * 60e3)).fromNow();
}

function addFriend(userId: number) {
  store.dispatch("chat/sendFriendRequest", userId);
}

function blockUser(userId: number) {
  store.dispatch("chat/blockUser", userId);
}

async function inviteToPlay(userId: number) {
  store.dispatch("game/openInviteModal", userId);
}

</script>

<style scoped lang="scss">
.custom-card-header {
  cursor: default !important;
  transition: 0.5s;
}

.custom-card-header:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  cursor: pointer !important;
}
</style>