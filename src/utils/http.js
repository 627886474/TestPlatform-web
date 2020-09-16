import axios from 'axios'
import hostUrl from '@/config'
import { getToken } from "@/utils/auth";
const MyHttpServer = {}
const whitePath = ['user/login', 'user/register']

MyHttpServer.install = (Vue) => {
  
axios.interceptors.request.use((config) => {
  config.baseURL = hostUrl.DEV_HOST
// // 设置请求头
const AUTH_TOKEN = getToken('vue_admin_template_token')
console.log
whitePath.includes(config.url) || (config.headers = {'Authorization':"JWT "+AUTH_TOKEN,
'Content-Type': 'application/json'
})
return config
})
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer