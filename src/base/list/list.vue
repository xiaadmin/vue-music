<template>
  <div class="lists">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankList(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    songs: {
      type: Array,
      default: null
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
    // 改变rank排行榜图标
    getRankList: function (index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    // rank数字显示
    getRankText: function (index) {
      if (index > 2) {
        return index + 1
      }
    },
    // 点击列表歌曲事件
    selectItem: function (item, index) {
      // console.log(this.songs)
      this.$emit('select', item, index)
    },
    // 拼接Desc信息
    getDesc: function (song) {
      return `${song.singer} · ${song.album}`
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .lists
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          color: $color-text
        .desc
          margin-top: 4px
          color: $color-text-d
</style>
