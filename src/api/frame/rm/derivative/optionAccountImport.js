const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtImpOptionRecord/get',
    method: method,
    data: params
  })
}
// 新增保存
export function save(params) {
  // params['funcModule'] = func.funcModule
  // params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtImpOptionRecord/save',
    method: method,
    data: params
  })
}
// 下载模板
export function download(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/sys/file/download',
    method: method,
    data: params
  })
}
