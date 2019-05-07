import jsonp from 'common/js/jsonp'
/* 获取基础参数 */
import {commenParams, options} from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commenParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    g_tk: 5381,
    loginUin: '0',
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    needNewCode: 0
  })
  /* 上面的如果少format: 'json' 获取不到数据  将会出现304错误 */
  return jsonp(url, data, options)
}

export function getSingerDetail (singerID) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commenParams, {
    g_tk: 2140052619,
    loginUin: 528964214,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerID,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })
  return jsonp(url, data, options)
}
