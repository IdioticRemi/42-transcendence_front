import { createStore } from "vuex";
import ModuleAuth from "./modules/auth";
import ModuleChat from "./modules/chat";

export const store = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: ModuleAuth,
    chat: ModuleChat,
  },
});
