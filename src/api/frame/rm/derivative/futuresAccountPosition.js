const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function getList(params) {
  return request({
    url: '/api/derivative/futuresPosition/list',
    method: method,
    data: params
  })
}
export function save(params) {
  return request({
    url: '/api/derivative/futuresPosition/save',
    method: method,
    data: params
  })
}
export function getinverstorList(params) {
  return request({
    url: '/api/bd/inverstorId/list',
    method: method,
    data: params
  })
}
