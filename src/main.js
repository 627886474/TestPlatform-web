import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import VueClipboard from 'vue-clipboard2'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import MyServerHttp from '@/utils/http.js'

import moment from 'moment'

import '@/icons' // icon
import '@/permission' // permission control



/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
Vue.use(MyServerHttp)
Vue.use(VueClipboard)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

//全局过滤器，处理时间
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
