import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'babel-polyfill'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import fastclick from 'fastclick'
import 'stylus/index.styl'
import 'swiper/dist/css/swiper.css'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  loading: require('common/image/logo.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
