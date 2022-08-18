import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import VueSocketIO from "vue-3-socket.io";
import CONST from "@/utils/const"
import SocketIO from 'socket.io-client'

createApp(App)
  .use(store)
  .use(router)
  .use(new VueSocketIO({
    debug: true,
    connection: SocketIO(CONST.BackendURL),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  }))
  .mount("#app");
