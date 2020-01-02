<template>
    <div class="loading">
        <img style="width:34px;height:34px;" src="../../common/images/lazyLoad.gif" />
        <p class="loadFont">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-8">
export default {
  props: {
    title: {
      type: String,
      default: 'Just a moment,please~'
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .loading
        width :100%
        text-align :center
        .loadFont
            line-height :20px
            font-size :$font-size-small
            color :$color-text-l
</style>