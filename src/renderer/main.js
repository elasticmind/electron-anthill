import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>',
}).$mount('#app');

const pollInterval = 300;

(async function poll() {
  try {
    const response = await axios.get('http://localhost:8000');
    store.dispatch('addBulk', response.data);
    setTimeout(poll, pollInterval);
  } catch (error) {
    console.log('Lost connection to local server of Anthill', error);
  }
})();
