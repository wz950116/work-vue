import request from '@/utils/frame/base/request'

// 预警基础信息
const warning = {
  listWarning(params) {
    return request({
      url: '/api/warn/warning/list',
      method: 'post',
      data: params
    })
  },

  getWarning(warningCode, func) {
    return request({
      url: '/api/warn/warning/get',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  deleteWarning(warningCode, func) {
    return request({
      url: '/api/warn/warning/delete',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  insertWarning(obj, func) {
    return request({
      url: '/api/warn/warning/insert',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  updateWarning(obj, func) {
    return request({
      url: '/api/warn/warning/update',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  copyWarning(obj, func) {
    return request({
      url: '/api/warn/warning/copy',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  relateMsgFuncCode(warningCode, msgFuncCode, func) {
    return request({
      url: '/api/warn/warning/relateMsgFuncCode',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          msgFuncCode: msgFuncCode
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  // 预警员工关联
  listRelatedStaff(warningCode, func) {
    return request({
      url: '/api/warn/employee/listRelatedStaff',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listRelatedStaffId(warningCode, func) {
    return request({
      url: '/api/warn/employee/listRelatedStaffId',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  saveRelatedStaff(warningCode, staffCodeList, func) {
    return request({
      url: '/api/warn/employee/saveRelatedStaff',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          staffCodeList: staffCodeList
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  removeRelatedStaffs(ids, func) {
    return request({
      url: '/api/warn/employee/remove',
      method: 'post',
      data: {
        data: ids,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 预警消息模板

  getTmplByWarningId(warningCode, func) {
    return request({
      url: '/api/warn/msgTmpl/getByWarningId',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  saveWarningTmpl(obj, func) {
    return request({
      url: '/api/warn/msgTmpl/save',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  // 预警条件设置
  listCondNames(warningCode, func) {
    return request({
      url: '/api/warn/cond/listCondNames',
      method: 'post',
      data: {
        data: warningCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listWarningSource(func) {
    return request({
      url: '/api/warn/cond/listWarningSource',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listSrcCol(sourceCode, func) {
    return request({
      url: '/api/warn/cond/listSrcCol',
      method: 'post',
      data: {
        data: sourceCode,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listCondType(func) {
    return request({
      url: '/api/func/funcCondition/list',
      method: 'post',
      data: {
        data: {
          condCode: null,
          condName: null
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  saveWarnCond(warningCode, condDtoList, func) {
    return request({
      url: '/api/warn/cond/saveWarnCond',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          condDtoList: condDtoList
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  updateWarnCond(warningCode, groupCode, condDtoList, func) {
    return request({
      url: '/api/warn/cond/updateWarnCond',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          groupCode: groupCode,
          condDtoList: condDtoList
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listCondIdsByWarningIdGroupCode(warningCode, groupCode, func) {
    return request({
      url: '/api/warn/cond/listCondIdsByWarningIdGroupCode',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          groupCode: groupCode
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  removeCond(warningCode, groupCode, func) {
    return request({
      url: '/api/warn/cond/remove',
      method: 'post',
      data: {
        data: {
          warningCode: warningCode,
          groupCode: groupCode
        },
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  setParamValue(list, func) {
    return request({
      url: '/api/warn/cond/setParamValue',
      method: 'post',
      data: {
        data: list,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default warning
