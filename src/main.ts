import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Socketio from "./plugins/Socket.io";

createApp(App)
  .use(store)
  .use(router)
  .use(Socketio, {
    connection: "localhost:3000",
    options: { autoconnect: false },
  })
  .mount("#app");
