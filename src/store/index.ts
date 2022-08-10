import { createStore } from "vuex";
import ModuleAuth from "./modules/auth";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: ModuleAuth,
  },
});
