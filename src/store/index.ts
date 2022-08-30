import {createStore, Store} from "vuex";
import {Socket} from "socket.io-client"
import ModuleAuth, {AuthState} from "./modules/auth";
import ModuleChat, {ChatState} from "./modules/chat";
import ModuleError, {ErrorState} from "./modules/error";

export interface StoreState {
  socket: Socket | null;
  auth: AuthState;
  chat: ChatState;
  error: ErrorState;
}

export const store = createStore({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  state: {
    socket: null as Socket | null,
  },
  getters: {},
  mutations: {
    setSocket(state, payload: Socket) {
      state.socket = payload;
    }
  },
  actions: {},
  modules: {
    auth: ModuleAuth,
    chat: ModuleChat,
    error: ModuleError,
  },
}) as unknown as Store<StoreState>;
