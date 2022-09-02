import {Module} from "vuex";
import {StoreState} from "@/store";

export interface Alert {
    type: string;
    message: string;
}

export interface AlertState {
    alerts: Alert[];
}

export default {
    namespaced: true,
    state: {
        alerts: []
    },
    actions: {
        addError({ commit }, payload: string) {
            commit("SOCKET_error", payload);
        },
        addWarning({ commit }, payload: string) {
            commit("SOCKET_warning", payload);
        },
        addSuccess({ commit }, payload: string) {
            commit("SOCKET_success", payload);
        }
    },
    mutations: {
        SOCKET_error(state: AlertState, payload: string) {
            state.alerts.push({ type: 'danger', message: payload });
            setTimeout(() => {
                state.alerts = state.alerts.filter(e => e.message !== payload && e.type !== 'error');
            }, 5000);
        },
        SOCKET_warning(state: AlertState, payload: string) {
            state.alerts.push({ type: 'warning', message: payload });
            setTimeout(() => {
                state.alerts = state.alerts.filter(e => e.message !== payload && e.type !== 'warning');
            }, 5000);
        },
        SOCKET_success(state: AlertState, payload: string) {
            state.alerts.push({ type: 'success', message: payload });
            setTimeout(() => {
                state.alerts = state.alerts.filter(e => e.message !== payload && e.type !== 'success');
            }, 5000);
        }
    },
} as unknown as Module<AlertState, StoreState>;
