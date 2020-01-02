<template>
  <div id="app">
    <musicHeader></musicHeader>
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>

<script type="text/ecmascript-8">
import MusicHeader from '@/components/music-header/musicHeader'
import Tab from '@/components/tab/tab'
import Play from '@/components/play/play'

export default {
  components: {
    MusicHeader,
    Tab,
    Play
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/base";
  #app
    font-family: 'DejaVu Sans Mono', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
</style>
