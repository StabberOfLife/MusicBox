<template>
      <div  class="search">
        <div class="search-box-wrapper">
          <search-box ref="SearchBox" @findOut="findOutChange"></search-box>
        </div>
        <div class="search-find-wrapper" v-show="!findOut">
          <div class="search-find">
            <div class="hotkey">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click="getfindOut(item.k)" class="item" v-for="(item,k) in HotKey" :key="k">
                <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="search-result" v-show="findOut">
          <suggest :findOut="findOut"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .search-find-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .search-find
        height: 100%
        overflow: hidden
        .hotkey
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

<script type="text/ecmascript-8">
import SearchBox from 'base/search/search-box'
import {getSearchKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'base/suggest/suggest'
export default {
  data () {
    return {
      HotKey: [],
      findOut: ''
    }
  },
  created () {
    this._getSearchKey()
  },
  methods: {
    _getSearchKey () {
      getSearchKey().then((res) => {
        if (res.code === ERR_OK) {
          this.HotKey = res.data.hotkey.slice(0, 9)
          console.log(this.HotKey)
        }
      })
    },
    getfindOut (findOut) {
      this.$refs.SearchBox.setfindOut(findOut)
    },
    findOutChange (findOut) {
      this.findOut = findOut
    }
  },
  components: {
    SearchBox,
    getSearchKey,
    Suggest
  }
}
</script>