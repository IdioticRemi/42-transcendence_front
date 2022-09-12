import {Module} from "vuex";
import {StoreState} from "@/store";
import { getUser } from "@/utils/user";
import router from "@/router";
import moment from "moment";

// TODO: Typer gameData
export interface GameState {
	queueType: string | null;
	inviteList: Invite[];
	isInviting: boolean;
	inviteTarget: string;
	gameData: any;
	gameEnd: GameEnd | null;
}

export interface GameEnd {
	winnerNick: string;
	winnerId: number;
	winnerScore: number;
	loserScore: number;
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
		gameData: null,
		gameEnd: null,
    },
	getters: {
		isQueued(state: GameState) {
			return !!state.queueType;
		},
		isInGame(state: GameState) {
			return !!state.gameData;
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
		},
		sendMove({ rootState }, payload: string) {
			rootState.socket?.emit("game_move", payload);
		},
		deleteGameEnd({ state }) {
			state.gameEnd = null;
		}
    },
    mutations: {
		setQueueType(state: GameState, payload: string) {
			state.queueType = payload;
		},
		SOCKET_game_found(state: GameState, payload: Invite) {
			state.queueType = null;
			state.gameEnd = null;
			router.push("/pong");
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
			state.queueType = null;
		},
		SOCKET_game_data(state: GameState, payload) {
			state.gameData = payload;
		},
		SOCKET_game_ended(state: GameState, payload: GameEnd) {
			state.gameData = null;
			state.gameEnd = payload;
			router.push("/");
			// TODO: Mettre dans un truc genre 'gameResult' les donnees de fin de game (score, ...) pour afficher le endgame screen
		}
    },
} as unknown as Module<GameState, StoreState>;
