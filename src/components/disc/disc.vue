<template>
  <div>
    <transition name="slider">
      <music-list :song="songs" :title="tittle" :bgimg="bgImage"></music-list>
    </transition>
  </div>
</template>

<script>
import MusicList from '../singer/components/musicList'
import {createSong} from 'common/js/song'
import {getRecDiscSong} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
export default {
  name: 'Disc',
  data: function () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    tittle: function () {
      return this.disc.dissname
    },
    bgImage: function () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created: function () {
    this._getRecDiscSong()
  },
  methods: {
    _getRecDiscSong: function () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getRecDiscSong(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSong: function (songlist) {
      let ret = []
      songlist.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
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
