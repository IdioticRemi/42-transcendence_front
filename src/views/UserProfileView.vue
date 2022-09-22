<template>
  <div>
    <h1 class="mb-4">User Information</h1>
    <div v-if="!res || !'payload' in res">
      Loading...
    </div>
    <div v-else-if="'status' in res && res.status !== 'success'">
      This user does not exist.
    </div>
    <div v-else class="row">
      <div class="col-12 col-lg-0 d-flex">
        <div class="d-lg-none w-100 d-flex">
          <img @click="uploadNewImage(res.payload.id)"
              :class="`${res.payload.id === user.id ? 'mypfp' : ''} rounded me-4 mb-4`"
              style="object-fit: cover; width: 15vw; height: 15vw; min-height: 140px; min-width: 140px"
             :src="`${BackendURL}/users/avatar/${res.payload.id}/${refresh}`"
              alt="profile picture"
          />
          <div class="d-flex-col w-50">
            <div class="row w-100">
              <b class="col-sm-4 col-12">User ID</b>
              <span class="col-sm-8 col-12 text-sm-end">#{{ res.payload.id }}</span>
            </div>
            <div class="row w-100">
              <b class="col-sm-4 col-12">Nickname</b>
              <span class="col-sm-8 col-12 text-sm-end">
                <span v-if="user.id === res.payload.id">{{ user.nickname }}</span>
                <span v-else>{{ res.payload.nickname }}</span>
                <button :hidden="res.payload.id !== user.id" @click="toggleEditNickname()" class="btn btn-sm btn-primary ms-1 py-0 px-1">
                <i class="bi-pencil" />
              </button>
              </span>
            </div>
            <div class="row w-100">
              <div :hidden="!editingNickname" class="d-flex flex-row">
                <input :hidden="!editingNickname" ref="nickInput" @keydown.enter="changeNickname()" v-model="newNickname" class="mt-2 form-control form-control-sm me-2" type="text" placeholder="my awesome nickname">
                <button :hidden="!editingNickname" :disabled="newNickname.length < 4 || newNickname > 16" @click="changeNickname()" class="mt-2 btn btn-sm btn-primary py-0 px-1">
                  <i class="bi-check2" />
                </button>
              </div>
            </div>
            <div class="row w-100">
              <b class="col-sm-4 col-12">Joined</b>
              <span class="col-sm-8 col-12 text-sm-end">{{ moment(res.payload.createdAt).format("ll [at] HH:mm") }}</span>
            </div>
            <div class="row w-100">
              <b class="col-sm-4 col-12">Winrate</b>
              <span class="col-sm-8 col-12 text-sm-end">{{ (winrate * 100).toFixed(2) }}%</span>
            </div>
            <div class="d-flex flex-sm-row-reverse justify-content-end-sm pe-sm-4">
              <button :hidden="res.payload.id !== user.id" @click="show2faModal()" class="btn btn-sm btn-primary">2FA Settings
                <i class="bi bi-gear"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-0 d-none d-lg-flex col-lg-8">
        <div class="d-flex-col w-75">
          <div class="d-flex justify-content-between w-100">
            <b>User ID</b>
            <span>#{{ res.payload.id }}</span>
          </div>
          <div class="d-flex justify-content-between w-100">
            <b>Nickname</b>
            <span>
              <span v-if="user.id === res.payload.id">{{ user.nickname }}</span>
              <span v-else>{{ res.payload.nickname }}</span>

              <button :hidden="res.payload.id !== user.id" @click="toggleEditNickname()" class="btn btn-sm btn-primary ms-1 py-0 px-1">
                <i class="bi-pencil" />
              </button>
            </span>
          </div>
          <div :hidden="!editingNickname" class="d-flex flex-row">
            <input :hidden="!editingNickname" ref="nickInput" @keydown.enter="changeNickname()" v-model="newNickname" class="mt-2 form-control form-control-sm me-2" type="text" placeholder="my awesome nickname">
            <button :hidden="!editingNickname" :disabled="newNickname.length < 4 || newNickname > 16" @click="changeNickname()" class="mt-2 btn btn-sm btn-primary py-0 px-1">
              <i class="bi-check2" />
            </button>
          </div>
          <div class="d-flex justify-content-between w-100">
            <b>Joined</b>
            <span>{{ moment(res.payload.createdAt).format("ll [at] HH:mm") }}</span>
          </div>
          <div class="d-flex justify-content-between w-100">
            <b>Winrate</b>
            <div>
              {{ (winrate * 100).toFixed(2) }}%
            </div>
          </div>
          <div class="d-flex flex-row justify-content-end">
            <button :hidden="res.payload.id !== user.id" @click="show2faModal()" class="btn btn-sm btn-primary">2FA Settings
              <i class="bi bi-gear"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-0 col-lg-4 d-flex justify-content-end">
        <img @click="uploadNewImage(res.payload.id)"
            :class="`${res.payload.id === user.id ? 'mypfp' : ''} rounded d-none d-lg-block`"
            style="object-fit: cover; width: 15vw; height: 15vw"
            :src="`${BackendURL}/users/avatar/${res.payload.id}/${refresh}`"
            alt="profile picture"
        />
      </div>

      <div class="col-12">
        <h2 class="mb-4">Match History</h2>
        <div v-for="(match, id) in gameHistory" :key="id" class="d-flex-col w-100 w-75-lg card mb-3">
          <h5 class="card-header d-flex">
               <router-link class="nav-link text-primary me-1" :to="`/profile/${match.playerId}`">{{ res.payload.nickname }}</router-link>vs<router-link class="nav-link text-danger ms-1" :to="`/profile/${match.opponentId}`">{{ match.opponentNick }}</router-link>
          </h5>
          <div class="row w-100 card-body">
            <div class="col-6">
              <h5>Game type</h5>
              <h5 class="card-subtitle text-muted">{{ match.type }}</h5>
            </div>
            <div class="col-6">
              <h5>Score</h5>
              <h5 class="card-subtitle">
                <span class="text-primary">{{ match.playerScore }}</span> / <span class="text-danger">{{ match.opponentScore }}</span>
              </h5>

            </div>
          </div>
          <div class="card-footer">
            {{ moment(new Date(match.endedAt).getTime() - (new Date().getTimezoneOffset() * 60e3)).fromNow() }}
          </div>
        </div>
        <div v-if="!gameHistory.length">
          <h5>no previous games...</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import router from "@/router";
import { getUser, sendBackendRequest } from "@/utils/user";
import { BackendURL, nicknameMinSize, nicknameMaxSize } from "@/utils/const";
import moment from "moment";
import { store } from "@/store";
import { Game } from "@/store/modules/game";
import TwoFactorSettings from "@/components/TwoFactorSettings.vue"

const editingNickname = ref(false);
const newNickname = ref("");
const nickInput = ref(null);
const gameHistory = ref([]);
const res = ref(null);
const user = computed(() => store.state.auth.user);
const refresh = computed(() => store.state.refreshAvatar);
const winrate = computed(() => gameHistory.value.filter(g => g.playerScore > g.opponentScore).length / (gameHistory.value.length || 1));

function toggleEditNickname() {
  if (editingNickname.value)
    newNickname.value = "";
  else
    nickInput.value?.focus();
  editingNickname.value = !editingNickname.value;
}

function uploadNewImage(userId: number) {
  if (store.state.auth.user?.id !== userId) {
    return ;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept="image/png, image/jpeg";
  input.onchange = async (event) => {
    const file = event.target?.files[0];
    if (!file) { return; }
    const formData = new FormData();
    formData.append('file', file, file.name);

    const r = await sendBackendRequest("/users/avatar/me", {
      method: "POST",
      body: formData
    });

    if (!r || r.status !== 'success') {
      store.dispatch('alert/addError', r ? r.message : "File too big");
      return;
    }

    store.commit('refreshAvatars');
    store.dispatch('alert/addSuccess', "Changed profile picture successfuly");
  }
  input.click();
}

function changeNickname() {
  if (newNickname.value.trim().length < nicknameMinSize || newNickname.value.length > nicknameMaxSize || /^\s*$/.test(newNickname.value)) {
      store.dispatch('alert/addWarning', `Nickname must include ${nicknameMinSize} to ${nicknameMaxSize} characters`);
      return;
  }
  store.dispatch("auth/changeNickname", newNickname.value);
  toggleEditNickname();
}

function show2faModal() {
  store.state.show2faModal = true;
}

onMounted(async () => {
  res.value = await getUser(router.currentRoute.value.params["id"] as string);
  const r = await sendBackendRequest(`/users/${res.value?.payload?.id}/games`);
  if (r.status !== 'success') {
    store.dispatch('alert/addError', r.message);
  }
  gameHistory.value = r.payload.reverse();
  
});


</script>

<style scoped>

.mypfp {
  transition: all 0.2s ease;
}

.mypfp:hover {
  filter: brightness(80%);
  cursor: pointer;
}

</style>