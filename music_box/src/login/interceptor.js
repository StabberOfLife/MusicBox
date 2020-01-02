import axios from 'axios' // axios引用
import qs from 'qs'

axios.defaults.baseURL = 'http://localhost:3000'
// 全局的地址，因为我的koa监听端口是3000， 这里可以按照大家自己的来配置
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'
// 这是配置token
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
// 在发送请求之前做些什么
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
  return response
}, function (error) {
// 对响应错误做点什么
  return Promise.reject(error)
})

export default axios