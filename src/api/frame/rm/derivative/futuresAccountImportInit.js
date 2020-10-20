const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 期货期初数据导入
export function getImport(params) {
  return request({
    url: '/api/dvt/dvtFutureInitAccount/import',
    method: method,
    data: params
  })
}
// 子账号期初数据导入
export function importSub(params) {
  return request({
    url: '/api/dvt/dvtFutureInitAccount/importSub',
    method: method,
    data: params
  })
}
// 下载模板
export function download(params) {
  return request({
    url: '/api/sys/file/download',
    method: method,
    data: params
  })
}
