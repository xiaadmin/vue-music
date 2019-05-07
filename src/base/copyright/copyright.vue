<template>
  <transition name="copyright">
    <div class="copyright" v-show="showFlag">
      <div class="copyright-wrapper">
        <div class="copyright-content">
          <p class="text">{{title}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CopyRight',
  data () {
    return {
      showFlag: false
    }
  },
  props: {
    title: {
      type: String,
      default: '抱歉,Summer Music没有该歌曲版权!'
    }
  },
  methods: {
    // 展示
    show: function () {
      this.showFlag = true
      setTimeout(() => {
        this.hide()
      }, 1000)
    },
    // 隐藏
    hide: function () {
      this.showFlag = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.copyright
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom: 0
  z-index: 1000
  background-color: $color-background-d
  .copyright-wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 600
    .copyright-content
      width: 270px
      border-radius: 13px
      background: $color-highlight-background
      .text
        padding: 19px 15px
        line-height: 70px
        text-align: center
        font-size: 14px
        color: $color-text-l
</style>
