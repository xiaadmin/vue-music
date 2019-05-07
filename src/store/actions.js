import * as types from './mutation-types'
import {randomList} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 当点击歌曲时 如果是随机播放 则重新生成随机播放列
  if (state.mode === playMode.random) {
    let newRandomList = randomList(list)
    commit(types.SET_PLAY_LIST, newRandomList)
    index = findIndex(newRandomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  // 重置currenIndex
  commit(types.SET_CURRENT_INDEX, index)
  // 重置为全屏
  commit(types.SET_FULL_SCREEN, true)
  // 重置playing 为true
  commit(types.SET_PLAYING_STATE, true)
}

/* export const randomPlay = function ({commit, state}, {list}) {
  // 随机播放模式
  commit(types.SET_PLAY_MODE, playMode.random)
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 生成随机播放列表
  let newRandomList = randomList(list)
  // 重置播放列表
  commit(types.SET_PLAY_LIST, newRandomList)
  // 从随机列表第一个播放
  commit(types.SET_CURRENT_INDEX, 0)
  // 重置为全屏
  commit(types.SET_FULL_SCREEN, true)
  // 重置playing 为true
  commit(types.SET_PLAYING_STATE, true)
} */

// 插入歌曲到播放列表
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]
  // 插入歌曲是否在随机列表中 存在则返回索引
  let fpIndex = findIndex(playlist, song)
  // 当前歌曲索引加1
  currentIndex++
  // 将歌曲插入到当前播放歌曲后面
  playlist.splice(currentIndex, 0, song)
  // 如果歌曲列表中存在插入的歌曲
  if (fpIndex > -1) {
    // 插入的歌曲在当前歌曲前面时
    if (fpIndex < currentIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 当前播放歌曲索引
  let currentSQIndex = findIndex(sequencelist, currentSong)
  // 插入歌曲是否在顺序列表中 存在则返回索引
  let fsIndex = findIndex(sequencelist, song)
  // 当前歌曲索引加1
  currentSQIndex++
  // 将歌曲插入到当前播放歌曲后面
  sequencelist.splice(currentSQIndex, 0, song)
  // 如果歌曲列表中存在插入到歌曲
  if (fsIndex > -1) {
    // 插入的歌曲在当前歌曲前面时
    if (fsIndex < currentSQIndex) {
      sequencelist.splice(fsIndex, 1)
      currentSQIndex--
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // 重置为全屏
  commit(types.SET_FULL_SCREEN, true)
  // 重置playing 为true
  commit(types.SET_PLAYING_STATE, true)
}

// 存储搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清除所有搜索历史
export const clearAllSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 从列表中删除歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  let sIndex = findIndex(sequencelist, song)
  playlist.splice(pIndex, 1)
  sequencelist.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 清空列表
export const clearSongList = function ({commit, state}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 存储播放历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 存储喜欢歌曲
export const saveFavoriteSong = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 删除喜欢歌曲
export const deleteFavoriteSong = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
