import {Module} from "vuex";
import {StoreState} from "@/store";
import { getUser } from "@/utils/user";

export interface GameState {
	queueType: string | null;
	inviteList: Invite[];
	isInviting: boolean;
	inviteTarget: string;
}

export interface Invite {
	id: number;
	nickname: string;
	type: string;
}

export default {
    namespaced: true,
    state: {
		queueType: null,
		inviteList: [],
		isInviting: false,
		inviteTarget: "",
    },
	getters: {
		isQueued(state: GameState) {
			return !!state.queueType;
		}
	},
    actions: {
        addQueue({ rootState }, payload: string) {
			if (payload)
				rootState.socket?.emit("game_add_queue", { type: payload });
        },
		delQueue({ rootState }) {
			rootState.socket?.emit("game_del_queue");
        },
		SOCKET_game_queued({ dispatch, commit }, payload: { type: string }) {
			dispatch("alert/addSuccess", `Queued up for a ${payload.type} game`, { root: true });
			commit("setQueueType", payload.type);
		},
		SOCKET_game_unqueued({ dispatch, commit }) {
			dispatch("alert/addSuccess", `Unqueued from matchmaking`, { root: true });
			commit("setQueueType", null);
		},
		SOCKET_game_invite_sent({ dispatch, commit }, payload: Invite) {
			dispatch("alert/addSuccess", `Sent invite to ${payload.nickname}`, { root: true });
			commit("setQueueType", payload.type);
		},
		SOCKET_game_invite_cancel({ store, dispatch, commit }) {
			dispatch("alert/addSuccess", `Cancelled invite successfully`, { root: true });
			commit("setQueueType", null);
		},
		async openInviteModal({ state, dispatch }, payload: string | number) {
			if (typeof(payload) === 'number') {
				const u = await getUser(payload);

  				if (u && u.status === "success") {
					state.inviteTarget = u.payload.nickname;
				} else {
					dispatch("alert/addError", "Failed to fill user nickname", { root: true });
				}
			}
			else {
				state.inviteTarget = payload;
			}
			state.isInviting = true;
		},
		inviteUser({ rootState  }, payload: { nickname: string, type: string } ) {
			rootState.socket?.emit("game_invite", payload);
		},
		uninviteUser({ rootState  }, payload: { nickname: string, type: string } ) {
			rootState.socket?.emit("game_uninvite", payload);
		},
		acceptInvite({rootState }, payload: Invite) {
			rootState.socket?.emit("game_invite_accept", payload);
		},
		refuseInvite({ rootState, state }, payload: Invite) {
			state.inviteList = state.inviteList.filter(i => i !== payload);
			rootState.socket?.emit("game_invite_refuse", payload);
		}
    },
    mutations: {
		setQueueType(state: GameState, payload: string) {
			state.queueType = payload;
		},
		SOCKET_game_found(state: GameState, payload: Invite) {
			state.queueType = null;
		},
		SOCKET_game_invite(state: GameState, payload: Invite) {
			state.inviteList.push(payload);
		},
		SOCKET_game_invite_del(state: GameState, payload: Invite) {
			state.inviteList = state.inviteList.filter(i => i.id !== payload.id && i.type !== payload.type);
		},
		SOCKET_game_invite_accepted(state: GameState, payload: Invite) {
			state.isInviting = false;
		},
		SOCKET_game_invite_refused(state: GameState, payload: Invite) {
			state.isInviting = false;
		},
    },
} as unknown as Module<GameState, StoreState>;
