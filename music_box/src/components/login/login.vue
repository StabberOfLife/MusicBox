<template>
  <div class="login">
    <div class="full-login">
      <div class="background">
        <!-- 全局背景 -->
        <img width="100%" height="100%" src="~common/images/background.png" />
      </div>
        <!-- 上面得文字 -->
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">Login</h1>
        </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <form class="userInfor">
            <h2 class="text">Welcome to musicBox</h2>
            <div class="user">用户名
            <input v-model="username" autocomplete="username" style="width:150px;background-color:transparent;outline: medium;color:#fff;text-align:center;" type="text" placeholder="请输入用户名" /><br/>
            </div>
            <div class="pwd">密&nbsp;码
           <input v-model="password" autocomplete="password" style="width:150px;background-color:transparent;outline: medium;color:#fff;text-align:center;" type="password" placeholder="请输入密码" />
            </div>
            <div class="buttom" @click="goLogin">登陆</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-8">
import {mapMutations, mapActions} from 'vuex'
import Axios from 'api/axios'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goLogin () {
      // if (this.username === '' || this.password === '') {
      //   alert('error')
      // } else if (this.username === '123' || this.password === '123') {
      //   this.userLogin(false).then(() => {
      //     this.$router.push('/musicUser')
      //     localStorage.setItem('Flag', 'isLogin')
      //   })
      // }
      this.$axios.post('/login', {username: this.username, password: this.password},
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(data => {
          if (data.data.status !== 200) {
            alert(data.data.message)
          } else {
            this.$store.dispatch('isLogin', true)
            localStorage.setItem('Flag', 'isLogin')
            alert(data.data.message)
            this.$router.push('/musicUser')
          }
        })
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN_STATE',
      setLogin: 'SET_ISLOGIN_STATE'
    }),
    ...mapActions([
      'userLogin'
    ])
  },
  components: {
    Axios
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .login
    .full-login
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
        opacity: 0.7
        filter: blur(8px)
      .top
        padding-top:18px
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 10px 6px
            font-size: $font-size-large-x
            color: $color-theme
        .title
          color: $color-theme
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          margin-top:38px
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            font-size:$font-size-medium-x
            color: $color-theme
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .userInfor
              border: 1px solid #ffcd32
              border-radius: 8px
              font-size:18px
              padding:10%
              text-align:center
              .text
                margin: 0 0 40px 0
                color: #ffcd32
              .user
                  padding: 5px
                  text-align:center
                  border: 1px solid #ffcd32
                  margin: 20px 0
                  border-radius: 4px
              .pwd
                  text-align:center
                  padding: 5px
                  border-radius: 4px
                  border: 1px solid #ffcd32
                  margin-bottom:20px
</style>