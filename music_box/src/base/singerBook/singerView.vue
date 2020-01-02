<template>
  <!-- 使用初始化好的scrollY组件，然后，props传入这个data数据变动时，重新去计算整个高度 -->
  <scrollY class="singerView"
          :probeType="probeType"
          :data="data"
          ref="singerView"
          :listenScroll="listenScroll"
          @scroll="scroll">
    <ul>
    <li v-for="group in data"
        :key="group.title"
        class="list-group"
        ref="listGroup">
      <h2 class="list-group-title">{{group.title}}</h2>
      <ul>
        <li @click="selectItem(item)"
            v-for="item in group.items"
            :key="item.name"
            class="list-group-item">
          <img class="avatar" v-lazy="item.avatar" />
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
    </li>
    </ul>
    <div class="list-rightSingerList"
         @touchstart="ringtSingerTouch"
         @touchmove.stop.prevent="ringtSingerTouchDynamic">
      <ul>
        <li v-for="(item,index) in rightSingerList"
            :data-index="index"
            :key="item"
            class="item"
            :class="{'current' : currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scrollY>
</template>

<script type="text/ecmascript-8">
import ScrollY from 'base/scroll/scrollY'
import {getData} from 'common/js/dom'
import loading from 'base/Loading/loading'

// 这个值其实就是右边A-Z那些字体的高度，但是，样式中没有定义且需要计算引用到只好自己设置了
const singerIndexHeight = 18
const topicHeight = 30

export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      topicValue: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    rightSingerList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    ringtSingerTouch (e) {
      // 获取动态绑定的属性值,getData为自定义的获取属性值的函数
      let singerIndex = getData(e.target, 'index')
      // 记录触摸屏幕的第一个手指以及pageY值
      let firstTouch = e.touches[0]
      this.touch.singerIndex = singerIndex
      // 记录触摸当前li的index
      this.touch.Y1 = firstTouch.pageY
      this._scrollTo(singerIndex)
    },
    ringtSingerTouchDynamic (e) {
      let firstTouch = e.touches[0]
      this.touch.Y2 = firstTouch.pageY
      let touchValue = (this.touch.Y2 - this.touch.Y1) / singerIndexHeight | 0
      let singerIndex = parseInt(this.touch.singerIndex) + touchValue
      this._scrollTo(singerIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      // 左侧滑动到对应位置
      this.$refs.singerView.scrollToElement(this.$refs.listGroup[index], 1)
    },
    _caculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._caculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 这里是newY滑动到下限的时候
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // newY滑动到中间部分的时候
      // 高度数组比列表数组多一个元素(height=0),因此要减去1
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.topicValue = height2 + newY
          return
        }
      }
      // newY直至最后的时候，此时，-newY > 上限
      this.currentIndex = listHeight.length - 2
    },
    topicValue (newVal) {
      let newFixed = (newVal > 0 && newVal < topicHeight) ? newVal - topicHeight : 0
      if (this.newFixed === newFixed) {
        return
      }
      this.newFixed = newFixed
      this.$refs.fixed.style.transform = `translate3d(0, ${newFixed}px, 0)`
    }
  },
  components: {
    ScrollY,
    loading
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singerView
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-rightSingerList
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>