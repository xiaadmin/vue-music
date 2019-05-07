<template>
  <transition name="confirm">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <div class="operate">
            <div @click="confirms" class="operate-btn left">{{confirm}}</div>
            <div @click.stop="cancels" class="operate-btn">{{cancel}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  data () {
    return {
      showFlag: false
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    confirm: {
      type: String,
      default: '确认'
    },
    cancel: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    // 展示
    show: function () {
      this.showFlag = true
    },
    // 隐藏
    hide: function () {
      this.showFlag = false
    },
    // 确认
    confirms: function () {
      this.hide()
      this.$emit('confirm')
    },
    // 取消
    cancels: function () {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.confirm
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom: 0
  z-index: 500
  background-color: $color-background-d
  .confirm-wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 600
    .confirm-content
      width: 270px
      border-radius: 13px
      background: $color-highlight-background
      .text
        padding: 19px 15px
        line-height: 22px
        text-align: center
        font-size: $font-size-large
        color: $color-text-l
      .operate
        display: flex
        align-items: center
        text-align: center
        font-size: $font-size-large
        .operate-btn
          flex: 1
          line-height: 22px
          padding: 10px 0
          border-top: 1px solid $color-background-d
          color: $color-text-d
          &.left
            border-right: 1px solid $color-background-d
</style>
