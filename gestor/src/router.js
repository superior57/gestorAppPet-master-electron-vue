import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '@/store/store.js'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/view/Home.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                top: {
                    show: false
                }
            },
            children: [
                {
                    path: 'orders',
                    name: 'orders',
                    component: () => import('@/components/Order/Orders.vue')
                },
                {
                    path: 'schedules',
                    component: () => import('@/components/Schedule/Schedules.vue')
                },
                {
                    path: 'reports',
                    component: () => import('@/components/Report/Index.vue'),
                    children: [
                        {
                            path: 'clients',
                            name: 'Clientes',
                            component: () => import('@/components/Report/Clients.vue')
                        },
                        {
                            path: 'orders',
                            name: 'Vendas',
                            component: () => import('@/components/Report/Orders.vue')
                        },
                        {
                            path: 'schedules',
                            name: 'Agendamentos',
                            component: () => import('@/components/Report/Schedules.vue')
                        }
                    ]
                },
                {
                    path: 'management',
                    component: () => import('@/components/Management/Management.vue'),
                    children: [
                        {
                            path: 'category',
                            name: 'Categorias',
                            component: () => import('@/components/Management/entries/Category.vue')
                        },
                        {
                            path: 'product',
                            name: 'Produtos',
                            component: () => import('@/components/Management/entries/Product.vue')
                        },
                        {
                            path: 'service',
                            name: 'Serviços',
                            component: () => import('@/components/Management/entries/Service.vue')
                        },
                        {
                            path: 'professional',
                            name: 'Profissionais',
                            component: () => import('@/components/Management/entries/Professional.vue')
                        },
                        {
                            path: 'coupon',
                            name: 'Cupons',
                            component: () => import('@/components/Management/entries/Coupon.vue')
                        },
                        {
                            path: 'delivery',
                            name: 'Áreas de Entrega',
                            component: () => import('@/components/Management/entries/Delivery.vue')
                        },
                        {
                            path: 'user',
                            name: 'Usuários do sistema',
                            component: () => import('@/components/Management/entries/User.vue')
                        },
                        {
                            path: 'system',
                            name: 'Configurações do Sistema',
                            component: () => import('@/components/Management/Cogs.vue')
                        },
                        {
                            path: 'notification',
                            name: 'Notificação',
                            component: () => import('@/components/Management/Notification.vue')
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/components/Login.vue')
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@/components/Logout.vue')
        },
        {
            path: '*',
            redirect: '/login',
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    if (to.name === 'logout')
        next()
    else
        // if (to.name !== "login" && !store.getters.loggedIn)
        //     next({ name: "login" })
        // else {
            if (store.getters.loggedIn && !store.getters.configured) {
                store.commit('setCompany', (
                    await store.dispatch('getCompany', store.getters.user.company_id)
                ).data);

                await store.dispatch('configSystem')
            }

            next()
        // }
})

export default router;