const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
  hosts: ['http://localhost:8080/#/musicSelect']
})
client.ping({
  requestTimeout: 30000
}, function (error) {
  if (error) {
    console.error('出现错误了！')
  } else {
    console.log('everything is ok!')
  }
})

client.indices.create({
  index: 'scotch.io-tutorial'
}, function (error, response, status) {
  if (error) {
    console.log(error)
  } else {
    console.log('created a new index', response)
  }
})
client.index({
  index: 'scotch.io-tutorial',
  id: '1',
  type: 'cities_list',
  body: {
    'Key1': 'Content for key one',
    'Key2': 'Content for key two',
    'key3': 'Content for key three'
  }
}, function (resp) {
  console.log(resp)
})

// const musicSong = require('api/getMusicList')
// // 声明一个名为bulk的空数组
// var bulk = []
// // 循环遍历每个城市，并在每个循环中创建并将两个对象推入数组中
// // 第一个对象发送索引和类型，保存数据
// // 第二个对象是你想索引的数据
// if (musicSong !== null) {
// this.musicSong.forEach(singer => {
//   bulk.push({
//     index: {
//       _index: 'scotch.io-tutorial',
//       _type: 'cities_list'
//     }
//   })
//   bulk.push(singer)
//   })
// }
// client.bulk({body: bulk}, function (err, response) {
//   if (err) {
//     console.log('Failed Bulk operation'.red, err)
//   } else {
//     console.log('Successfully imported %s'.green, musicSong.length)
//   }
// })