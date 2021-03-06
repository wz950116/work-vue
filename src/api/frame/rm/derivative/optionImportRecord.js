const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function getList(params) {
  return request({
    url: '/api/dvt/dvtImpOptionRecord/list',
    method: method,
    data: params
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtImpOptionRecord/save',
    method: method,
    data: params
  })
}
// export function getcountList(params) {
//   return request({
//     url: '/api/bd/futruechildaccount/list',
//     method: method,
//     data: params
//   })
// }
// export function getinverstorList(params) {
//   return request({
//     url: '/api/bd/inverstorId/list',
//     method: method,
//     data: params
//   })
// }
