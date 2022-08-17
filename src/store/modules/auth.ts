export type AuthState = {
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
};

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
  mutations: {
    login(state: AuthState, payload: AuthState) {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
    },
    logout(state: AuthState) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
};
