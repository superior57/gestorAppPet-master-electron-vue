import Vue from 'vue';
import { mapGetters } from "vuex";

//const API_FRONT = 'http://18.228.156.138:3333/';

export default {
  namespaced: true,

  computed: {
    ...mapGetters(["company"])
  },

  methods: {
    getServer() {
      return this.company.server
    }
  },

  actions: {
    async createOrder(context, {order, server}) {
      return new Promise((resolve, reject) => {
        try {
          Vue.http.post(`${server}order`, order)
            .then(response => resolve(response))
            .catch(error => reject(error))
        } catch (error) {
          reject(error)
        }
      })
    },

    async createSchedule(context, {schedule, server}) {
      return new Promise((resolve, reject) => {
        try {
          Vue.http.post(`${server}schedule`, schedule)
            .then(response => resolve(response))
            .catch(error => reject(error))
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}