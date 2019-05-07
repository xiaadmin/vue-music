<template>
  <scroll :data="data" class="singerlist-content" ref="singerlist" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click="selectSinger(item)" class="list-group-item" :key="item.id">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.prevent="OnshortcutTouchStart" @touchmove.stop.prevent="OnshortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :key="index" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!this.data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
const TITLE_HEIGHT = 30
export default {
  name: 'SingerList',
  data: function () {
    return {
      scrollY: -1,
      currentIndex: 0,
      differ: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    // 右侧快速列表A B C D....
    shortcutList: function () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle: function () {
      if (this.scrollY >= 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    refresh: function () {
      this.$refs.singerlist.refresh()
    },
    selectSinger: function (item) {
      this.$emit('select', item)
    },
    OnshortcutTouchStart: function (e) {
      // getData()返回值为字符串
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.firstY = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    OnshortcutTouchMove: function (e) {
      let secondTouch = e.touches[0]
      this.touch.secondY = secondTouch.pageY
      let delta = Math.floor((this.touch.secondY - this.touch.firstY) / 18)
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll: function (pos) {
      // 向上滚动的距离
      this.scrollY = pos.y
    },
    // 触发滚动事件
    _scrollTo: function (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight - 2) {
        index = this.listHeight - 2
      }
      // 当点击右侧快速入口时，对应的字母颜色改变
      /* 之前如果少这一句 点击右侧快速入口时， 屏幕滚动到相应的位置 但是不会把懒加载的照片加载出来 */
      this.scrollY = -this.listHeight[index]
      this.$refs.singerlist.scrollToElement(this.$refs.listgroup[index], 0)
    },
    // 计算每个group的高度
    _calculateHeight: function () {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data: function () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY: function (newY) {
      const listHeight = this.listHeight
      // 当向下滚动时
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当在中间滚动时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if ((-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          this.differ = height2 + newY
          return
        }
      }
    },
    differ: function (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  created: function () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
    this.fixedTop = 0
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
/* 此处应该使用相对布局加u绝对布局  scroll的区域就是屏幕的区域 */
  .singerlist-content
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    box-sizing: border-box
    background: $color-background
    .list-group
      width: 100%
      overflow: hidden
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: 12px
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .list-shortcut
      position: absolute
      // display: flex
      // flex-direction: column
      // justify-content: center
      top: 50%
      transform: translateY(-50%)
      right: 0
      width: 20px
      padding: 20px 0
      marign: auto 0
      z-index: 90
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        line-height: 18px
        text-align: center
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      right: 0
      width: 100%
      .fixed
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        background: $color-highlight-background
        color: $color-text-l
</style>
