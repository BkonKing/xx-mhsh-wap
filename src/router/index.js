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
  },
  {
    path: '/upload',
    name: 'upload',
    component: () =>
      import(
        /* webpackChunkName: 'upload' */
        '@/views/upload.vue'
      )
  },
  {
    path: '/filmDetails',
    name: 'filmDetails',
    component: () =>
      import(
        /* webpackChunkName: 'filmDetails' */
        '@/views/filmDetails.vue'
      )
  },
  {
    path: '/cinemaDetails',
    name: 'cinemaDetails',
    component: () =>
      import(
        /* webpackChunkName: 'cinemaDetails' */
        '@/views/cinemaDetails.vue'
      )
  },
  {
    path: '/taskDetail',
    name: 'taskDetail',
    component: () =>
      import(
        /* webpackChunkName: 'taskDetail' */
        '@/views/task-detail.vue'
      )
  },
  {
    path: '/fiveCenter',
    name: 'fiveCenter',
    component: () =>
      import(
        /* webpackChunkName: 'fiveCenter' */
        '@/views/fiveCenter.vue'
      )
  }

]

const router = new VueRouter({
  routes
})

export default router
