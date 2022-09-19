import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client"
import CONST from "@/utils/const"

const instance = SocketIO(CONST.BackendURL, { autoConnect: false });

createApp(App)
  .use(store)
  .use(router)
  .use(new VueSocketIO({
      debug: true,
      connection: instance,
      vuex: {
          store,
          actionPrefix: 'SOCKET_',
          mutationPrefix: 'SOCKET_'
      }
  }))
  .mount("#app");

store.commit("setSocket", instance);