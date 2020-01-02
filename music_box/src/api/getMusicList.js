import axios from 'axios'
import {CommonParams} from './config'

export function getMusicList () {
  const url = 'api/getMusicList'
  const data = Object.assign({}, CommonParams, {
    platform: 'yqq',
    loginUin: 916349751,
    needNewCode: 0,
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    format: 'json',
    categoryId: 10000000,
    notic: 0,
    rnd: Math.random()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}