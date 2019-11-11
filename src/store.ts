import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        apiInfoList: [],
    },
    getters: {
        apiInfoList: (state) => {
            return state.apiInfoList;
        },
    },
    mutations: {
        apiInfoList(state, payload) {
            state.apiInfoList = payload;
        },
    },
});
