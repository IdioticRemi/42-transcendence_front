import {Module} from "vuex";
import {StoreState} from "@/store";
import { useRoute } from "vue-router";

export interface AuthState {
  token: string | null;
  otp_token: string | null;
  user: {
    id: number;
    createdAt: string;
    deletedAt: string | null;
    updatedAt: string | null;
    img_path: string;
    nickname: string;
    username: string;
    otp_enabled: boolean;
  } | null;
}

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
    otp_token: null,
  },
  getters: {
    isConnected: (state: AuthState) =>
      state.token != null && state.user != null,
  },
  actions: {
    login({ state, rootState, commit, dispatch }, payload) {
      commit("loginUser", payload);
      rootState.socket.io.opts.extraHeaders = {};
      rootState.socket.io.opts.extraHeaders["authorization"] = state.token;
      try {
        rootState.socket?.connect();
      } catch {}
      dispatch("chat/setMyId", state.user.id, {root: true})
    },
    logout({ rootState, commit, dispatch }) {
      commit("logoutUser");
      rootState.socket?.disconnect();
      dispatch("chat/setMyId", -1, {root: true})
    },
    changeNickname({ rootState }, payload: string) {
      if (payload)
        rootState.socket?.emit('user_nick', { newNick: payload });
    },
    SOCKET_logout_user({ commit, dispatch }) {
      commit('logoutUser', false);
      dispatch('alert/addError', "You are already connected somewhere else", { root: true });
    }
  },
  mutations: {
    //TODO otp_token a recuperer
    loginUser(state: AuthState, payload: AuthState) {
      const { user, token, otp_token } = payload;
      state.user = user;
      console.debug("otp_token", otp_token);
      state.token = token;
      state.otp_token = otp_token;
    },
    logoutUser(state: AuthState, payload = true) {
      state.user = null;
      state.token = null;
      state.otp_token = null;
      if (payload) {
        localStorage.removeItem("token");
        localStorage.removeItem("otp_token");
      }
    },
    SOCKET_user_nick(state: AuthState, payload: { newNick: string }) {
      if (state.user)
        state.user.nickname = payload.newNick;
    },
  },
} as unknown as Module<AuthState, StoreState>;
