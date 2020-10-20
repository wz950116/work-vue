const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function getList(params) {
  return request({
    url: '/api/derivative/optionAccountPosition/list',
    method: method,
    data: params
  })
}
export function get(params) {
  return request({
    url: '/api/derivative/optionAccountPosition/get',
    method: method,
    data: params
  })
}
export function save(params) {
  return request({
    url: '/api/derivative/optionAccountPosition/save',
    method: method,
    data: params
  })
}
export function update(params) {
  return request({
    url: '/api/derivative/optionAccountPosition/update',
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
export function getcontractList(params) {
  return request({
    url: '/api/bd/contract/list',
    method: method,
    data: params
  })
}
