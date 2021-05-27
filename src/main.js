import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/base.css'
import './styles/common.less'
import 'amfe-flexible'
import './styles/iconfont.css'

Vue.config.ignoredElements = ['wx-open-launch-app']

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
