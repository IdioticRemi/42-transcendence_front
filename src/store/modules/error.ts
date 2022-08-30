import {Module} from "vuex";
import {StoreState} from "@/store";

export interface ErrorState {
    errors: string[];
}

export default {
    namespaced: true,
    state: {
        errors: []
    },
    actions: {
        addError({ commit }, payload: string) {
            commit("SOCKET_error", payload);
        }
    },
    mutations: {
        SOCKET_error(state: ErrorState, payload: string) {
            state.errors.push(payload);
            setTimeout(() => {
                state.errors = state.errors.filter(e => e != payload);
            }, 5000);
        }
    },
} as unknown as Module<ErrorState, StoreState>;
