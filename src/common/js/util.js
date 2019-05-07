export function randomList (list) {
  var len = list.length
  let arr = list.slice()
  for (var i = 0; i < len; i++) {
    let t = getRandom(0, i)
    let temp = arr[i]
    arr[i] = arr[t]
    arr[t] = temp
  }
  return arr
}

function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function delay (fun, delayTime) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delayTime)
  }
}
