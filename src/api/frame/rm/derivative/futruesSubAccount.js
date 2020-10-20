// 期货子账号资金
const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'
// x项目
export function listProjectName() {
  return request({
    url: '/api/dvt/dvtBaseInfo/listProjectName',
    method: method
  })
}
// 查询子账号资金(分页查询)
export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureAccount/listSub',
    method: method,
    data: params
  })
}
// xiugai
export function update(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureAccount/updateSub',
    method: method,
    data: params
  })
}
// 获取弹窗数据
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureAccount/get',
    method: method,
    data: params
  })
}
