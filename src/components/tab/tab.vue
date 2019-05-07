<template>
  <div class="tab">
    <router-link tag="div" class="item-tab" to="/recommend"><span class="item">推荐</span></router-link>
    <router-link tag="div" class="item-tab" to="/singer"><span class="item">歌手</span></router-link>
    <router-link tag="div" class="item-tab" to="/rank"><span class="item">排行</span></router-link>
    <router-link tag="div" class="item-tab" to="/search"><span class="item">搜索</span></router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab',
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
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .item-tab
      flex: 1
      float: left
      width: 25%
      height: 44px
      line-height: 44px
      text-align: center
      font-size: 14px
      .item
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
         .item
           color: $color-theme
           border-bottom: 2px solid $color-theme
</style>
