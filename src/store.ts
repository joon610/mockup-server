import Vue from 'vue';
import Vuex from 'vuex';
import { stat } from 'fs';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        apiInfoList: [],
        apiRequestLog: [],
        logHistroy:[],
        rootPath: '',
    },
    getters: {
        apiInfoList: state => {
            return state.apiInfoList;
        },
        apiRequestLog: state => {
            return state.apiRequestLog;
        },
        logHistory: state =>{
            return state.logHistroy;
        },
        rootPath: state =>{
            return state.rootPath;
        }
    },
    mutations: {
        apiInfoList(state, payload): void {
            state.apiInfoList = payload;
        },
        rootPath(state,payload):void {
            state.rootPath = payload;
        },
        apiRequest(state,payload):void {
            state.apiRequestLog = payload;
        },
        logHistroy(state,payload):void {
            state.logHistroy = payload;
        }
    
    },
});
