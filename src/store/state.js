import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequencelist: [],
  mode: playMode.sequence,
  currentIndex: -1,
  currentUrl: '',
  // currentUrl: [],
  favoriteList: loadFavorite(),
  disc: {},
  toplist: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay()
}
export default state
