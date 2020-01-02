<template>
  <transition name="slide">
    <music-list :songs="songs"
                :title="title"
                :singerImg="singerImg"></music-list>
  </transition>
</template>

<script type="text/ecmascript-8">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
import {getSongVkey} from 'api/getVkey'

export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'musicSinger'
    ]),
    title () {
      return this.musicSinger.name
    },
    singerImg () {
      return this.musicSinger.avatar
    }
  },
  created () {
    this._getDetail()
    // console.log(this.musicSinger)
  },
  methods: {
    _getDetail () {
      if (!this.musicSinger.id) {
        this.$router.push('/musicSinger')
        return
      }
      getSingerDetail(this.musicSinger.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._changSongerDetail(res.data.list)
        }
      })
    },
    _changSongerDetail (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          // ret.push(createSong(musicData))
          getSongVkey(musicData.songmid).then((res) => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const getSongVkey = svkey[0].vkey
              const newSong = createSong(musicData, getSongVkey)
              console.log(newSong)
              ret.push(newSong)
            }
          })
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .slide-enter-active, .slide-leave-active
      transition : all 0.3s
    .slide-enter-to, .slide-leave-to
      transform : translate3d(100%, 0, 0)
</style>