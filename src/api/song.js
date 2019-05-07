// import jsonp from 'common/js/jsonp'
import {commenParams} from './config'
import axios from 'axios'

// 获取歌曲vkey
export function getSongVkey (songmid) {
  const url = '/api/getSongVkey'
  const data = Object.assign({}, commenParams, {
    '-': 'getplaysongvkey952318831037053',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1925450880","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1925450880","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongLyric (songmid) {
  const url = 'api/getSongLyric'
  const data = Object.assign({}, commenParams, {
    '-': 'MusicJsonCallback_lrc',
    // pcachetime: '1555389653148',
    pcachetime: +new Date(),
    songmid: songmid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
