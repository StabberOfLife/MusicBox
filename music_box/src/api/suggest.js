import {CommonParams} from './config'
import Axios from 'axios'

export function getSuggest (findOut, page, zhida, perpage) {
  const url = 'api/suggest'
  const data = Object.assign({}, CommonParams, {
    // ct: 24,
    // qqmusic_ver: 1298,
    // new_json: 1,
    // remoteplace: 'txt.yqq.center',
    // t: 0,
    // aggr: 1,
    // cr: 1,
    // lossless: 0,
    // flag_qc: 0,
    // n: 10,
    // g_tk: 995635498,
    // loginUin: 0,
    // hostUin: 0,
    // platform: 'yqq',
    // w: findOut,
    // p: page,
    // catZhida: zhida ? 1 : 0,
    // needNewCode: 0
    w: findOut,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}