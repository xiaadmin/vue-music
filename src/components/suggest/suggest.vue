<template>
  <scroll class="suggest" ref="suggest" :beforeScroll="beforeScroll" :data="result" :pullup="pullup" @beforeScroll="startScroll" @scrollToEnd="searchMore">
    <ul class="suggest-list" v-show="query">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="changeIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore && query"></loading>
    </ul>
    <div class="no-result" v-show="!result.length && !hasMore && query">
      <span>抱歉，没有找到搜索结果</span>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {createSong} from 'common/js/song'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  name: 'searchBox',
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      vkey: '',
      beforeScroll: true
    }
  },
  components: {
    Scroll,
    Loading
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 刷新滚动
    refresh: function () {
      this.$refs.suggest.refresh()
    },
    // 传递开始滚动事件
    startScroll: function () {
      this.$emit('startScroll')
    },
    // 判断是歌手还是歌曲 改变相应的class
    changeIconCls: function (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    // 判断是歌手还是歌曲 改变其显示内容
    getDisplayName: function (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    // 下拉到底部 搜索更多
    searchMore: function () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this.normalData(res.data))
          this.cheakMore(res.data)
        }
      })
    },
    // 检查是否还有歌曲
    cheakMore: function (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    // 搜索歌曲数据
    _search: function () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.normalData(res.data)
          this.cheakMore(res.data)
        }
      })
    },
    // 初始化数据
    normalData: function (data) {
      var ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this.normalSearchList(data.song.list))
      }
      return ret
    },
    // 初始化歌曲列表
    normalSearchList: function (item) {
      var ret = []
      item.forEach((musicData) => {
        if (musicData.albumid && musicData.songid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    // 点击歌手或歌曲
    selectItem: function (item) {
      // 判断点击的是不是歌手
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 二级路由， 跳转到歌手详情列
        this.$router.push({
          path: `/search/${singer.id}`
        })
        // 重置歌手
        this.setSinger(singer)
      } else {
        // 将歌曲插入播放列表
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      SET_CURRENT_URL: 'SET_CURRENT_URL'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  created: function () {
  },
  watch: {
    query: function () {
      this._search()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          font-size: 14px
          color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result
      position: fixed
      width: 100%
      height: 100px
      top: 50%
      line-height: 100px
      text-align: center
</style>
