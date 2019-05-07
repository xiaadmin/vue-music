<template>
  <div>
    <transition name="slider">
      <music-list :rank="rank" :song="songs" :title="title" :bgimg="bgImage"></music-list>
    </transition>
  </div>
</template>

<script>
import MusicList from '@/components/singer/components/musicList'
import {mapGetters} from 'vuex'
import {getTopMusicList} from 'api/rank'
import {createTopSong} from 'common/js/song'
export default {
  name: 'RankList',
  data: function () {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  computed: {
    title: function () {
      return this.toplist.topTitle
    },
    bgImage: function () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'toplist'
    ])
  },
  created: function () {
    this._getTopMusicList()
  },
  methods: {
    _getTopMusicList: function () {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getTopMusicList(this.toplist.id).then((res) => {
        this.songs = this._normalizeSong(res.detail.data.songInfoList)
      })
    },
    _normalizeSong: function (list) {
      let ret = []
      list.forEach((item) => {
        ret.push(createTopSong(item))
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
