<template>
  <div class="play" v-show="playList.length > 0">
    <div class="full-play" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image" />
      </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" :class="turnRun">
              <img class="image" :src="currentSong.image" />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
            <!-- <span class="dot" :class="{'active':currentShow==='cd'}"></span> -->
            <!-- <span class="dot" :class="{'active':currentShow==='lyric'}"></span> -->
          </div>
        <!-- 这里是歌曲的播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{songInterval(songTime)}}</span>
            <div class="progress-bar-wrapper">
              <!-- 这个进度条使用fiex布局，是一个左右撑开两边的设置 -->
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{songInterval(currentSong.duration)}}</span>
          </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left" :class="disableSong">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableSong">
            <i :class="playIcon" @click="startPlaying"></i>
          </div>
          <div class="icon i-right" :class="disableSong">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i :click="favorite" class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-play" v-show="!fullScreen" @click="openAll">
      <div class="icon">
        <img width="80%" height="80%" :src="currentSong.image" />
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>

      <!-- 子元素出现冒泡行为使用stop -->

      <div class="control">
        <i @click.stop="startPlaying" :class="minniIcon"></i>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <playlist ref="playlist"></playlist>
    <audio ref="audioPlay" :src="currentSong.url" @canplay="ready"
    @error="error"
    @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-8">
import progressBar from 'base/progress-bar/progress-bar'
import {mapGetters, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Playlist from 'components/playlist/playlist'

export default {
  data () {
    return {
      forReady: false,
      songTime: 0
    }
  },
  components: {
    progressBar,
    Playlist
  },
  methods: {
    showPlaylist () {
      this.$refs.playlist.show()
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    goBack () {
      this.setFullScreen(false)
    },
    openAll () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN_STATE',
      setStartPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX_STATE',
      setPlayMode: 'SET_MODE_STATE',
      setPlayList: 'SET_PLAYLIST_STATE'
    }),
    startPlaying () {
      if (!this.forReady) {
        return
      }
      this.setStartPlaying(!this.playing)
    },
    prev () {
      if (!this.forReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        // 把index置零是因为这里是要顺序性播放
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.startPlaying()
      }
      this.forReady = false
    },
    end () {
      // 循环
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audioPlay.songTime = 0
      this.$refs.audioPlay.playing()
      this.setStartPlaying(true)
    },
    next () {
      if (!this.forReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.startPlaying()
      }
      this.forReady = false
    },
    ready () {
      this.forReady = true
    },
    error () {
      this.forReady = true
    },
    updateTime (e) {
      // 这里是播放歌曲的时间就是我们的更新时间，e：表示事件对应以前的一个event
      // target：其实就是个对象的意思
      this.songTime = e.target.songTime
    },
    // 这里是把歌曲时间戳转成分秒时间度
    songInterval (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this.fillZero(interval % 60)
      return `${minute}:${second}`
    },
    // 上面的方法只是用取60为一个进度，所以，取整之后我们就只有这么一个单位数
    // 现在我们要进行补零
    fillZero (num, n = 2) {
      let stringLen = num.toString().length
      while (stringLen < n) {
        num = '0' + num
        stringLen++
      }
      return num
    },
    onProgressBarChange (percent) {
      this.$refs.audioPlay.songTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.startPlaying()
      }
    }
  },

  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.$nextTick(() => {
        this.$refs.audioPlay.play()
      })
    },
    playing (newPlaying) {
      const audioPlay = this.$refs.audioPlay
      this.$nextTick(() => {
        newPlaying ? audioPlay.play() : audioPlay.pause()
      })
    }
  },
  computed: {
    turnRun () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favorite () {
      return this.playing ? 'icon-not-favorite' : 'icon-favorite'
    },
    minniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 这里要使用disable属性对快速dom操作的情况实现限流
    disableSong () {
      return this.forReady ? '' : 'disable'
    },
    percent () {
      return this.songTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .play
    .full-play
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 10px
            font-size: $font-size-large-x
            color: $color-theme
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-play
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>