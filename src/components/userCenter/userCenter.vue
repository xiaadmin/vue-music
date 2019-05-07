<template>
  <transition name="user">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentSIndex="currentSIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentSIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <list :songs="favoriteList" @select="selectItem"></list>
          </div>
        </scroll>
        <scroll ref="latelyList" class="list-scroll" v-if="currentSIndex === 1" :data="playHistory">
          <div class="list-inner">
            <list :songs="playHistory" @select="selectItem"></list>
          </div>
        </scroll>
      </div>
      <div class="no-result" v-show="noResult">
      <span>{{noResultDesc}}</span>
    </div>
    </div>
  </transition>
</template>

<script>
import {getSongVkey} from 'api/song'
import {getSongUrl} from 'common/js/song'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import List from 'base/list/list'
import Song from 'common/js/songclass'
import {playMode} from 'common/js/config'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  name: 'userCenter',
  components: {
    Switches,
    Scroll,
    List
  },
  props: {
  },
  data: function () {
    return {
      currentSIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ],
      vkey: ''
    }
  },
  computed: {
    // 列表中没有歌曲时
    noResult: function () {
      if (this.currentSIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    // 没有歌曲展示的内容
    noResultDesc: function () {
      if (this.currentSIndex === 0) {
        return '暂无收藏的歌曲'
      } else {
        return '暂无最近播放的歌曲'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory',
      'playlist'
    ])
  },
  methods: {
    // playlistMixin中方法 当歌曲正在播放时， 列表底部向上缩60px
    handlePlaylist: function (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      // 上面使用v-if  组件可能不存在 所以判断this.$refs.favoriteList是否存在
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.latelyList && this.$refs.latelyList.refresh()
    },
    // 点击返回
    back: function () {
      this.$router.back()
    },
    // 点击switches事件
    switchItem: function (index) {
      this.currentSIndex = index
    },
    // 选择歌曲
    selectItem: function (item, index) {
      // 将歌曲插入播放队列
      this.insertSong(new Song(item))
      this._getSongVkey(item.mid)
    },
    // 获取歌曲vkey
    _getSongVkey: function (songmid) {
      getSongVkey(songmid).then((res) => {
        this.vkey = res.req_0.data.midurlinfo[0].purl
      })
    },
    // 随机播放全部
    random: function () {
      let list = this.currentSIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      // list 非实例  实例化一下  （此处不加也可以）
      list = list.map((item) => {
        return new Song(item)
      })
      const index = Math.floor(Math.random() * (list.length + 1))
      this.setPlayMode(playMode.random)
      this.selectPlay({
        list: list,
        index: index
      })
      this._getSongVkey(list[index].mid)
    },
    ...mapMutations({
      SET_CURRENT_URL: 'SET_CURRENT_URL',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions([
      'insertSong',
      'selectPlay'
    ])
  },
  watch: {
    vkey: function () {
      const url = getSongUrl(this.vkey)
      this.SET_CURRENT_URL(url)
      console.log(url)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .user-center
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 101
    background: $color-background
    &.user-enter-active, &.user-leave-active
      transition: all 0.3s
    &.user-enter, &.user-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inner-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result
      position: fixed
      width: 100%
      height: 100px
      top: 50%
      line-height: 100px
      text-align: center
</style>
