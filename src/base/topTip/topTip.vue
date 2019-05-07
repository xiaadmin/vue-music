<template>
  <transition name="topTip">
    <div class="topTip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'topTip',
  data () {
    return {
      showFlag: false
    }
  },
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    show: function () {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide: function () {
      this.showFlag = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .topTip
    position: fixed
    width: 100%
    top: 0
    z-index: 300
    background: $color-dialog-background
    &.topTip-enter-active, &.topTip-leave-active
      transition: all 0.3s
    &.topTip-enter, &.topTip-leave-to
      transform: translate3d(0, -100%, 0)
</style>
