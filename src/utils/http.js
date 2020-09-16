import axios from 'axios'
import hostUrl from '@/config'
const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = hostUrl.DEV_HOST
  // // 设置请求头
  const AUTH_TOKEN = localStorage.getItem('token')
  axios.defaults.headers = {'Authorization':"JWT "+AUTH_TOKEN,
  'Content-Type': 'application/json'
}
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer