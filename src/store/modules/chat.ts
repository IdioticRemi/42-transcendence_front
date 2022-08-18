export type ChatMessage = {
  user: string;
  content: string;
};

export type ChatChannel = {
  name: string;
  id: number;
  messages: ChatMessage[];
};

export type ChatState = {
  selected: number | null;
  channels: Map<number, ChatChannel>;
};

export default {
  namespaced: true,
  state: {
    selected: null,
    channels: new Map(),
  } as ChatState,
  getters: {
    getMessages(state: ChatState): ChatMessage[] {
      if (state.selected) return state.channels.get(state.selected)!.messages;
      return [];
    },
    getChannels(state: ChatState) {
      return state.channels.keys();
    },
  },
  mutations: {
    "channel_message"(state: ChatState, payload: { user: { nickname: string }, channelId: number, content: string }) {
      state.channels.get(payload.channelId)?.messages.push({ user: payload.user.nickname, content: payload.content });
    },
    newMessage(state: ChatState, payload: ChatMessage) {
      state.channels.get(state.selected || -1)?.messages.push(payload);
    },
    newChannel(state: ChatState, { name, id, messages = [] }: ChatChannel) {
      if (state.channels.get(id))
        state.channels.get(id)!.messages = messages;
      else state.channels.set(id, { name, messages, id });
    },
    deleteChannel(state: ChatState, payload: number) {
      if (state.channels.get(payload)) state.channels.delete(payload);
    },
    selectChannel(state: ChatState, payload: number) {
      if (state.channels.get(payload)) state.selected = payload;
      else state.selected = null;
    },
    unselectChannel(state: ChatState) {
      state.selected = null;
    },
  },
};
