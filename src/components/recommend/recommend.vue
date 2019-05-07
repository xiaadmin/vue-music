<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :data="songLists" class="recommend-content">
      <div>
        <swiper :Lists="Lists" :Listslength="Listslength" @loadedimg="loadedimg"></swiper>
        <disc-list @selectItem="selectItem" :songLists="songLists"></disc-list>
        <div class="loading-container" v-show="songLists">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Swiper from './components/swiper'
import DiscList from './components/disclist'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  name: 'Recommend',
  components: {
    Swiper,
    DiscList,
    Scroll,
    Loading
  },
  data: function () {
    return {
      /* 轮播图数据 */
      Lists: [],
      /* 初始化轮播图数组长度为0 */
      Listslength: 0,
      /* 推荐歌单数据 */
      songLists: [],
      /* 是否加载轮播图图片 */
      changeloaded: false
    }
  },
  computed: {
  },
  methods: {
    selectItem: function (item) {
      this.setDisc(item)
    },
    handlePlaylist: function (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    /* 此处_getRecommend函数也不能写为箭头函数 */
    /* 获取轮播图图片数据 */
    _getRecommend: function () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.Lists = res.data.slider
          this.Listslength = this.Lists.length
        }
      })
    },
    /* 获取推荐歌单数据 */
    _getDiscList: function () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.songLists = res.data.list
        }
      })
    },
    loadedimg: function () {
      if (!this.changeloaded) {
        this.$refs.scroll.refresh()
        this.changeloaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  /* created 里不能写为箭头函数 */
  created: function () {
    // 获取轮播图数据
    this._getRecommend()
    // 获取推荐歌单数据
    this._getDiscList()
    /* 模拟网速慢 出现正在加载动画 */
    /* setTimeout(() => {
      this._getDiscList()
    }, 3000) */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
/* 此处.recommend .recommend-content 得设置高度 不然不会出现滚动效果 */
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .loading-container
        position: absolute
        width: 100%
        top: 150%
        transform: translateY(-50%)
</style>
