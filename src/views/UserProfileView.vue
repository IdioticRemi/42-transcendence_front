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
              class="rounded me-4 mb-4"
              style="object-fit: cover; width: 15vw; height: 15vw; min-height: 140px; min-width: 140px"
             :src="`${CONST.BackendURL}/users/avatar/${res.payload.username}/${refresh}`"
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
                <button :hidden="!editingNickname" @click="changeNickname()" class="mt-2 btn btn-sm btn-primary py-0 px-1">
                  <i class="bi-check2" />
                </button>
              </div>
            </div>
            <div class="row w-100">
              <b class="col-sm-4 col-12">Joined</b>
              <span class="col-sm-8 col-12 text-sm-end">{{ moment(res.payload.createdAt).format("ll [at] HH:mm") }}</span>
            </div>
            <div class="row w-100">
              <b class="col-sm-4 col-12">K/D</b>
              <span class="col-sm-8 col-12 text-sm-end">WINS / LOSES</span>
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
            <button :hidden="!editingNickname" @click="changeNickname()" class="mt-2 btn btn-sm btn-primary py-0 px-1">
              <i class="bi-check2" />
            </button>
          </div>
          <div class="d-flex justify-content-between w-100">
            <b>Joined</b>
            <span>{{ moment(res.payload.createdAt).format("ll [at] HH:mm") }}</span>
          </div>
          <div class="d-flex justify-content-between w-100">
            <b>K/D</b>
            <div>
              <span class="text-primary">WINS</span> / <span class="text-danger">LOSES</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-0 col-lg-4 d-flex justify-content-end">
        <img @click="uploadNewImage(res.payload.id)"
            class="rounded d-none d-lg-block"
            style="object-fit: cover; width: 15vw; height: 15vw"
            :src="`${CONST.BackendURL}/users/avatar/${res.payload.username}/${refresh}`"
            alt="profile picture"
        />
      </div>
      <div class="col-12">
        <h2 class="mb-4">Match History</h2>
        <div v-for="(match, id) in history" :key="id" class="d-flex-col w-100 w-75-lg card mb-3">
          <h5 class="card-header">
            <span class="text-primary">{{ user.nickname }}</span> vs <span class="text-danger">{{ match.opponent }}</span>
          </h5>
          <div class="row w-100 card-body">
            <div class="col-6">
              <h5>Game type</h5>
              <h5 class="card-subtitle text-muted">{{ match.type }}</h5>
            </div>
            <div class="col-6">
              <h5>Score</h5>
              <h5 class="card-subtitle">
                <span class="text-primary">{{ match.score }}</span> / <span class="text-danger">{{ match.opponentScore }}</span>
              </h5>

            </div>
          </div>
          <div class="card-footer">
            {{ moment(match.endedAt).fromNow() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import router from "@/router";
import { getUser, sendBackendRequest } from "@/utils/user";
import CONST from "@/utils/const";
import moment from "moment";
import { store } from "@/store";

const editingNickname = ref(false);
const newNickname = ref("");
const nickInput = ref(null);
const res = ref(null);
const user = computed(() => store.state.auth.user);
const refresh = computed(() => store.state.refreshAvatar);
const history = ref([
  { opponent: "mdesoeuv", score: 1, opponentScore: 2, endedAt: Date.now() - 1e3 * 60, type: "classic" },
  { opponent: "abucia", score: 3, opponentScore: 0, endedAt: Date.now() - 1e3 * 127, type: "custom" },
  { opponent: "wekjgjhwekjgh12j", score: 0, opponentScore: 3, endedAt: Date.now() - 1e3 * 260, type: "classic" },
  { opponent: "abucia", score: 3, opponentScore: 0, endedAt: Date.now() - 1e3 * 127, type: "custom" },
  { opponent: "wekjgjhwekjgh12j", score: 0, opponentScore: 3, endedAt: Date.now() - 1e3 * 260, type: "classic" },
]);

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
    console.debug(file);
    if (!file) { console.debug("Could not get file to upload"); return; }
    const formData = new FormData();
    formData.append('file', file, file.name);

    const r = await sendBackendRequest("/users/avatar/me", {
      method: "POST",
      body: formData
    });

    if (!r || r.status !== 'success') {
      store.dispatch('alert/addError', r ? r.message : "Error");
      return;
    }

    store.commit('refreshAvatars');
    store.dispatch('alert/addSuccess', "Changed profile picture successfuly");
  }
  input.click();
}

function changeNickname() {
  store.dispatch("auth/changeNickname", newNickname.value);
  toggleEditNickname();
}

onMounted(async () => {
  res.value = await getUser(router.currentRoute.value.params["id"] as string);
});
</script>