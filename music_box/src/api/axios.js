import axios from 'axios'

let port = 8080
let host = '://localhost:' + port
let baseUrl = 'http' + host
let axiosConfig = {
  baseUrl,
  timeout: 1000
}
let reqAxios = axios.create(axiosConfig)
export default {
  getAxios: reqAxios
}