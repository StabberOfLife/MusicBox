<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
      <div class="singerImg" :style="bgImgStyle" ref="singerImg">
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <scrollY @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
        <div class="song-list-wrapper">
          <div class="play-wrapper">
            <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
              <i class="icon-play"></i>
              <span class="text">随机播放列表</span>
            </div>
          </div>
          <song-list @select="selectItem" :songs="songs"></song-list>
        </div>
        <div class="loading-container" v-show="!songs.length">
          <loading></loading>
        </div>
      </scrollY>
  </div>
</template>

<script type="text/ecmascript-8">
import ScrollY from 'base/scroll/scrollY'
import SongList from 'base/song-list/song-list'
import Loading from 'base/Loading/loading'
import {mapActions} from 'vuex'

const TOPICMARGIN = 40

export default {
  props: {
    singerImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.singerImg.clientHeight
    this.minTranslateY = -this.imageHeight + TOPICMARGIN
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    goBack (singerDetail) {
      // 注意：这里使用的go()方法，这个函数它不会自动退出页面刷新功能
      // 但是，使用this.$router.push('....')，它会刷新一次页面，这样原本的移动位置就被重置了
      this.$router.go(-1)
    },
    scroll (pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.bgLayer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
      const precent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + precent
        zIndex = 10
      } else {
        blur = Math.min(precent * 20, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.singerImg.style.paddingTop = 0
        this.$refs.singerImg.style.height = `${TOPICMARGIN}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.singerImg.style.paddingTop = '70%'
        this.$refs.singerImg.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.singerImg.style.zIndex = zIndex
      this.$refs.singerImg.style['transform'] = `scale(${scale})`
      this.$refs.singerImg.style['webkitTransform'] = `scale(${scale})`
    }
  },
  components: {
    ScrollY,
    SongList,
    Loading
  },
  computed: {
    bgImgStyle () {
      return `background-image:url(${this.singerImg})`
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme-d
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-theme
    .singerImg
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      background-color: $color-background-d
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
    .bg-layer
      border-radius: 16px 16px 0 0
      position: relative
      height: 100%
      background: $color-background
    .list
      border-radius: 30px 30px 0 0
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        border-radius: 16px 16px 0 0
        padding: 20px 30px
        .play-wrapper
          top: 10px
          z-index: 50
          width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
        .loading-container
          position: absolute
          width: 100%
          top: 50%
          transform: translateY(-50%)
</style>