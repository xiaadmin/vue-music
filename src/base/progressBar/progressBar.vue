<template>
  <div class="progressBar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  name: 'ProgressBar',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  created: function () {
    this.touch = {}
    this.touch.init = false
  },
  methods: {
    progressClick: function (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // const barWidth = this.$refs.progressBar.clientWidth
      // const offsetX = Math.min(barWidth, Math.max(0, e.offsetX))
      // const precent = offsetX / barWidth
      // this.$emit('changePrecnet', precent)
      this._triggerPercent()
    },
    progressTouchStart: function (e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove: function (e) {
      if (!this.touch.init) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const barWidth = this.$refs.progressBar.clientWidth
      const progressWidth = Math.min(Math.max(0, this.touch.left + deltaX), barWidth)
      const AllWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const precent = this.$refs.progress.clientWidth / AllWidth
      this._offset(progressWidth)
      this.$emit('changeCurrentTime', precent)
    },
    progressTouchEnd: function () {
      this.touch.init = false
      this._triggerPercent()
    },
    _triggerPercent: function () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('changePrecnet', percent)
    },
    _offset: function (progressWidth) {
      this.$refs.progress.style.width = `${progressWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px, 0, 0)`
    }
  },
  watch: {
    precent: function (newPrecent) {
      if (newPrecent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const progressWidth = this.precent * barWidth
        this._offset(progressWidth)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .progressBar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
