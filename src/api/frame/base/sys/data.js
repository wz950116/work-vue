import request from '@/utils/frame/base/request'

export function listSelectData(params) {
  return request({
    url: '/api/dd/selectData/list',
    method: 'post',
    data: params
  })
}

export function selectDataType(params) {
  return request({
    url: '/api/dd/selectData/type',
    method: 'post',
    data: params
  })
}
