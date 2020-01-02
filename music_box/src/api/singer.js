import jsonp from 'common/js/jsonp'
import {CommonParams, options} from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, CommonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 2001751543,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, CommonParams, {
    hostUin: 0,
    singermid: singerId,
    num: 100,
    needNewCode: 0,
    order: 'listen',
    platform: 'yqq',
    begin: 0,
    g_tk: 2001751543,
    songstatus: 1
  })
  return jsonp(url, data, options)
}