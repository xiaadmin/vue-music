import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequencelist = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_CURRENT_URL] (state, url) {
    // console.log(state.currentIndex)
    // state.currentUrl[state.currentIndex] = url
    state.currentUrl = url
  },
  [types.SET_FAVORITE_LIST] (state, favoriteList) {
    state.favoriteList = favoriteList
  },
  [types.DELETE_FAVORITE_LIST] (state, song) {
    const index = state.favoriteList.findIndex((item) => {
      return item.id === song.id
    })
    if (index > -1) {
      state.favoriteList.splice(index, 1)
    }
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST] (state, toplist) {
    state.toplist = toplist
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  }
}

export default mutations
