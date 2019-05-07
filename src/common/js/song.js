export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    // this.url = url
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${musicData.vkey}&uin=0&fromtag=66`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=263427534&fromtag=66`
    // url: `http://222.24.93.2/cache/11/05/amobile.music.tc.qq.com/9d016db714c859e25d6eedfbde56d730/C400000fVqPH1RjwS3.m4a?guid=1948470050&${vkey}&uin=0&fromtag=66`
  })
}

export function createTopSong (datalist) {
  return new Song({
    id: datalist.ksong.id,
    mid: datalist.mid,
    singer: filterSinger(datalist.singer),
    name: datalist.name,
    album: datalist.album.name,
    duration: datalist.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${datalist.album.mid}.jpg?max_age=2592000`
  })
}

export function getSongUrl (vkey) {
  const url = `http://dl.stream.qqmusic.qq.com/${vkey}`
  // const url = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${vkey}&guid=504753841&uin=0&fromtag=66`
  // const url = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?guid=1948470050&vkey=${vkey}&uin=0&fromtag=66`
  // const url = `http://222.24.93.2/cache/11/05/amobile.music.tc.qq.com/9d016db714c859e25d6eedfbde56d730/C400${songmid}.m4a?guid=1948470050&vkey=${vkey}&uin=0&fromtag=66`
  return url
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
