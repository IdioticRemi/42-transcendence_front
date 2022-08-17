import { createStore } from "vuex";
import ModuleAuth, { AuthState } from "./modules/auth";
import ModuleChat, { ChatState } from "./modules/chat";

export type StoreState = {
  auth: AuthState;
  chat: ChatState;
};

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
