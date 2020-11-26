import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/goodsDetail',
    name: 'goodsDetail',
    component: () =>
      import(
        /* webpackChunkName: 'goodsDetail' */
        '@/views/goods-detail.vue'
      )
  },
  {
    path: '/invite',
    name: 'invite',
    component: () =>
      import(
        /* webpackChunkName: 'invite' */
        '@/views/invite.vue'
      )
  },
  {
    path: '/neighbours',
    name: 'neighbours',
    component: () =>
      import(
        /* webpackChunkName: 'neighbours' */
        '@/views/neighbours.vue'
      )
  }
]

const router = new VueRouter({
  routes
})

export default router
