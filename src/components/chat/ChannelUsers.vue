<template>
  <div class="d-flex flex-row justify-content-between p-2">
    <h3 class="mb-3 mt-2">User list</h3>
    <div>
      <button class="btn btn-primary my-2 me-2" @click="setAction(ChatActions.CHANNEL_SANCTIONS)">
        <i class="bi bi-exclamation-triangle" />
      </button>
      <button class="btn btn-primary my-2" @click="setAction(ChatActions.CHANNEL_VIEW)">
        <i class="bi bi-arrow-return-left" />
      </button>
    </div>
  </div>
  <div class="overflow-scroll" id="chan-list">
    <div v-for="user in users" class="w-100" :key="user.id">
      <div class="d-flex-col w-100">
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex"> <!-- LEFT PART (INFORMATIONS/ROLES) -->
            <div class="text-secondary m-0 py-2 px-0">
              {{ user.nickname }}
            </div>
            <span v-if="user.perm !== 1 || user.perm >= myPermLevel || user.id === authUser.id" :class="`ms-2 badge rounded-pill text-bg-${getRoleColor(user)}`" style="height: 1.4rem; margin-top: 0.6rem">
            {{ stringifyRole(user.perm) }}
          </span>
            <button v-if="user.perm < myPermLevel" @click="updateRole(user)" :class="`ms-2 btn btn-primary badge rounded-pill text-bg-primary`" style="height: 1.4rem; margin-top: 0.6rem">
              {{ stringifyRole(1) }}
              <i v-if="user.perm === 1 && myPermLevel === 2" class="ms-2 bi bi-dash"/>
              <i v-else-if="user.perm === 0 && myPermLevel > 0" class="ms-2 bi bi-plus" />
            </button>
          </div>
          <div class="d-flex flex-row"> <!-- RIGHT PART (ACTIONS LIKE BAN/MUTE/KICK/...) -->
            <button @click="setSanctionType(user.id, 'ban')" :hidden="myPermLevel === 0 || user.perm >= myPermLevel" class="btn btn-danger">
              Ban
              <i class="ms-1 bi bi-hammer" />
            </button>
            <button @click="setSanctionType(user.id, 'mute')" :hidden="myPermLevel === 0 || user.perm >= myPermLevel" class="ms-2 btn btn-warning">
              Mute
              <i class="ms-1 bi bi-mic-mute" />
            </button>
          </div>
        </div>
        <div :hidden="target !== user.id" class="d-flex w-100">
          <input :hidden="target !== user.id" v-model="duration" type="text" class="form-control mt-2" :placeholder="`${sanctionType} duration (DD hh:mm:ss)`">
          <button :hidden="target !== user.id" @click="applySanction()" class="btn btn-primary mt-2 ms-2">
            <i :class="`bi-${sanctionType === 'mute' ? 'mic-mute' : 'hammer'}`"></i>
          </button>
        </div>
      </div>
      <hr class="w-auto my-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {store} from "@/store";
import {ChatActions} from "@/store/modules/chat";
import * as moment from "moment";

const duration = ref("");
const sanctionType = ref("");
const target = ref(-1);

const users = computed(() => store.state.chat.tempUserList?.users.sort((a, b) => b.perm - a.perm));
const authUser = computed(() => store.state.auth.user);
const myPermLevel = computed(() => store.state.chat.tempUserList?.users.find(u => u.id === authUser.value?.id)?.perm);

function setAction(action: ChatActions) {
  store.dispatch("chat/setAction", action);
}

function getRoleColor(user) {
  return user.perm === 2 ? 'danger' : user.perm === 1 ? 'primary' : 'secondary';
}

function setSanctionType(t: number, type: string) {
  if (target.value === t && sanctionType.value === type) {
    sanctionType.value = "";
    target.value = -1;
    duration.value = "";
    return;
  }
  sanctionType.value = type;
  target.value = t;
  duration.value = "";
}

function applySanction() {
  if (!duration.value)
    return;

  const time = moment.duration(duration.value);

  if (time.asSeconds() === 0)
    return;

  store.dispatch("chat/applySanction", { sanction: sanctionType.value, duration: time.asSeconds(), userId: target.value });
  sanctionType.value = "";
  target.value = -1;
  duration.value = "";
}

function updateRole(user) {
  if (!myPermLevel.value || user.perm > myPermLevel.value)
    return;
  if (user.perm === 0)
    store.dispatch("chat/addChannelAdmin", user.id);
  else if (user.perm === 1)
    store.dispatch("chat/delChannelAdmin", user.id);
}

function stringifyRole(number) {
  if (number === 0) return 'user';
  if (number === 1) return 'admin';
  if (number === 2) return 'owner';
}
</script>

<style scoped>
#chan-list {
  height: calc(99vh - 40px - 2rem - 5rem);
}
</style>