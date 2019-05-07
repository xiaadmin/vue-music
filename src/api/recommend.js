import jsonp from 'common/js/jsonp'
/* 获取基础参数 */
import {commenParams, options} from './config'
import axios from 'axios'
// 获取轮播图数据
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commenParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
// 获取推荐列表数据
export function getDiscList () {
  const url = '/api/getDiscList'
  const data = Object.assign({}, commenParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getRecDiscSong (disstid) {
  const url = '/api/getRecDiscSong'
  const data = Object.assign({}, commenParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    g_tk: '5381',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  // return jsonp(url, data, options)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
