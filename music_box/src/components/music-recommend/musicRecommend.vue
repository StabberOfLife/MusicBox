<template>
    <div class="recommend">
        <scrollY ref="scrollY" class="recommend-content" :data="musicList">
          <div>
            <div v-if="recommends.length" class="slider-wrapper">
              <!-- 这里的slider是使用了slot插槽来固定一个位置，在位置里面放入了图片和连接 -->
              <slider>
                <div v-for="(id,imgurl) in recommends" :key="imgurl.key">
                  <a>
                    <img class="needsclick" @load="loadImg" :src="id.imgurl"/>
                  </a>
                </div>
              </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                  <li class="item" v-for="item in musicList" :key="item.key">
                    <div class="icon">
                      <img style="width:60px; height:60px;" v-lazy="item.imgurl" />
                      </div>
                      <div class="text">
                        <h2 class="name" v-html="item.creator.name"></h2>
                        <p class="desc" v-html="item.dissname"></p>
                      </div>
                    </li>
                </ul>
            </div>
            </div>
            <div class="loading-container" v-show="!musicList.length">
            <loading></loading>
          </div>
        </scrollY>
    </div>
</template>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

<script type="text/ecmascript-8">
import {getMusicList} from 'api/getMusicList'
import {ERR_OK} from 'api/config'
import slider from 'base/slider/slider'
import scrollY from 'base/scroll/scrollY'
import loading from 'base/Loading/loading'
import axios from 'axios'

export default {
  data () {
    return {
      recommends: [],
      musicList: []
    }
  },
  created () {
    this._getRecommend()
    setTimeout(() => {
      this._getMusicList()
    }, 500)
  },
  components: {
    scrollY,
    slider,
    loading
  },
  methods: {
    // 打印出来轮播图的数据
    _getRecommend () {
      axios.get('../../static/data.json').then(response => {
        this.recommends = response.data.imger
        console.log(response.data.imger)
      }, response => {
        console.log('Error in getRecommend which in musicRecommend!')
      })
    },
    loadImg () {
      if (!this.checkLoader) {
        this.$refs.scrollY.refresh()
        this.checkLoader = true
      }
    },
    // 打印出来的是歌单列表
    _getMusicList () {
      getMusicList().then((res) => {
        if (res.code === ERR_OK) {
          this.musicList = res.data.list
          console.log(res.data.list)
        }
      })
    }
  }
}
</script>