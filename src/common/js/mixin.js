import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted: function () {
    this.handlePlaylist(this.playlist)
  },
  activated: function () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist: function (newPlayist) {
      this.handlePlaylist(newPlayist)
    }
  },
  methods: {
    handlePlaylist: function () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
