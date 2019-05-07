<template>
  <div class="musiclist">
    <div class="back" @click="back">
        <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="backgroundimg" ref="backgroundimg">
      <div class="wrapper-play" ref="wrapperplay" v-show="song.length > 0">
        <div class="play" @click="randomPlayAll">
          <i class="icon-play"></i>
          <span class="play-text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer" v-show="song"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="song" ref="scroll" class="list">
      <div class="song-list-wrapper">
        <list @select="selectItem" :songs="song" :rank="rank"></list>
      </div>
      <div class="loading-container" v-show="!this.song.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import List from 'base/list/list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getSongVkey} from 'api/song'
import {getSongUrl} from 'common/js/song'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {playlistMixin} from 'common/js/mixin'
import {mapActions, mapGetters, mapMutations} from 'vuex'
const HEADER_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  name: 'MusicList',
  components: {
    List,
    Scroll,
    Loading
  },
  data: function () {
    return {
      scrollY: 0,
      vkey: '',
      index: 0
    }
  },
  props: {
    song: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    bgimg: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // musiclist的背景图片
    backgroundimg: function () {
      return `background-image: url(${this.bgimg})`
    },
    ...mapGetters([
      'sequencelist',
      'currentIndex',
      'playlist'
    ])
  },
  methods: {
    handlePlaylist: function (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 随机播放全部
    randomPlayAll: function () {
      const index = Math.floor(Math.random() * (this.song.length + 1))
      this.setPlayMode(playMode.random)
      this.selectPlay({
        list: this.song,
        index: index
      })
      this._getSongVkey(this.song[index].mid)
    },
    /* 此处获取播放源地址，播放源地址需要拼接vkey 和 songmid 此处获取vkey */
    _getSongVkey: function (songmid) {
      getSongVkey(songmid).then((res) => {
        this.vkey = res.req_0.data.midurlinfo[0].purl
        if (this.vkey === '') {
          this.SET_CURRENT_URL('')
        }
      })
    },
    // 获取Y轴的滚动距离
    scroll: function (pos) {
      this.scrollY = pos.y
    },
    // 返回事件
    back: function () {
      this.$router.back()
    },
    // 点击歌曲列表的歌曲事件 传递当前歌曲列表和当前歌曲的index
    selectItem: function (item, index) {
      this.index = index
      this._getSongVkey(item.mid)
      // 改变vuex的信息
      this.selectPlay({
        list: this.song,
        index: index
      })
      // this.$emit('selectMusic', item)
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      SET_CURRENT_URL: 'SET_CURRENT_URL'
    })
  },
  mounted: function () {
    // 获取背景图片的高度
    this.imageHeight = this.$refs.backgroundimg.clientHeight
    this.maxtranslateY = -this.imageHeight + HEADER_HEIGHT
    // 歌曲列表的top值为背景图片的高度
    this.$refs.scroll.$el.style.top = `${this.imageHeight}px`
  },
  created: function () {
    // 实时监听
    this.probeType = 3
    // 监听屏幕滚动
    this.listenScroll = true
  },
  watch: {
    // 监听vkey的变化 当其变化时 重新获取url
    // 之前获取的时vkey 现在直接获取purl(vkey和所需参数拼接后的url后缀)
    vkey: function () {
      // const url = getSongUrl(this.vkey, this.song[this.currentIndex].mid)
      const url = getSongUrl(this.vkey)
      this.SET_CURRENT_URL(url)
      console.log(url)
    },
    // 监听滚动距离scrollY
    scrollY: function (newY) {
      let translateY = Math.max(this.maxtranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      let precent = Math.abs(newY / this.imageHeight)
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      // this.$refs.layer.style[`webkitTransform`] = `translate3d(0, ${translateY}px, 0)`
      if (newY > 0) {
        scale = 1 + precent
        zIndex = 10
      } else {
        blur = Math.min(precent * 20, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.maxtranslateY) {
        zIndex = 10
        this.$refs.backgroundimg.style.paddingTop = 0
        this.$refs.backgroundimg.style.height = `${HEADER_HEIGHT}px`
        this.$refs.wrapperplay.style.display = 'none'
      } else {
        this.$refs.backgroundimg.style.paddingTop = '70%'
        this.$refs.backgroundimg.style.height = 0
        this.$refs.wrapperplay.style.display = ''
      }
      this.$refs.backgroundimg.style[transform] = `scale(${scale})`
      // this.$refs.backgroundimg.style['webkitTransform'] = `scale(${scale})`
      this.$refs.backgroundimg.style.zIndex = zIndex
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .musiclist
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      width: 100%
      line-height: 40px
      text-align: center
      z-index: 40
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .wrapper-play
        position: absolute
        bottom: 20px
        width: 100%
        z-index: 50
        .play
          box-sizing: border-box
          width: 135px
          margin: 0 auto
          padding: 7px 0
          text-align: center
          border: 1px solid $color-theme
          border-radius: 100px
          color: $color-theme
          font-size: 12px
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
            .play-text
              display: inline-block
              vertical-align: middle
              font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      width: 100%
      height: 100%
      background: $color-background
    .list
      position: fixed
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
