import {
    createApp
} from 'vue';
import App from './App.vue';
import installElementPlus from './plugins/element';
import axios from './util/axios';
import utils from './util/utils';

const app = createApp(App);
installElementPlus(app);

app.config.globalProperties.$utils = utils;
app.config.globalProperties.$axios = axios;
 

var vm=app.mount('#app');
window.vm=vm;
