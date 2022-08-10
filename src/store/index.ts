import { createStore } from "vuex";
import ModuleAuth from "./modules/auth";

export const store = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: ModuleAuth,
  },
});
