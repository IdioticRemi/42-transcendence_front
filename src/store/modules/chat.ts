export type ChatMessage = {
  user: string;
  content: string;
};

export type ChatChannel = {
  name: string;
  messages: ChatMessage[];
};

export type ChatState = {
  selected: string | null;
  channels: Map<string, ChatChannel>;
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
    newMessage(state: ChatState, payload: ChatMessage) {
      state.channels.get(state.selected || "")?.messages.push(payload);
    },
    newChannel(state: ChatState, { name, messages = [] }: ChatChannel) {
      if (state.channels.get(name))
        state.channels.get(name)!.messages = messages;
      else state.channels.set(name, { name, messages });
    },
    deleteChannel(state: ChatState, payload: string) {
      if (state.channels.get(payload)) state.channels.delete(payload);
    },
    selectChannel(state: ChatState, payload: string) {
      if (state.channels.get(payload)) state.selected = payload;
      else state.selected = null;
    },
    unselectChannel(state: ChatState) {
      state.selected = null;
    },
  },
};
