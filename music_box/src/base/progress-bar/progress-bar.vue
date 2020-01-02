<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <!-- 这里的结构是这样的：总的长度->进度长度->进度按钮->进度结尾处理 -->
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend.prevent="progressTouchEnd">
      <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-8">

import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    // 进度条
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      // 这个是表示我们的touch的标志位已经初始化了
      this.touch.initiated = true
      // 如果，这里的标志位初始化成果
      // 那么，就执行下一步使用它的一个开始X轴位置
      // 使用这个startX记录下按钮的页面开始第一标位置
      this.touch.startX = e.touches[0].pageX
      // 记录偏移量的位置
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offSetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX))
      this._offSetWidth(offSetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      // triggerPercent 就是拖动条变动监听到音乐读条变动
      this._triggerPercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offSetWidth = e.pageX - rect.left
      this._offSetWidth(offSetWidth)
      // this._offSetWidth(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent () {
      const percentWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / percentWidth
      this.$emit('percentChange', percent)
    },
    _offSetWidth (offSetWidth) {
      this.$refs.progress.style.width = `${offSetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offSetWidth}px,0,0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const percentWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offSetWidth = newPercent * percentWidth
        this._offSetWidth(offSetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>