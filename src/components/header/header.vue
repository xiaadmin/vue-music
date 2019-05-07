<template>
  <div class="header">
    <h1 class="text">{{title}}</h1>
    <router-link to="/userCenter" tag="div" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Headers',
  data () {
    return {
      title: 'Summer Music'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .header
    position: relative
    height: 44px
    color: $color-theme
    font-size: 18px
    text-align: center
    .text
      display: inner-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
