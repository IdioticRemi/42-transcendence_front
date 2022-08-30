import {Module} from "vuex";
import {StoreState} from "@/store";

export interface ChatMessage {
  user: string;
  nick: string;
  content: string;
}

export interface ChatChannel {
  name: string;
  id: number;
  messages: ChatMessage[];
}

export interface Blocked {
  nickname: string,
  id: number,
}

export interface Friend {
  nickname: string;
  id: number;
  status: FriendStatus;
  messages: ChatMessage[];
}

export interface ChatState {
  myId: number;
  selected: number | null;
  selectedFriend: number | null;
  channels: Map<number, ChatChannel>;
  friends: Map<number, Friend>;
  blocked: Map<number, Blocked>;
  action: ChatActions;
}

export enum FriendStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  PENDING = 'pending',
}

export enum ChatActions {
  LIST_CHANNELS = "list_channels",
  LIST_AVAILABLE_CHANNELS = "list_available_channels",
  CREATE_CHANNEL = "create_channel",
  CHANNEL_VIEW = "channel_view",
  CHANNEL_JOIN_PRIVATE = "channel_join_private",
  FRIEND_LIST = "friend_list",
  FRIEND_ADD = "friend_add",
  FRIEND_MESSAGE = "friend_message",
  BLOCKED_LIST = "blocked_list",
}

export default {
  namespaced: true,
  state: {
    myId: -1,
    selected: null,
    selectedFriend: null,
    channels: new Map(),
    friends: new Map(),
    blocked: new Map(),
    action: ChatActions.LIST_CHANNELS,
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
    createChannel({ rootState }, payload: { name: string, private: boolean, password?: string }) {
      if (!payload.password)
        delete payload.password;
      rootState.socket?.emit("channel_create", payload)
    },
    joinChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_join", { channelId: payload })
    },
    joinPrivateChannel({ rootState }, payload: { channelName: string, password?: string }) {
      rootState.socket?.emit("channel_joinprv", payload);
    },
    leaveChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_leave", { channelId: payload })
    },
    deleteChannel({ rootState }, payload: number) {
      rootState.socket?.emit("channel_delete", { channelId: payload })
    },
    selectChannel({ state, dispatch }, payload: number) {
      state.selected = payload;
      dispatch("setAction", ChatActions.CHANNEL_VIEW);
    },
    unselectChannel({ state, dispatch }) {
      state.selected = null;
      dispatch("setAction", ChatActions.LIST_CHANNELS);
    },
    setAction({ state }, payload: string) {
      state.action = payload;
    },
    getMyFriends({ rootState }) {
      rootState.socket?.emit("friend_list");
    },
    sendFriendRequest({ rootState }, payload: string) {
      rootState.socket?.emit("friend_add", { userNick: payload });
    },
    unfriend({ state, rootState }) {
      if (state.selectedFriend)
        rootState.socket?.emit("friend_remove", { friendId: state.selectedFriend });
    },
    selectFriend({ state, dispatch }, payload: number) {
      state.selectedFriend = payload;
      dispatch("setAction", ChatActions.FRIEND_MESSAGE);
    },
    unselectFriend({ state, dispatch }) {
      state.selectedFriend = null;
      dispatch("setAction", ChatActions.FRIEND_LIST);
    },
    newFriendMessage({ state, rootState }, payload: string) {
      rootState.socket?.emit("friend_message", { friendId: state.selectedFriend, content: payload })
    },
    setMyId({ state }, payload: number) {
      state.myId = payload;
    },
    blockUser({ rootState }, payload: number) {
      rootState.socket?.emit('user_block', { userId: payload })
    },
    unblockUser({ rootState }, payload: number) {
      rootState.socket?.emit('user_unblock', { userId: payload })
    }
  },
  mutations: {
    SOCKET_channel_message(state: ChatState, payload: { channelId: number, userId: number, userNick: string, content: string }) {
      if (state.blocked.has(payload.userId))
        return;
      state.channels.get(payload.channelId)?.messages.push({ content: payload.content, nick: payload.userNick, user: payload.userId.toString() })
    },
    SOCKET_channel_info(state: ChatState, { id, name, messages }: { id: number, name: string, messages: { id: number, userId: number, userNick: string, content: string }[] }) {
      state.channels.set(id, { name, id, messages: messages.map(m => { return { content: m.content, nick: m.userNick, user: m.userId.toString() } }) });
    },
    SOCKET_channel_join(state: ChatState, payload: { channelId: number }) {
        state.selected = payload.channelId;
        state.action = ChatActions.CHANNEL_VIEW;
    },
    SOCKET_channel_leave(state: ChatState, payload: {channelId: number}) {
      if (state.selected === payload.channelId) {
        state.selected = null;
        state.action = ChatActions.LIST_CHANNELS;
      }
      state.channels.delete(payload.channelId);
    },
    SOCKET_friend_info(state: ChatState, { id, nickname, messages, status }: { id: number, nickname: string, status: FriendStatus, messages: { id: number, userNick: string, userId: number, content: string }[] }) {
      state.friends.set(id, { nickname, status, id, messages: messages.map(m => { return { content: m.content, nick: m.userNick, user: m.userId.toString() } }) });
    },
    SOCKET_friend_message(state: ChatState, payload: { friendId: number, userId: number, userNick: string, content: string }) {
      state.friends.get(payload.userId === state.myId ? payload.friendId : payload.userId)?.messages.push({ content: payload.content, nick: payload.userNick, user: payload.userId.toString() })
    },
    SOCKET_friend_status(state: ChatState, payload: { id: number, status: FriendStatus }) {
      const f = state.friends.get(payload.id);

      if (f)
        f.status = payload.status;
    },
    SOCKET_friend_remove(state: ChatState, payload: { friendId: number }) {
      if (payload.friendId === state.selectedFriend)
        state.action = ChatActions.FRIEND_LIST;

      state.friends.delete(payload.friendId);
    },
    SOCKET_user_block(state: ChatState, payload: { userId: number, userNick: string }) {
      state.blocked.set(payload.userId, { nickname: payload.userNick, id: payload.userId });
    },
    SOCKET_user_unblock(state: ChatState, payload: { userId: number }) {
      state.blocked.delete(payload.userId);
    },
  },
} as unknown as Module<ChatState, StoreState>;
