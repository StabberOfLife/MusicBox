<template>
    <div class="singer">
    <singerView @select="selectSinger" :data="singerList"></singerView>
    <router-view></router-view>
    </div>
</template>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .singer
    position :fixed
    top :88px
    bottom :0px
    width :100%
</style>

<script type="text/ecmascript-8">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import SingerData from 'common/js/singerData'
import SingerView from 'base/singerBook/singerView'
import {mapMutations} from 'vuex'

const topicName = '热门'
const topicSingerLength = 10

export default {
  data () {
    return {
      singerList: []
    }
  },
  created () {
    setTimeout(() => {
      this._getSingerList()
    }, 500)
  },
  components: {
    SingerView
  },
  methods: {
    selectSinger (musicSinger) {
      this.$router.push({
        path: `/musicSinger/${musicSinger.id}`
      })
      this.setMusicSinger(musicSinger)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._changeSingerList(res.data.list)
        }
      })
    },
    // 处理数据成我们需要的A-Z标签下的应对式歌手列表单
    _changeSingerList (list) {
      let map = {
        hot: {
          title: topicName,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 这里是枚举下每列只保留10位歌手的名单，如果在A-Z名字列表超过10这个值将不再对其聚合
        if (index < topicSingerLength) {
        // 创建了一个map（先了解一下map是对象，而且，在ES6版本其结构就是值与值一一对应）
        // 然后向map的对象赋值并且创建SingerData封装了一个歌手的三个重要数据，使得
        // 构造方法里面的两个参数可以被赋值为当前页面的id，也就是
        // id(param) => this.id => item.Fsinger_mid
        // 这里的构造函数在common/js/song/{creatSong}传入的是一个musicData数据
          map.hot.items.push(new SingerData({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 这里设置这个key是为了把赋值好的数据进行集合
        const key = item.Findex
        // 首先判断一下这些赋值进来的值有没有对应容器，
        // 没有的话，就将建一个容器，
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 然后对map进行遍历填充
        // 得到我们想要的map数据对象
        map[key].items.push(new SingerData({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 到目前为止，map还是一个对象（无分类无排序）
      console.log(map)
      // 但是，我们音乐盒子它是有序式排列，所以，我们还是需要进一步发分类排序
      let hot = []
      let rot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          rot.push(val)
          // 这里创建两个数组
          // 首先，遍历所有map的key
          // 然后，对其进行归类（使用正则表达式）
          // 之后，将分类完的key放入到数组sot中
        } else if (val.title === topicName) {
          hot.push(val)
          // 归类完成之后我们要进行排序
        }
      }
      rot.sort((a, b) => {
        // (升序式排列)这里是使用了数组的两个元素，
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(rot)
    },
    ...mapMutations({
      setMusicSinger: 'SET_MUSICSINGER'
    })
  }
}
</script>