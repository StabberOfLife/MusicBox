const Koa = require('koa')
const bodyparser = require('bodyparser')
const app = new Koa()
app.use(async ctx => {
  ctx.body = 'hello'
})
app.listen(3000)
console.log('dsdhdhshsdhds')