import jsonp from 'common/js/jsonp'
import {CommonParams, options} from './config'
export function getSearchKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, CommonParams, {
    g_tk: 995635498,
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}