<template>
  <div class="loading">
    <img class="loadimg" src="./loading.gif" alt="">
    <p class="desc">{{desc}}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      desc: '正在加载...'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
  .loading
    width: 100%
    text-align: center
    .loadimg
      width: 24px
      height: 24px
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
