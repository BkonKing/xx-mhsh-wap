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
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () =>
      import(
        /* webpackChunkName: 'questionnaire' */
        '@/views/questionnaire.vue'
      )
  },
  // 邀请活动分享链接页面
  {
    path: '/invite/link',
    name: 'inviteLink',
    component: () =>
      import(
        /* webpackChunkName: 'inviteLink' */
        '@/views/invite-link.vue'
      )
  },
  // 免费服务
  {
    path: '/butler/freeServer',
    name: 'freeServer',
    component: () =>
      import(
        /* webpackChunkName: 'freeServer' */
        '@/views/freeServer.vue'
      )
  },
  // 海丝活动
  {
    path: '/20220115activity',
    name: '20220115activity',
    component: () =>
      import(
        /* webpackChunkName: '20220115activity' */
        '@/views/20220115.vue'
      )
  }
]

const router = new VueRouter({
  routes
})

export default router
