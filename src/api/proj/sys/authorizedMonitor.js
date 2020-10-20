const mock = false
const method = mock ? 'get' : 'post'
import request from '@/utils/frame/base/request'
const authorization = {
  getList() {
    return request({
      url: '/api/sys/sysAuthorizedMonitor/list',
      method: 'post'
    })
  },
  save(params, func) {
    return request({
      url: '/api/sys/sysAuthorizedMonitor/save',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  getAuthorizedMonitorInfoList() {
    return request({
      url: '/api/sys/sysAuthorizedMonitor/listAuthorizedMonitorInfo',
      method: 'post'
    })
  },
  getListFuncModule(params) {
    return request({
      url: '/api/sys/sysAuthorizedMonitor/listFuncModule',
      method: 'post',
      data: params
    })
  }
}
export default authorization
