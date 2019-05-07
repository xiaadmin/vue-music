import {commenParams} from './config'
import axios from 'axios'

// 获取排行榜单
export function getTopList () {
  const url = '/api/getTopList'
  const data = Object.assign({}, commenParams, {
    '_': '1556195229904',
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取排行榜单音乐列表

export function getTopMusicList (topId) {
  const url = '/api/getTopMusicList'
  const data = Object.assign({}, commenParams, {
    '_': 'getUCGI7047995226621737',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    /* data: `{"detail":{"module":"musicToplist.ToplistInfoServer","method":"GetDetail","param":{"topId":${topId},"offset":0,"num":50,"period":"2019-04-26"}},"comm":{"ct":24,"cv":0}}` */
    data: `{"detail":{"module":"musicToplist.ToplistInfoServer","method":"GetDetail","param":{"topId":${topId},"offset":0,"num":50}},"comm":{"ct":24,"cv":0}}`
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
