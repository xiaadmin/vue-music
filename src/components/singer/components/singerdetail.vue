<template>
  <transition name="slider">
    <!-- <music-list @selectMusic="selectMusic" :song="song" :title="this.singer.name" :bgimg="this.singer.avatar"></music-list> -->
    <music-list :song="song" :title="this.singer.name" :bgimg="this.singer.avatar"></music-list>
  </transition>
</template>

<script>
import MusicList from './musicList'
import {getSingerDetail} from 'api/singer'
import {createSong} from 'common/js/song'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
export default {
  name: 'SingerDetail',
  data: function () {
    return {
      song: [],
      vkey: ''
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created: function () {
    this._getSingerDetail(this.singer.id)
  },
  methods: {
    // 传递的selectMusic事件
    /* selectMusic: function (item) {
      // 由于是异步加载  this._getSongVkey()还没执行完，getSongUrl()开始执行，此时vkey=undefind
      // 当然此处也可以用 vue的nextTick(() => {}).....
      // this.vkey = this._getSongVkey(this.songFullInfo[this.currentIndex].musicData.songmid)
      // const url = getSongUrl(this.vkey, this.song[this.currentIndex].mid)
      // this.SET_CURRENT_URL(url)
      // this._getSongVkey(this.songFullInfo[this.currentIndex].musicData.songmid)
      // this._getSongVkey(this.song[this.currentIndex].mid)
      // console.log(this.song)
      // console.log(item)
      this._getSongVkey(item.mid)
    }, */
    // 获取歌手详细信息
    _getSingerDetail: function (singerID) {
      // 如果不存在歌手ID 返回到歌手列表
      if (!singerID) {
        this.$router.push('/singer')
        return
      }
      // 歌手详细信息
      getSingerDetail(singerID).then((res) => {
        if (res.code === ERR_OK) {
          // this.songFullInfo = res.data.list
          // 将歌曲列表赋值给this.song
          this.song = this._normalizeSong(res.data.list)
          // console.log(this.song)
        }
      })
    },
    // 对歌曲信息进行封装 筛选有用的信息
    _normalizeSong: function (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          // this._getSongVkey(musicData.songmid)
          // console.log(createSong(musicData))
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
  .slider-enter-active
    transition: all 0.3s
  .slider-leave-active
    transition: all 0.3s
  .slider-enter
    transform: translate3d(100%, 0, 0)
  .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
