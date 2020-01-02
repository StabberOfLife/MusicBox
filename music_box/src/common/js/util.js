function getRandomInt (min, max) {
  // 辅助函数
  // 主要返回min和max的随机数
  // 这里的random是一个小数，我们使用floor（）来取整使用
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  // 洗牌函数
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}