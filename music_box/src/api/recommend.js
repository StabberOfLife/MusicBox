import jsonp from 'common/js/jsonp'
import {CommonParams, options} from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, CommonParams, {
    g_tk: 1980310436,
    platform: 'h5',
    uin: 916349751,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}