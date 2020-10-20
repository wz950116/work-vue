const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 期货数据导入
export function getImport(params) {
  return request({
    url: '/api/dvt/dvtFutureImpRcd/import',
    method: method,
    data: params
  })
}
// 子账号数据导入
export function save(params) {
  return request({
    url: '/api/dvt/dvtFutureImpRcd/importSub',
    method: method,
    data: params
  })
}
// 查询期货数据导入记录(分页查询)
export function list(params) {
  return request({
    url: '/api/dvt/dvtFutureImpRcd/list',
    method: method,
    data: params
  })
}
// 查询子账号数据导入记录(分页查询)
export function listSub(params) {
  return request({
    url: '/api/dvt/dvtFutureImpRcd/listSub',
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
