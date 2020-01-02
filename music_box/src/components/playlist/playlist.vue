<template>
  <transition name="transition-list">
    <div class="playlist" v-show="showList" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <span class="text">歌单列表</span>
            <span @click="clearAll" class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <Scroll ref="listShow" :data="sequenceList" class="list-content">
          <ul>
            <li ref="listItem" class="item" v-for="(item,index) in sequenceList" :key="item.key" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
              <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteMusicSong(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </Scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-8">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'base/scroll/scrollY'
import {playMode} from 'common/js/config'
export default {
  data () {
    return {
      showList: false
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ])
  },
  methods: {
    clearAll (list) {
      try {
        this.deleteSongList(list)
      } catch (error) {
        console.log(error)
      }
    },
    show () {
      this.showList = true
      setTimeout(() => {
        this.$refs.listShow.refresh()
        this.scrollToItem(this.currentSong)
      }, 20)
    },
    hide () {
      this.showList = false
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayState(true)
    },
    scrollToItem (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listShow.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteMusicSong (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENTINDEX_STATE',
      setPlayState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  components: {
    Scroll
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showList || newSong.id === oldSong.id) {
        return
      }
      this.scrollToItem(newSong)
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      border-radius: 16px 16px 0
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            padding:2px
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>