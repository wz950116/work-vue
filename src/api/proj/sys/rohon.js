import request from '@/utils/frame/base/request'
export function getRohonToken() {
  return request({
    url: '/api/fun/staff/getRohonAccount',
    method: 'post'
  })
}
