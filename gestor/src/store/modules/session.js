import { postResponse } from '../utils'
import Logo from '@/assets/logo.png'
import newOrderSound from '@/assets/new_order.mp3'
import newScheduleSound from '@/assets/latido.mp3'
import { getOrders, getOrderItems } from './order'
import { getSchedules } from './schedule'
import { updateCompany, getCompany } from './company'
import { updateUser } from './user'

let orders, schedules = void 0;

const configSystem = async function (context) {
  const { state } = context
  if (state.company === void 0) return

  document.title = state.company.name + " - Gestor de pedidos"

  await updateOrders(context);

  await updateSchedules(context);

  return true
}

const emittingSound = function (pending, sound) {
  return setInterval(() => {
    if (pending.length > 0) {
      sound.play()
    }
  });
}

const getAudio = function (sound) {
  if (sound !== void 0) {
    return new Audio(sound)
  }
}

export const updateOrders = async function (context) {
  const { state } = context
  const emitting = state.pendingOrders.length > 0

  orders = (await getOrders(state.company.id)).data

  state.pendingOrders = orders.filter(o => o.status == 'AB')
  state.inSeparationOrders = orders.filter(o => o.status == 'CF')
  state.onDeliveryOrders = orders.filter(o => o.status == 'ET')

  if (orders !== void 0) {
    if (!emitting) {
      if (state.pendingOrders.length > 0) {
        if (state.orderSound === void 0) {
          state.orderSound = getAudio(state.config.newOrderSound)
        }

        state.orderSound.play()
        state.timerOrderSound = emittingSound(state.pendingOrders, state.orderSound)
      }
    } else {
      if (state.pendingOrders.length == 0) {
        if (state.orderSound) {
          state.orderSound.pause();
          state.orderSound.currentTime = 0;
        }

        clearInterval(state.timerOrderSound)
      }
    }

    if (state.order === void 0 ||
      (state.order !== void 0 && orders.find(o => o.id == state.order.id) === void 0)) {
      let selectOrder = state.pendingOrders[0] ||
        state.inSeparationOrders[0] ||
        state.onDeliveryOrders[0]

      if (selectOrder !== void 0) {
        selectOrder.items = (await getOrderItems(selectOrder.id)).data
        state.order = selectOrder
      } else
        state.order = void 0
    }
  } else
    state.order = void 0

  return orders
}

export const updateSchedules = async function (context) {
  const { state } = context
  const emitting = state.openingSchedules.length > 0

  schedules = (await getSchedules(state.company.id)).data

  state.openingSchedules = schedules.filter(o => o.status == 'AB')
  state.closingSchedules = schedules.filter(o => o.status != 'AB')

  if (schedules !== void 0) {
    if (!emitting) {
      if (state.openingSchedules.length > 0) {
        if (state.scheduleSound === void 0) {
          state.scheduleSound = getAudio(state.config.newScheduleSound)
        }

        state.scheduleSound.play()
        state.timerScheduleSound = emittingSound(state.openingSchedules, state.scheduleSound)
      }
    } else {
      if (state.openingSchedules.length == 0) {
        if (state.scheduleSound) {
          state.scheduleSound.pause();
          state.scheduleSound.currentTime = 0;
        }
        clearInterval(state.timerScheduleSound)
      }
    }
  }

  return schedules
}

export default {
  // namespaced: true,

  state: {
    token: localStorage.getItem('token') || null,
    user: void 0,
    configured: false,

    company: {
      name: 'Gestor App Pet',
      theme: 'cyan'
    },

    config: {
      miniMenu: true,
      logoIcon: Logo,
      newOrderSound: newOrderSound,
      newScheduleSound: newScheduleSound,
      isElectronjs: (window && window.process && window.process.type),
    },

    order: void 0,
    orderSound: void 0,
    timerOrderSound: void 0,
    pendingOrders: [],
    inSeparationOrders: [],
    onDeliveryOrders: [],

    scheduleSound: void 0,
    timerScheduleSound: void 0,
    openingSchedules: [],
    closingSchedules: []
  },

  getters: {
    loggedIn(state) {
      try {
        state.user = JSON.parse(state.token);
        return state.user !== null
      } catch (error) {
        return false
      }
    },

    user(state) {
      return state.user
    },

    company(state) {
      return state.company
    },

    config(state) {
      return state.config
    },

    order(state) {
      return state.order
    },

    configured(state) {
      return state.configured
    },

    pendingOrders(state) {
      return state.pendingOrders
    },

    inSeparationOrders(state) {
      return state.inSeparationOrders
    },

    onDeliveryOrders(state) {
      return state.onDeliveryOrders
    },

    openingSchedules(state) {
      return state.openingSchedules
    },

    closingSchedules(state) {
      return state.closingSchedules
    }
  },

  mutations: {
    retrieveToken(state, token) {
      state.token = token
    },

    destroyToken(state) {
      state.token = null
    },

    setUser(state, user) {
      state.user = user;
    },

    setCompany(state, company) {
      state.company = company;
    },

    setOpenCompany(state, open) {
      state.company.open = open
    },

    setOrder(state, order) {
      state.order = order
    },

    setPendingOrders(state, pending) {
      state.pendingOrders = pending
    },

    setInSeparationOrders(state, inSeparation) {
      state.inSeparationOrders = inSeparation
    },

    setOnDeliveryOrders(state, onDelivey) {
      state.onDeliveryOrders = onDelivey
    },

    setOrderSound(state, sound) {
      state.orderSound = sound
    },

    setTimerOrderSound(state, timer) {
      state.timerOrderSound = timer
    },

    setOpeningSchedules(state, schedules) {
      state.openingSchedules = schedules
    },

    setClosingSchedules(state, schedules) {
      state.closingSchedules = schedules
    },

    setScheduleSound(state, sound) {
      state.scheduleSound = sound
    },

    setTimerScheduleSound(state, timer) {
      state.timerScheduleSound = timer
    },

    setConfigured(state, configured) {
      state.configured = configured
    }
  },

  actions: {
    async login(context, user) {
      const { commit } = context
      const res = (await postResponse('gestor/login/', {
        login: user.login,
        password: user.password
      }))

      if (res.error)
        throw res.error

      let json = JSON.stringify(res.data);

      localStorage.setItem('token', json)
      commit('retrieveToken', json)

      commit('setUser', res.data)

      let company = (await getCompany(res.data.company_id)).data

      commit('setCompany', company)
      await configSystem(context)

      return res.data
    },

    async configSystem(context) {
      let configured = await configSystem(context)
      context.commit('setConfigured', configured)
      return configured
    },

    logout(context) {
      localStorage.removeItem('token')
      context.commit('destroyToken')
    },

    async setOrder({ commit }, order) {
      let items = (await getOrderItems(order.id)).data
      commit('setOrder', { ...order, items })
    },

    async getOrders(context) {
      return await updateOrders(context)
    },

    async updateSessionUser({ state }) {
      let json = JSON.stringify(state.user);
      localStorage.setItem('token', json)
      return await updateUser(state.user)
    },

    async updateSessionCompany({ state }) {
      return await updateCompany(state.company)
    }
  }
}