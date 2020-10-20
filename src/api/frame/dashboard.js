import request from '@/utils/frame/base/request'

// 获取列表数据
export function get(params) {
  return request({
    url: '/api/sys/homeConfig/get',
    method: 'post',
    data: params
  })
}
// 保存列表数据
export function save(params) {
  return request({
    url: '/api/sys/homeConfig/save',
    method: 'post',
    data: params
  })
}
