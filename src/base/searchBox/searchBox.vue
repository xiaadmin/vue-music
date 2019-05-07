<template>
  <div class="searchBox">
    <i class="icon-search"></i>
    <input ref="input" class="box" v-model="query" :placeholder="placeholder">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>

<script>
import {delay} from 'common/js/util'
export default {
  name: 'searchBox',
  data () {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  methods: {
    blur: function () {
      this.$refs.input.blur()
    },
    clear: function () {
      this.query = ''
    },
    addQuery: function (query) {
      this.query = query
    }
  },
  created: function () {
    this.$watch('query', delay((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.searchBox
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-background
  .box
    flex: 1
    marign: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
