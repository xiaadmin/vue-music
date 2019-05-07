<template>
  <transition name="playlist">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" @click="changeMode" :class="iconMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="clearList"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequencelist" ref="scroll">
          <!-- 此处transition-group设置的0.3s动画 refresh()只有20ms 可能导致列表滚动计算高度错误 -->
          <transition-group tag="ul" name="list" ref="list">
            <li @click="selectItem(item, index)" class="item" v-for="(item, index) in sequencelist" :key="item.mid">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="addFavorite(item)"><i :class="getFavoriteIcon(item)"></i></span>
              <span class="delete" @click.stop="deleteItem(item, index)"><i class="icon-delete"></i></span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addsonglist">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" title="确认清空列表？" confirm="清空" @confirm="confirmClear"></confirm>
      <add-song-list ref="addsonglist"></add-song-list>
    </div>
  </transition>
</template>

<script>
import {getSongVkey} from 'api/song'
import {getSongUrl} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSongList from '../addSongList/addSongList'
import {playMode} from 'common/js/config'
import {randomList} from 'common/js/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'PlayList',
  components: {
    Scroll,
    Confirm,
    AddSongList
  },
  data () {
    return {
      showFlag: false,
      vkey: ''
    }
  },
  computed: {
    // 点击切换播放模式图标
    iconMode: function () {
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
    },
    // 切换播放模式内容
    modeText: function () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
    },
    ...mapGetters([
      'sequencelist',
      'mode',
      'currentSong',
      'favoriteList',
      'currentIndex',
      'playlist'
    ])
  },
  created: function () {
  },
  methods: {
    // 点击展示addsonglist界面
    addsonglist: function () {
      this.$refs.addsonglist.show()
    },
    // 清空队列事件 弹出comfirm组件
    clearList: function () {
      this.$refs.confirm.show()
    },
    // 确认清空列表
    confirmClear: function () {
      this.clearSongList()
      this.hide()
    },
    // 点击歌曲 切换播放歌曲
    selectItem: function (item, index) {
      this._getSongVkey(item.mid)
      if (this.mode === playMode.random) {
        index = this.sequencelist.forEach((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    // 删除歌曲列表歌曲
    deleteItem: function (item, index) {
      /* if (item.id === this.currentSong.id) {
        console.log(1)
        if (this.currentIndex === this.sequencelist.length - 1) {
          console.log(2)
          this._getSongVkey(this.sequencelist[this.sequencelist.length].mid)
        } else {
          console.log(3)
          this._getSongVkey(this.sequencelist[this.currentIndex + 1].mid)
        }
      } */
      // deleteItem为何会调用两次？？？？  导致删除最后一个歌曲时 currentIndex减了2
      // 删除最后一个会出现上面情况
      if ((item.id === this.currentSong.id) && (this.sequencelist.length > 1)) {
        if (index === (this.sequencelist.length - 1)) {
          this._getSongVkey(this.sequencelist[this.currentIndex - 1].mid)
        } else {
          this._getSongVkey(this.sequencelist[this.currentIndex + 1].mid)
        }
      }
      this.deleteSong(item)
      if (!this.playlist) {
        this.hide()
      }
    },
    // 添加最喜欢的歌曲
    addFavorite: function (item) {
      if (this.isFavorite(item)) {
        this.deleteFavoriteSong(item)
      } else {
        this.saveFavoriteSong(item)
      }
    },
    // 点击更改最喜欢的图标
    getFavoriteIcon: function (item) {
      /* this.favoriteList.forEach((song) => {
        if (song.id === item.id) {
          console.log(1)
          return 'icon-favorite'
        } else {
          console.log(2)
          return 'icon-not-favorite'
        }
      }) */
      if (this.isFavorite(item)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 当前播放歌曲前面图标
    getCurrentIcon: function (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    // 检查歌曲是不是最喜欢的歌曲
    isFavorite: function (item) {
      const index = this.favoriteList.findIndex((song) => {
        return item.id === song.id
      })
      return index > -1
    },
    // 改变播放模式
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
    // 展示playlist组件 并让scroll重新计算高度
    show: function () {
      this.showFlag = true
      setTimeout(() => {
        // 重新计算高度
        this.$refs.scroll.refresh()
        // 滚动到当前播放歌曲
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    // 隐层playlist组件
    hide: function () {
      this.showFlag = false
    },
    // 滚动到当前播放歌曲
    scrollToCurrent: function (item) {
      const index = this.sequencelist.findIndex((song) => {
        return song.id === item.id
      })
      // 调用scroll组件的scrollToElement方法
      this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    // 获取歌曲vkey
    _getSongVkey: function (songmid) {
      getSongVkey(songmid).then((res) => {
        this.vkey = res.req_0.data.midurlinfo[0].purl
      })
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentUrl: 'SET_CURRENT_URL',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'deleteSong',
      'clearSongList',
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  },
  watch: {
    vkey: function () {
      const url = getSongUrl(this.vkey)
      this.setCurrentUrl(url)
      console.log(url)
    },
    currentSong: function (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(this.currentSong)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .playlist
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.playlist-enter-active, &.playlist-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3
    &.playlist-enter, &.playlist-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            marign-right: 20px
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 49px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s linear
          &.list.enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 240px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
