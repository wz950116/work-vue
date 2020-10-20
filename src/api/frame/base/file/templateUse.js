import request from '@/utils/frame/base/request'

const fleTemplateUseApi = {
  /**
   * 按照业务数据查找
   * @param {*} data 模板 信息
   * @param {*} func 功能及操作
   */
  getByDataId(data, func) {
    return request({
      url: '/api/sys/fleTemplateUse/getByDataId',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: data
      }
    })
  }
}

/**
 * 模板 API
 */
export default fleTemplateUseApi
