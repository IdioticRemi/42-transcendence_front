export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  getters: {
    isConnected: (state: any) => state.token != null && state.user != null,
  },
  mutations: {
    login(state: any, payload: any) {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
    },
    logout(state: any) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
};
