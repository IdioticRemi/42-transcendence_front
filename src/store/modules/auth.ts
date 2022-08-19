import {ActionPayload, Module} from "vuex";
import {store, StoreState} from "@/store";

export interface AuthState {
  token: string | null;
  user: {
    id: number;
    createdAt: string;
    deletedAt: string | null;
    updatedAt: string | null;
    img_path: string;
    nickname: string;
    username: string;
  } | null;
}

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  getters: {
    isConnected: (state: AuthState) =>
      state.token != null && state.user != null,
  },
  actions: {
    login({ state, rootState, commit }, payload) {
      commit("loginUser", payload);
      console.debug(rootState.socket);
      rootState.socket.io.opts.extraHeaders = {};
      rootState.socket.io.opts.extraHeaders["authorization"] = state.token;
      rootState.socket?.on("connect_error", console.debug)
      rootState.socket?.on("connect", console.debug)
      rootState.socket?.on("disconnect", console.debug)
      try {
        rootState.socket?.connect();
      } catch (e) {
        console.warn(e);
      }
    },
    logout({ rootState, commit }) {
      commit("logoutUser");
      console.debug(rootState.socket);
      rootState.socket?.disconnect();
    }
  },
  mutations: {
    loginUser(state: AuthState, payload: AuthState) {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
    },
    logoutUser(state: AuthState) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
} as unknown as Module<AuthState, StoreState>;
