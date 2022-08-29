import {Module} from "vuex";
import {StoreState} from "@/store";

export interface ChatMessage {
  user: string;
  content: string;
}

export interface ChatChannel {
  name: string;
  id: number;
  messages: ChatMessage[];
}

export interface ChatState {
  selected: number | null;
  channels: Map<number, ChatChannel>;
  action: ChatActions,
}

export enum ChatActions {
  LIST_CHANNELS,
  LIST_AVAILABLE_CHANNELS,
  CREATE_CHANNEL,
  CHANNEL_VIEW,
}

export default {
  namespaced: true,
  state: {
    selected: null,
    channels: new Map(),
    action: 0,
  } as ChatState,
  getters: {
    getMessages(state: ChatState): ChatMessage[] {
      return state.channels.get(state.selected || -1)?.messages || [];
    },
    getChannels(state: ChatState) {
      return state.channels.keys();
    },
  },
  actions: {
    getMyChannels({ rootState }) {
      rootState.socket?.emit("channel_list");
    },
    newMessage({ state, rootState }, payload: string) {
      rootState.socket?.emit("channel_message", { channelId: state.selected, content: payload })
    },
    subToChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_subscribe", { channelId: payload })
    },
    unsubFromChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_unsubscribe", { channelId: payload })
    },
    createChannel({ rootState }, payload: { name: string, private: boolean, password?: string }) {
      if (!payload.password)
        delete payload.password;
      rootState.socket?.emit("channel_create", payload)
    },
    joinChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_join", { channelId: payload })
    },
    leaveChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_leave", { channelId: payload })
    },
    deleteChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_delete", { channelId: payload })
    },
    selectChannel({ state }, payload: number) {
      state.selected = payload;
      this.dispatch("chat/setAction", ChatActions.CHANNEL_VIEW);
    },
    unselectChannel({ state }) {
      state.selected = null;
      this.dispatch("chat/setAction", ChatActions.LIST_CHANNELS);
    },
    setAction({ state }, payload: number) {
      state.action = payload;
    },
  },
  mutations: {
    SOCKET_channel_message(state: ChatState, payload: { channelId: number, user: number, content: string }) {
      state.channels.get(payload.channelId)?.messages.push({ content: payload.content, user: payload.user.toString() })
    },
    SOCKET_channel_info(state: ChatState, { id, name, messages }: { id: number, name: string, messages: { id: number, userId: number, content: string }[] }) {
      state.channels.set(id, { name, id, messages: messages.map(m => { return { content: m.content, user: m.userId.toString() } }) });
    },
    SOCKET_channel_leave(state: ChatState, payload: {channelId: number}) {
      if (state.selected === payload.channelId)
        state.selected = null;
      state.channels.delete(payload.channelId);
    },
  },
} as Module<ChatState, StoreState>;
