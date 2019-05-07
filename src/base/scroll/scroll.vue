<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    /* 类型：Number 默认值：0 可选值：1、2、3 作用：知道滚动的位置 */
    probeType: {
      type: Number,
      default: 1
    },
    /* 类型：Boolean 默认值：false 作用：better-scroll 默认会阻止浏览器的原生 click 事件 */
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  methods: {
    /* 初始化滚动效果 */
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      /* 触发滚动事件 */
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 监听滚动事件
      if (this.listenScroll) {
        var that = this
        this.scroll.on('scroll', (pos) => {
          that.$emit('scroll', pos)
        })
      }
      // 监听是否滚动到底部的事件
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      // 监听开始滚动事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    /* 启用 better-scroll, 默认 开启。 */
    enable () {
      this.scroll && this.scroll.enable()
    },
    /* 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。 */
    disable () {
      this.scroll && this.scroll.disable()
    },
    /* 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。 */
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 延时刷新，dom渲染需要17ms时间
    data: function () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
