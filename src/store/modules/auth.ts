import {Module} from "vuex";
import {StoreState} from "@/store";

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
