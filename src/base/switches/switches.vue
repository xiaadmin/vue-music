<template>
  <ul class="switch">
    <li class="switch-item" v-for="(item, index) in switches" @click="switchItem(index)" :class="{'active': currentSIndex === index}" :key="index">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Switches',
  props: {
    switches: {
      type: Array,
      default: null
    },
    currentSIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem: function (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .switch
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      text-align: center
      padding: 8px
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
