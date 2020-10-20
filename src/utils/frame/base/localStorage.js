/*
 * localStorage的实现
 */
var storage = {
  get(key) {
    const item = localStorage.getItem(key)
    // 这点要判断是字符串还是对象
    const result = /^[{\[].*[}\]]$/g.test(item)
    if (result) {
      return JSON.parse(item)
    } else {
      return item
    }
  },
  set(key, value) {
    // 这点要判断是字符串还是对象
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      const item = JSON.stringify(value)
      localStorage.setItem(key, item)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

export default storage
