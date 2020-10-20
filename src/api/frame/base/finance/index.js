import request from '@/utils/frame/base/request'

export function leftList(data) {
  return request({
    url: '/api/finance/interface/list',
    method: 'post',
    data
  })
}
export function addtype (data) {
  return request({
    url: '/api/finance/ztBill/save',
    method: 'post',
    data
  })
}
