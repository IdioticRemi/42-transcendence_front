import {Module} from "vuex";
import {StoreState} from "@/store";

export interface GameState {
	queueType: string | null;
}

export default {
    namespaced: true,
    state: {
		queueType: null,
    },
	getters: {
		isQueued(state: GameState) {
			return !!state.queueType;
		}
	},
    actions: {
        addQueue({ rootState }, payload: string) {
			if (payload)
				rootState.socket?.emit("addQueue", { type: payload });
        },
		delQueue({ rootState }) {
			rootState.socket?.emit("delQueue");
        },
		SOCKET_game_queued({ dispatch, commit }, payload: { type: string }) {
			dispatch("alert/addSuccess", `Queued up for a ${payload.type} game`, { root: true });
			commit("setQueueType", payload.type);
		},
		SOCKET_game_unqueued({ dispatch, commit }) {
			dispatch("alert/addSuccess", `Unqueued from matchmaking`, { root: true });
			commit("setQueueType", null);
		}
    },
    mutations: {
		setQueueType(state: GameState, payload: string) {
			state.queueType = payload;
		},
    },
} as unknown as Module<GameState, StoreState>;
