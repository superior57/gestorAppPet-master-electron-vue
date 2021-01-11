import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import session, { updateOrders, updateSchedules } from './modules/session'
import company from './modules/company'
import user from './modules/user'
import order from './modules/order'
import schedule from './modules/schedule'
import client from './modules/client'
import moura from './modules/apis/moura'
import notification from './modules/notification'
import city from './modules/city'
import district from './modules/district'
import product from './modules/product'
import report from './modules/report'
import * as serverActionsGet from './serverActionsGet'
import * as serverActionsDelete from './serverActionsDelete'
import * as actionsSave from './serverActionsSave'
import io from 'socket.io-client'

//export const apiUrl = 'http://192.168.0.20:3000';

//export const apiUrl = 'http://167.71.105.19:3000/';
export const apiUrl = 'http://ec2-54-94-161-102.sa-east-1.compute.amazonaws.com:3000/';

Vue.use(Vuex)
Vue.use(VueResource)
Vue.http.options.root = apiUrl;

// Vue.http.interceptors.push((request, next) => {
//     next(response => {
//         if (!response.ok) {
//             throw `${response.status} - ${response.statusText}`
//         }
//     })
// })

export const store = new Vuex.Store({
    modules: {
        session,
        company,
        user,
        order,
        schedule,
        client,
        moura,
        notification,
        city,
        district,
        product,
        report
    },

    actions: {
        ...actionsSave,
        ...serverActionsGet,
        ...serverActionsDelete,
    }
})

const server = io.connect(apiUrl)

server.on('update-orders', ({ id }) => {
    if (session.state.company.id == id)
        updateOrders(session)
})

server.on('update-schedules', ({ id }) => {
    if (session.state.company.id == id)
        updateSchedules(session)
})