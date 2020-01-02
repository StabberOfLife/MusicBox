import Vue from 'vue'
import Router from 'vue-router'
import MusicRecommend from 'components/music-recommend/musicRecommend'
import MusicSelect from 'components/music-select/musicSelect'
import MusicSinger from 'components/music-singer/musicSinger'
import MusicUser from 'components/music-user/musicUser'
import SingerDetail from 'components/singer-detail/singerDetail'
import Login from 'components/login/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'musicRecommend',
      redirect: '/musicRecommend'
    },
    {
      path: '/musicRecommend',
      component: MusicRecommend
    },
    {
      path: '/musicSelect',
      component: MusicSelect,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/musicSinger',
      component: MusicSinger,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/musicUser',
      component: MusicUser
    },
    {
      path: '/login',
      component: Login
    }
  ]
})