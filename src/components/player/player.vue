<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="full" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="full-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="songname" v-html="currentSong.name"></h1>
          <h2 class="singername" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-left" ref="middleLeft">
            <div class="cd-wrapper" ref="cdwrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-right" ref="lyriclist" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricline" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-left">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :precent="precent" @changeCurrentTime="changeCurrentTime" @changePrecnet="changePrecnet"></progress-bar>
            </div>
            <span class="time time-right">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i @click="changeMode" :class="iconMode"></i>
            </div>
            <div class="icon icon-left" :class="disableClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon icon-center" :class="disableClass">
              <i @click="isPlay" :class="playIcon"></i>
            </div>
            <div class="icon icon-right" :class="disableClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon icon-right">
              <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="min">
      <div @click="fullscreen" class="min-player" v-show="!fullScreen">
        <div class="icon" :class="cdClass">
          <img :src="currentSong.image" class="singer-img">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :precent="precent">
            <i @click.stop="isPlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <copy-right ref="copyright"></copy-right>
    <audio ref="audios" :src="currentUrl" @canplay="ready" @error="error" @timeupdate="timeUpdate" @ended="end"></audio>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progressBar/progressBar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {getSongVkey, getSongLyric} from 'api/song'
import {getSongUrl} from 'common/js/song'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {randomList} from 'common/js/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {ERR_OK} from 'api/config'
import DealLyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import PlayList from '../playlist/playlist'
import CopyRight from 'base/copyright/copyRight'
const transform = prefixStyle('transform')
const transition = prefixStyle('transition')
export default {
  name: 'Player',
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList,
    CopyRight
  },
  data () {
    return {
      vkey: '',
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  created: function () {
    this.touch = {}
  },
  computed: {
    // 计算进度百分比
    precent: function () {
      return this.currentTime / this.currentSong.duration
    },
    // 歌曲未加载好时， 底部按钮颜色变淡
    disableClass: function () {
      return this.songReady ? '' : 'disable'
    },
    // CD的class 改变class(CD是否旋转)
    cdClass: function () {
      return this.playing && this.songReady ? 'play' : 'play pause'
    },
    // 播放状态的class
    iconMode: function () {
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
    },
    // 播放按钮的class
    playIcon: function () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // mini播放按钮的class
    miniIcon: function () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'currentUrl',
      'playing',
      'mode',
      'currentIndex',
      'sequencelist',
      'favoriteList'
    ])
  },
  methods: {
    showPlaylist: function () {
      this.$refs.playlist.show()
    },
    middleTouchStart: function (e) {
      this.touch.init = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove: function (e) {
      if (!this.touch.init) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.precent = Math.abs(offsetWidth / window.innerWidth)
      // lyriclist为vue的组件 所以需要加$el
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyriclist.$el.style[transition] = `all 0`
      this.$refs.middleLeft.style.opacity = (1 - this.touch.precent)
      this.$refs.middleLeft.style[transition] = `all 0`
    },
    middleTouchEnd: function () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.precent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.precent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyriclist.$el.style[transition] = `all 0.3s`
      this.$refs.middleLeft.style.opacity = opacity
      this.$refs.middleLeft.style[transition] = `all 0`
    },
    // 更改最喜欢状态
    toggleFavorite: function (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteSong(song)
      } else {
        this.saveFavoriteSong(song)
      }
    },
    // 根据当前歌曲改变最喜欢状态图标
    getFavoriteIcon: function (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    // 当前歌曲是不是最喜欢的歌曲
    isFavorite: function (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    // 改变当前时间      ?? 但是拖动时也会听见歌曲声音？？
    changeCurrentTime: function (precent) {
      this.currentTime = (precent * this.currentSong.duration)
    },
    // 当进度改变（快进 点击）时执行的函数
    changePrecnet: function (precent) {
      let currentTime = (precent * this.currentSong.duration)
      this.$refs.audios.currentTime = currentTime
      if (!this.playing) {
        this.setPlayingState(!this.playing)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // audio 的timeupdate事件
    timeUpdate: function (e) {
      this.currentTime = e.target.currentTime
    },
    // 格式化时间格式
    format: function (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 不足两位的时间前面补0
    _pad: function (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = `0` + num
        len++
      }
      return num
    },
    end: function () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop: function () {
      this.$refs.audios.currentTime = 0
      this.$refs.audios.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 切换上一首歌曲
    prev: function () {
      // 歌曲是否加载好 为加载好不能点击
      if (!this.songReady) {
        return
      }
      this.songReady = false
      // 当切换上一首歌曲时 先停止播放当前歌曲
      this.$refs.audios.pause()
      // 播放列表只有一首歌曲时 currentUrl将不会发生变化 歌曲将不会播放 所以就调用loop()
      if (this.playlist === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
        // 设置当前播放列表的currentIndex
        this.setCurrentIndex(index)
        // 获取当前播放歌曲的vkey
        getSongVkey(this.playlist[index].mid).then((res) => {
          this.vkey = res.req_0.data.midurlinfo[0].purl
        })
      }
    },
    // 切换下一首歌曲
    next: function () {
      // 歌曲是否加载好 为加载好不能点击
      if (!this.songReady) {
        return
      }
      this.songReady = false
      // 当切换下一首歌曲时 先停止播放当前歌曲
      this.$refs.audios.pause()
      if (this.playlist === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        // 设置当前播放列表的currentIndex
        this.setCurrentIndex(index)
        // 获取当前播放歌曲的vkey
        getSongVkey(this.playlist[index].mid).then((res) => {
          this.vkey = res.req_0.data.midurlinfo[0].purl
        })
      }
    },
    // 监听audio是否加载好歌曲
    ready: function () {
      // this.$refs.audios.play()
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // audio出错时
    error: function () {
      this.songReady = true
    },
    // 改变播放状态(循环播放, 单曲循环, 随机播放)
    changeMode: function () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = randomList(this.sequencelist)
      } else {
        list = this.sequencelist
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 查找 并重置当前currentIndex
    resetCurrentIndex: function (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 当前是否播放 并改变playing
    isPlay: function () {
      // ios设备将不能点击播放按钮
      /* if (!this.songReady) {
        return
      } */
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 返回按钮, 取消全屏播放
    back: function () {
      this.setFullScreen(false)
    },
    // 全屏播放
    fullscreen: function () {
      this.setFullScreen(true)
    },
    // 从mini状态切换为fullScreen状态CD的动画事件
    enter: function (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(-${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0 , 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 600,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdwrapper, 'move', done)
    },
    // 动画结束后 移除动画
    afterEnter: function () {
      animations.unregisterAnimation('move')
      this.$refs.cdwrapper.style.animation = ''
    },
    // 从fullScreen状态切换为mini状态CD的动画事件
    leave: function (el, done) {
      this.$refs.cdwrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdwrapper.style[transform] = `translate3d(-${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdwrapper.addEventListener('transitionend', done)
    },
    // 动画结束后 移除动画
    afterLeave: function () {
      this.$refs.cdwrapper.style.transform = ''
      this.$refs.cdwrapper.style[transform] = ''
    },
    // 获取歌曲歌词
    _getSongLyric: function () {
      getSongLyric(this.currentSong.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.currentLyric = new DealLyric(this.decode(res.lyric), this.handleLyric)
          if (this.playing && this.songReady) {
            this.currentLyric.play()
          }
        }
      }).catch(() => {
        // 当没有拿到歌词时 重置相关参数
        this.currentLyric = null
        this.currentLineNum = 0
        this.playingLyric = ''
      })
    },
    // DealLyric回调函数
    handleLyric: function ({lineNum, txt}) {
      this.playingLyric = txt
      this.currentLineNum = lineNum
      // 行数大于5自动显示下一行，保证当前所唱歌词在最中间
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricline[lineNum - 5]
        this.$refs.lyriclist.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyriclist.scrollTo(0, 0, 1000)
      }
    },
    // 歌词base64解码及Unicode问题
    decode: function (str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    },
    // 获取CD动画所需的位置和缩放参数
    _getPosAndScale: function () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const width = window.innerWidth * 0.8
      const paddingTop = 80 + (width / 2)
      const scale = targetWidth / width
      const x = (window.innerWidth / 2) - paddingLeft
      const y = (window.innerHeight) - paddingTop - paddingBottom
      return {x, y, scale}
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      SET_CURRENT_URL: 'SET_CURRENT_URL',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  },
  watch: {
    // 监听vkey的变化 当其变化时 重新获取url
    vkey: function () {
      // const url = getSongUrl(this.vkey, this.playlist[this.currentIndex].mid)
      const url = getSongUrl(this.vkey)
      this.SET_CURRENT_URL(url)
      if (!this.playing) {
        this.setPlayingState(true)
      }
      console.log(url)
    },
    // 监听当前currentUrl的变化 并自动播放
    currentUrl: function () {
      // console.log(this.playlist)
      console.log(this.currentUrl)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // 微信端后台后 不能执行js代码 出现的问题？？？？？
      /* clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audios.play()
        this._getSongLyric()
      }, 1000) */
      this.$nextTick(() => {
        this.$refs.audios.play()
        this._getSongLyric()
      })
    },
    // 当改变playing后 执行的播放事件
    playing: function (newPlaying) {
      const audios = this.$refs.audios
      this.$nextTick(() => {
        newPlaying ? audios.play() : audios.pause()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
  .player
    .full-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.full-enter-active, &.full-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.full-enter, &.full-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
        img
          width: 100%
          height: 100%
      .top
        position: relative
        width: 100%
        marign-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .songname
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          font-size: $font-size-large
          color: $color-text
          no-wrap()
        .singername
          width: 70%
          margin: 0 auto
          line-height: 20px
          text-align:center
          font-size: $font-size-medium
          color: $color-text
          no-wrap()
      .middle
        position: fixed
        top: 80px
        bottom: 170px
        width: 100%
        white-space: nowrap
        font-size: 0
        .middle-left
          position: relative
          display: inline-block
          vertical-align: top
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 10px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-right
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        width: 100%
        bottom: 50px
        .dot-wrapper
          text-align:center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-left
              text-align: left
            &.time-right
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .icon-left
            text-align: right
          .icon-center
            text-align: center
            padding: 0 20px
            i
              font-size: 40px
          .icon-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .min-player
      position: fixed
      align-items: center
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 60px
      z-index: 180
      background: $color-highlight-background
      &.min-enter-active, &.min-leave-active
        transition: all 0.4s
      &.min-enter, &.min-leave-to
        opacity: 0
      .icon
        float: left
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 10px 10px 10px 20px
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
        .singer-img
          width: 40px
          height: 40px
          border-radius: 50%
      .text
        float: left
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        padding: 10px 0
        line-height: 20px
        overflow: hidden
        .name
          marign-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        float: right
        width: 35px
        height: 100%
        padding: 0 10px
        line-height: 60px
        .icon-mini
          position: absolute
          top: 14px
          left: 0
          width: 32px
          height: 32px
          float: right
          font-size: 32px
          color: $color-theme-d
        .icon-playlist
          width: 40px
          height: 40px
          float: right
          line-height: 60px
          font-size: 30px
          color: $color-theme-d
</style>
