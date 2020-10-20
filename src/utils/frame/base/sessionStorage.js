/*
 * sessionStorage的实现
 */
var session = {
  get(key) {
    const item = sessionStorage.getItem(key)
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
      sessionStorage.setItem(key, value)
    } else {
      const item = JSON.stringify(value)
      sessionStorage.setItem(key, item)
    }
  },
  remove(key) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  },
  removeSet() {
    sessionStorage.removeItem('permissionButtons')
    sessionStorage.removeItem('bpmModule')
    sessionStorage.removeItem('bizCode')
    sessionStorage.removeItem('seqMode')
    sessionStorage.removeItem('bpmFlg')
    sessionStorage.removeItem('errorMsgId')
    sessionStorage.removeItem('auditModule')
    sessionStorage.removeItem('auditModule')
    sessionStorage.removeItem('licVerify')
  }
}

export default session
