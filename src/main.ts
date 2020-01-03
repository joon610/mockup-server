import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: (h: any): any => h(App),
}).$mount('#app');
