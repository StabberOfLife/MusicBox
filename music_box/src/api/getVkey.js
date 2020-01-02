import {CommonParams} from './config'
import Axios from 'axios'

export function getSongVkey (mid) {
  const url = 'api/song'
  const data = Object.assign({}, CommonParams, {
    hostUin: 0,
    loginUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    guid: 6276481120,
    songmid: mid,
    filename: `C400${mid}.m4a`
  })
  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}