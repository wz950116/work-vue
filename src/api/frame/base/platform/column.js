import request from '@/utils/frame/base/request'

const columnApi = {
  getColumnByModuleCode(parms, func) {
    return request({
      url: '/api/platform/cfgModuleCol/getColumnByModuleCode',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: parms
      }
    })
  },

  save(parms, moduleCode, moduleType, func) {
    return request({
      url: '/api/platform/cfgModuleCol/save',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: {
          moduleCode: moduleCode,
          moduleType: moduleType,
          saveList: parms
        }
      }
    })
  }
}
export default columnApi
