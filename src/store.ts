import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        resApiList: {aa: 'hello'},
    },
    getters: {
        resApiList: (state) => {
            return state.resApiList;
        },
    },
    mutations: {
        resApiList(state, payload) {
            state.resApiList = payload;
        },
    },
});
