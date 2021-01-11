import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import VueSwal from 'vue-swal'
import NProgress from 'nprogress'
import { func } from '@/globals/func.js'
import { store } from './store/store.js'
import "@/assets/stylesheets/global.css"
import 'nprogress/nprogress.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(VueSwal)
Vue.use(NProgress)

NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start();
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});

Vue.config.productionTip = false;
Vue.prototype.$func = func;

new Vue({
    el: '#App',
    vuetify,
    router,
    store: store,
    render: h => h(App)
})