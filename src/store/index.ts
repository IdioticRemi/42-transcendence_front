import {createStore, Store} from "vuex";
import {Socket} from "socket.io-client"
import ModuleAuth, {AuthState} from "./modules/auth";
import ModuleChat, {ChatState} from "./modules/chat";
import ModuleAlert, {AlertState} from "./modules/alert";
import ModuleGame, {GameState} from "./modules/game";

export interface StoreState {
  socket: Socket | null;
  refreshAvatar: number;
  show2faModal: boolean;
  show2faCodeModal: boolean;
  auth: AuthState;
  chat: ChatState;
  alert: AlertState;
  game: GameState;
}


export const store = createStore({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  state: {
    socket: null as Socket | null,
    refreshAvatar: Date.now(),
    show2faModal: false,
    show2faCodeModal: false,
  },
  getters: {

  },
  mutations: {
    setSocket(state, payload: Socket) {
      state.socket = payload;
    },
    refreshAvatars(state) {
      state.refreshAvatar = Date.now();
    }
  },
  actions: {
    
  },
  modules: {
    auth: ModuleAuth,
    chat: ModuleChat,
    alert: ModuleAlert,
    game: ModuleGame,
  },
}) as unknown as Store<StoreState>;
