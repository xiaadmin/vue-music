export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequencelist = state => state.sequencelist

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentUrl = state => state.currentUrl

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const favoriteList = state => state.favoriteList

export const disc = state => state.disc

export const toplist = state => state.toplist

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory
