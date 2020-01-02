import axios from 'axios'
export default {
  login: (data) => {
    return axios.post('/login', data)
  }
}