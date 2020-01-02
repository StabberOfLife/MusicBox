<template>
  <Scroll class="suggest" :data="searchData" :pullup="pullup"
  @scrollToEnd="searchMore" ref="searchToTop">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="(item,items) in searchData" :key="items">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    <Loading v-show="hasData"></Loading>
    </ul>
    <div class="findNull-wrapper">
      <findNull v-show="!hasData && !searchData.length" title="口袋里什么都没有~"></findNull>
    </div>
  </Scroll>
</template>
<script type="text/ecmascript-8">
import {getSuggest} from 'api/suggest'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scrollY'
import Loading from 'base/Loading/loading'
import Singer from 'common/js/singer'
import {createSong} from 'common/js/song'
import {mapMutations, mapActions} from 'vuex'
import FindNull from 'base/findNull/findNull'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    findOut: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      searchData: [],
      pullup: true, // 上来刷新
      hasData: true // 判定search方法有没有加载完毕
    }
  },
  methods: {
    _search () {
      this.page = 1
      this.hasData = true
      this.$refs.searchToTop.scrollTo(0, 0)
      getSuggest(this.findOut, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.searchData = this._getSearchData(res.data)
          this._findMore(res.data)
          // console.log(this.searchData)
        }
      })
    },
    _getSearchData (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this.changeFilterSong(data.song.list))
        // console.log(ret)
      }
      return ret
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _findMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasData = false
      }
    },
    searchMore () {
      if (!this.hasData) {
        return
      }
      this.page++
      getSuggest(this.findOut, this.page, this.showSinger, perpage).then((res) => {
        this.searchData = this.searchData.concat(this._getSearchData(res.data))
        this._findMore(res.data)
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/musicSelect/${singer.id}`
        })
        this.setMusicSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    changeFilterSong (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setMusicSinger: 'SET_MUSICSINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    findOut () {
      this._search()
    }
  },
  components: {
    getSuggest,
    Scroll,
    Loading,
    Singer,
    FindNull
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 16px
          color: $color-text-d
      .name
        flex: 1
        font-size: 16px
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .findNull-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>