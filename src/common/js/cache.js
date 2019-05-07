import storage from 'good-storage'

const SEARCH_KEY = '__SONG__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__PLAY__'
const PLAY_MAX_LEN = 100

const FAVORITE_KEY = '__FAVOIRITE__'
const FAVORITE_MAX_LEN = 100

// ????对象的比较 findIndex不能比较对象 [{},{}]这样的数组也不行
// obj1 === obj2 这样不能比较对象 这里比较的是他的地址， 所以就算obj1的内容等于obj2， 地址不同则为false
function insertArray (arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function deleteOneFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
  console.log(arr)
}

// 存储搜索历史到缓存中
export function saveSearch (query) {
  let searchs = storage.get(SEARCH_KEY, [])
  insertArray(searchs, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

// 删除搜索历史
export function deleteSearch (query) {
  let searchs = storage.get(SEARCH_KEY, [])
  deleteOneFromArray(searchs, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 初始化搜索历史 searchHistory
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteOneFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
