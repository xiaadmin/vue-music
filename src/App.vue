<template>
  <div id="app">
    <div class="header">
      <headers></headers>
      <tab></tab>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Headers from './components/header/header'
import Tab from './components/tab/tab'
import Player from './components/player/player'
export default {
  name: 'App',
  components: {
    Headers,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" scoped>
.header
  position: fixed
  top: 0
  width: 100%
  height: 88px
  overflow: hidden
</style>
