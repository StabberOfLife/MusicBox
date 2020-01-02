<template>
  <div class="findNull">
    <div class="findNull-icon"></div>
    <p class="findNull-title">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-8">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .findNull
    text-align: center
    .findNull-icon
      width: 86px
      height: 90px
      margin: 0 auto
      bg-image('./loading-music')
      background-size: 86px 90px
    .findNull-title
      margin-top: 30px
      font-size:  $font-size-medium-x
      color: $color-theme
</style>