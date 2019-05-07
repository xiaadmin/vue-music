<template>
  <div class="search">
    <div class="search-box-warpper">
      <search-box ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcutData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotSong" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="this.searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="clearAllSearch">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @selectItem="addQuery" @deleteOne="deleteOne" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult">
      <suggest ref="suggest" :query="query" @select="saveSong" @startScroll="startScroll"></suggest>
    </div>
    <confirm @confirm="removeAll" ref="confirm" title="确认要清空搜索历史"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from 'base/searchBox/searchBox'
import Suggest from '../suggest/suggest'
import SearchList from 'base/searchList/searchList'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {getSongVkey} from 'api/song'
import {getSongUrl} from 'common/js/song'
import {getHotSong} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  name: 'Search',
  components: {
    searchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  data () {
    return {
      hotSong: [],
      query: '',
      vkey: ''
    }
  },
  created: function () {
    this._getHotSong()
  },
  computed: {
    shortcutData: function () {
      return this.hotSong.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist: function (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortWrapper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
      this.$refs.shortcut.refresh()
    },
    // 存储歌曲到历史播放中
    saveSong: function (item) {
      if (item.type) {
        this.saveSearchHistory(item.singername)
      } else {
        this.saveSearchHistory(item.name)
      }
      // 获取歌曲vkey
      this._getSongVkey(item.mid)
    },
    // 点击清空所有按钮 显示是否要清空
    clearAllSearch: function () {
      this.$refs.confirm.show()
    },
    // 点击确定按钮后清除所有历史搜索
    removeAll: function () {
      this.clearAllSearchHistory()
    },
    // 开始滚动时,输入框失去焦点, 手机端输入将会隐藏
    startScroll: function () {
      this.$refs.searchBox.blur()
    },
    // 改变输入框内容
    changeQuery: function (query) {
      this.query = query
    },
    // 添加搜索内容
    addQuery: function (item) {
      this.$refs.searchBox.addQuery(item)
    },
    // 删除一条搜索历史
    deleteOne: function (item) {
      this.deleteSearchHistory(item)
    },
    // 获取热门歌曲
    _getHotSong: function () {
      getHotSong().then((res) => {
        if (res.code === ERR_OK) {
          this.hotSong = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // 获取歌曲vkey
    _getSongVkey: function (songmid) {
      getSongVkey(songmid).then((res) => {
        this.vkey = res.req_0.data.midurlinfo[0].purl
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearAllSearchHistory'
    ]),
    ...mapMutations({
      SET_CURRENT_URL: 'SET_CURRENT_URL'
    })
  },
  watch: {
    query: function (newQuery) {
      if (!newQuery) {
        // dom渲染有17毫秒延时
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    },
    // 监听vkey是否改变, 改变并重置currentUrl
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
  .search
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .search-box-warpper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      width: 100%
      bottom: 0
      top: 178px
      z-index: 2
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
      z-index: 1
</style>
