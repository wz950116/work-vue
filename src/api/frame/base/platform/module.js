import request from '@/utils/frame/base/request'

export function listModulesWithOperatesByParentModuleId(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/listModulesWithOperatesByParentModuleId',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function listCatalogAll(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/allCatalog',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function getMenuInfo(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/detail',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}
export function saveMenuInfo(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/save',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function checkMenu(operInfo) {
  return request({
    url: '/api/platform/cfgModule/check',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation
    }
  })
}

export function saveButtonBatch(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/button/save',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}
export function getButtonInfo(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/button/list',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function updateOrder(code, parentCode, operInfo) {
  return request({
    url: '/api/platform/cfgModule/updateOrder',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: {
        code: code,
        parentCode: parentCode
      }
    }
  })
}

export function removeButton(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/button/remove',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function sortMenu(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/sort',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}

export function removeMenu(parms, operInfo) {
  return request({
    url: '/api/platform/cfgModule/remove',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation,
      data: parms
    }
  })
}
export function bpmTree(operInfo) {
  return request({
    url: '/api/sys/dictItem/bpm/tree',
    method: 'post',
    data: {
      funcModule: operInfo.funcModule,
      funcOperation: operInfo.funcOperation
    }
  })
}
