const mock = false
const method = mock ? 'get' : 'post'
import request from '@/utils/frame/base/request'
const sysInitSetting = {
  getFlag() {
    return request({
      url: '/api/sys/sysInitSetting/getFlag',
      method: method
    })
  },
  save() {
    return request({
      url: '/api/sys/sysInitSetting/save',
      method: method
    })
  },
  revert() {
    return request({
      url: '/api/sys/sysInitSetting/revert',
      method: method
    })
  },
  getInitParams() {
    return request({
      url: '/api/sys/parameterUtil/getInitParams',
      method: 'post'
    })
  },
  updateReadFlag() {
    return request({
      url: '/api/sys/parameterUtil/updateReadFlag',
      method: 'post'
    })
  }
}
export default sysInitSetting
