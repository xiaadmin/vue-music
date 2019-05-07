<template>
  <div class="singer" ref="singer">
    <singer-list :data="singerList" @select="selectSinger" ref="singlist"></singer-list>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import SingerList from './components/singerlist'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
const HOST_NAME = '热门'
const HOST_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  name: 'Singer',
  components: {
    SingerList
  },
  data () {
    return {
      singerList: []
    }
  },
  methods: {
    handlePlaylist: function (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singlist.refresh()
    },
    selectSinger: function (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 获取歌手列表
    _getSingerList: function () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalListSinger(res.data.list)
        }
      })
    },
    // 初始化歌曲列表
    _normalListSinger: function (list) {
      let map = {
        hot: {
          title: HOST_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOST_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: item.Findex,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 将map处理为有序列表
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOST_NAME) {
          hot.push(val)
        }
      }
      ret.sort(function (a, b) {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created: function () {
    // 获取歌手数据
    this._getSingerList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    // 此处设置 singerdetail页面将无法从顶部显示（ios设备出现的问题）
    // overflow: hidden
</style>
