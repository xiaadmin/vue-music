<template>
  <div class="wrapper">
    <!-- v-if="Listslength"如果没有加载出数据 不渲染swiper -->
    <swiper :options="swiperOption" v-if="Listslength">
      <swiper-slide v-for="(item, index) of Lists" :key="index">
        <!-- <a :href="item.linkUrl"><img class="swiper-img" :src="item.picUrl" alt=""></a> -->
        <a :href="item.linkUrl"><img @load="loadimg" class="swiper-img" :src="item.picUrl" alt=""></a>
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'Swipers',
  props: {
    /* 轮播图数据 */
    Lists: Array,
    /* 轮播图数组长度 */
    Listslength: Number
  },
  data: function () {
    return {
      /* 轮播图控制属性 */
      swiperOption: {
        pagination: '.swiper-pagination',
        loop: true,
        autoplay: 3000,
        speed: 500
      }
    }
  },
  computed: {
  },
  methods: {
    loadimg: function () {
      this.$emit('loadedimg')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
/* 设置轮播图小圆点的背景颜色 */
  .wrapper >>> .swiper-pagination-bullet-active
    background: #fff
  .wrapper
    overflow: hidden
    width: 100%
    height: 0
    padding-bottom: 40%
    background: #eee
    .swiper-img
      width: 100%
</style>
