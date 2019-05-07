<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" class="svg" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" :stroke-dasharray="dashArray" :stroke-dashoffset="dashoffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 32
    },
    precent: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      dashArray: Math.PI * 100
    }
  },
  created: function () {
  },
  computed: {
    dashoffset: function () {
      return this.dashArray * (1 - this.precent)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .progress-circle
    position: relative
    svg
      position: absolute
      top: 14px
      circle
        stroke-width: 8px
        transform-origin: center
        &.progress-background
          transform: scale(0.9)
          stroke: $color-theme-d
        &.progress-bar
          transform: scale(0.9) rotate(-90deg)
          stroke: $color-theme
</style>
