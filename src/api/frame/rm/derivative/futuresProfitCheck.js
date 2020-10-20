const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 期货盈亏核对导入数据
export function getImport(params) {
  return request({
    url: '/api/dvt/dvtFutureProfitCheck/import',
    method: method,
    data: params
  })
}
// 查询期货盈亏核对(分页查询)
export function list(params) {
  return request({
    url: '/api/dvt/dvtFutureProfitCheck/list',
    method: method,
    data: params
  })
}

