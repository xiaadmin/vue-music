<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-warpper">
        <search-box ref="searchBox" @query="changeQuery" placeholder="搜索歌曲添加至列表"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switch="switchItem" :currentSIndex="currentSIndex" :switches="switches"></switches>
        <div class="list-wrapper">
          <scroll ref="latelyPlay" v-if="currentSIndex === 0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <list :songs="playHistory" @select="selectItem"></list>
            </div>
          </scroll>
          <scroll ref="searchList" v-if="currentSIndex === 1" class="list-scroll">
            <div class="list-inner">
              <search-list @selectItem="addQuery" @deleteOne="deleteOne" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" ref="searchResult" v-show="query">
        <suggest ref="suggest" :query="query" @select="saveSong" @startScroll="startScroll"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import {getSongVkey} from 'api/song'
import {getSongUrl} from 'common/js/song'
import SearchBox from 'base/searchBox/searchBox'
import Suggest from '../suggest/suggest'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/searchList/searchList'
import TopTip from 'base/topTip/topTip'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import List from 'base/list/list'
import Song from 'common/js/songclass'
export default {
  name: 'addSongList',
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    List,
    SearchList,
    TopTip
  },
  data () {
    return {
      showFlag: false,
      query: '',
      currentSIndex: 0,
      vkey: '',
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  methods: {
    // 点击歌曲事件
    selectItem: function (item, index) {
      // 当第一个的时候 不插入至playlist
      if (index !== 0) {
        this.insertSong(new Song(item))
      }
      this._getSongVkey(item.mid)
      this.$refs.topTip.show()
    },
    // 点击switches 更改currentSIndex
    switchItem: function (index) {
      this.currentSIndex = index
    },
    // 删除一条搜索历史
    deleteOne: function (item) {
      this.deleteSearchHistory(item)
    },
    // 展示addSongList组件 并调用scroll的refresh()方法重新计算高度
    show: function () {
      this.showFlag = true
      // dom渲染需要17ms延时，所以此处加延时
      setTimeout(() => {
        if (this.currentSIndex === 0) {
          this.$refs.latelyPlay.refresh()
        }
      }, 20)
    },
    // 隐藏组件
    hide: function () {
      this.showFlag = false
    },
    // 改变输入框内容
    changeQuery: function (query) {
      this.query = query
    },
    // 点击搜索历史内歌曲， 添加至searchBox搜索框中
    addQuery: function (item) {
      this.$refs.searchBox.addQuery(item)
    },
    // 点击搜索结果中的歌曲 存储歌曲到历史播放中， 并插入歌曲到播放队列中，并播放此歌曲
    saveSong: function (item) {
      if (item.type) {
        this.saveSearchHistory(item.singername)
      } else {
        this.saveSearchHistory(item.name)
      }
      this.insertSong(new Song(item))
      this._getSongVkey(item.mid)
    },
    // 开始滚动时,输入框失去焦点, 手机端输入将会隐藏
    startScroll: function () {
      this.$refs.searchBox.blur()
    },
    _getSongVkey: function (songmid) {
      getSongVkey(songmid).then((res) => {
        this.vkey = res.req_0.data.midurlinfo[0].purl
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'insertSong',
      'deleteSearchHistory'
    ]),
    ...mapMutations({
      SET_CURRENT_URL: 'SET_CURRENT_URL'
    })
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
  .add-song
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 201
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-warpper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
