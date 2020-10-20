import request from '@/utils/frame/base/request'

export function baseDataList(params) {
  return request({
    url: '/api/data/tableInfo/list',
    method: 'post',
    data: params
  })
}

export function baseDataInfoList(params) {
  return request({
    url: '/api/data/tableInfo/listInfo',
    method: 'post',
    data: params
  })
}

export function baseDataListDel(params) {
  return request({
    url: '/api/data/tableInfo/userTableDelete',
    method: 'post',
    data: params
  })
}

export function listTableColumn(params) {
  return request({
    url: '/api/data/tableInfo/listTableColumn',
    method: 'post',
    data: params
  })
}

export function userTableAdd(params) {
  return request({
    url: '/api/data/tableInfo/userTableAdd',
    method: 'post',
    data: params
  })
}

export function listPageByUser(params) {
  return request({
    url: '/api/data/tableInfo/listPageByUser',
    method: 'post',
    data: params
  })
}

export function listTableLabel(params) {
  return request({
    url: '/api/data/tableInfo/listTableLabel',
    method: 'post',
    data: params
  })
}

export function deleteTableData(params) {
  return request({
    url: '/api/data/tableInfo/deleteTableData',
    method: 'post',
    data: params
  })
}

export function saveTableData(params) {
  return request({
    url: '/api/data/tableInfo/saveTableData',
    method: 'post',
    data: params
  })
}

export function listUserTableInfo(params) {
  return request({
    url: '/api/data/tableInfo/listUserTableInfo',
    method: 'post',
    data: params
  })
}

export function listTableTitle(params) {
  return request({
    url: '/api/data/tableInfo/listTableTitle',
    method: 'post',
    data: params
  })
}

export function updateUserTable(params) {
  return request({
    url: '/api/data/tableInfo/updateUserTable',
    method: 'post',
    data: params
  })
}

export function getConditionForUser(params) {
  return request({
    url: '/api/data/tableInfo/getConditionForUser',
    method: 'post',
    data: params
  })
}
