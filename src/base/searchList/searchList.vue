<template>
  <div class="searchList" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <!-- 这里出现警告 -->
      <li @click="selectItem(item)" class="search-item" v-for="(item) in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem: function (item) {
      this.$emit('selectItem', item)
    },
    deleteOne: function (item) {
      this.$emit('deleteOne', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .searchList
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1
      &.list-enter, list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
