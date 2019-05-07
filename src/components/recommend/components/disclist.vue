<template>
  <div class="recommend-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li @click="selectItem(item)" class="item" v-for="(item, index) of songLists" :key="index">
        <div class="item-left"><img v-lazy="item.imgurl" class="item-img"></div>
        <div class="item-right">
          <h2 class="item-title">{{item.creator.name}}</h2>
          <p class="item-cont">{{item.dissname}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DiscList',
  props: {
    /* 推荐歌单数据 */
    songLists: Array
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    selectItem: function (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.$emit('selectItem', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
  .list-title
    height: 65px
    line-height: 65px
    text-align: center
    font-size: $font-size-medium
    color: $color-theme
  .item
    display: flex
    box-sizing: border-box
    align-items: center
    padding: 0 20px 20px 20px
    .item-left
      padding-right: 20px
      .item-img
        width: 60px
        height: 60px
    .item-right
      display: flex
      flex: 1
      overflow: hidden
      flex-direction:column
      justify-content: center
      line-height: 30px
      font-size: $font-size-medium
      .item-title
        color: $color-text
        marign-bottom: 10px
      .item-cont
        flex: 1
        color: $color-text-d
</style>
