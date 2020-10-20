import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
/**
 * 审批流工具类
 */
const bpmUtil = {
  /**
   * obj转换成键值对对象集合
   *
   * @param {Object} obj 对象
   */
  obj2VarParamList(obj) {
    if (!obj) {
      return []
    }

    const varParamList = []
    let typeofStr
    for (const [key, value] of Object.entries(obj)) {
      typeofStr = typeof value
      if (typeof value === 'function' || typeof value === 'symbol') {
        continue
      }
      if (value === null || typeofStr === 'string' || typeofStr === 'boolean' || typeofStr === 'number') {
        varParamList.push({ name: key, value: value })
        continue
      }
      varParamList.push({ name: key, value: JSON.stringify(value) })
    }
    return varParamList
  },
  /**
   * 添加参数对象
   *
   * @param {Array} varParamList 参数对象集
   * @param {Object} varParam 参数对象
   */
  addVarParam(varParamList, varParam) {
    if (varParamList === undefined || varParamList === null) {
      varParamList = []
    }
    varParamList.push(varParam)
  },
  /**
   * 创建审批参数
   *
   * @param {String} moduleCode 模块CODE
   * @param {String} billNo 单据号
   * @param {Array} varParamList 参数对象集
   * @param {Object} inputFormInfo 手输表单信息
   */
  createAduitParam(moduleCode, billNo, varParamList, inputFormInfo) {
    return {
      moduleCode: moduleCode,
      billNo: billNo,
      bpmVariableParamList: varParamList || [],
      inputFormInfo: inputFormInfo || {}
    }
  },
  /**
   * 审批处理
   * @param {String} moduleCode 模块代码
   * @param {Function} dingTalkHandleCallBack 钉钉审批回调
   * @param {Function} activitiHandleCallback activiti回调
   * @param {Function} failCallback 失败回调
   * @param {Function} exceptionCallback 异常回调
   */
  auditHandle(moduleCode, self, dingTalkHandleCallBack, activitiHandleCallback, failCallback, exceptionCallback) {
    // 启动审批
    request({
      url: '/api/bpm/businessDefine/getApproveDefineByModuleCode',
      method: 'post',
      data: {
        data: moduleCode,
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.submitAudit')
      }
    })
      .then(response => {
        const responseData = response.data
        if (responseData && responseData.bpmType === 'dingTalk') {
          if (dingTalkHandleCallBack) {
            dingTalkHandleCallBack(responseData)
          }
          return
        }
        if (responseData && responseData.bpmType === 'activiti') {
          if (activitiHandleCallback) {
            activitiHandleCallback(responseData)
          }
          return
        }
        if (failCallback) {
          failCallback()
        }
      })
      .catch(() => {
        if (exceptionCallback) {
          exceptionCallback()
        }
      })
  },
  /**
   * 创建获取钉钉[手输]表单查询参数
   *
   * @param {String} moduleCode 模块CODE
   * @param {String} billNo 单据号
   */
  createDingInputFormQryParam(moduleCode, billNo) {
    return {
      // 模块CODE
      moduleCode: moduleCode || '',
      // 单据号
      billNo: billNo || ''
    }
  },
  /**
   * 获取钉钉[手输]表单
   * @param {Object} qryParam 查询参数
   * @param {Object} self this对象
   * @param {Function} successCallback 成功回调
   * @param {Function} failCallback 失败回调
   * @param {Function} exceptionCallback 异常回调
   */
  getDingInputForm(qryParam, self, successCallback, failCallback, exceptionCallback) {
    request({
      url: '/api/dingtalk/approve/listInputFormInfo',
      method: 'POST',
      data: {
        data: qryParam,
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.submitAudit')
      }
    }).then(response => {
      if (response.status) {
        if (successCallback) {
          successCallback(response.data)
        }
      } else {
        if (failCallback) {
          failCallback(response)
        }
      }
    }).catch(() => {
      if (exceptionCallback) {
        exceptionCallback()
      }
    })
  },
  /**
   * 钉钉审批
   * @param {Object} aduitDataParam 审核参数
   * @param {Object} self this对象
   * @param {Function} successCallback 成功回调
   * @param {Function} failCallback 失败回调
   * @param {Function} exceptionCallback 异常回调
   */
  auditByDingTalk(aduitDataParam, self, successCallback, failCallback, exceptionCallback) {
    request({
      url: '/api/dingtalk/approve/confirmBillBeforeStart',
      method: 'POST',
      data: {
        data: aduitDataParam,
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.submitAudit')
      }
    }).then(response => {
      if (response.status) {
        if (successCallback) {
          successCallback(response.data)
        }
      } else {
        if (failCallback) {
          failCallback(response)
        }
      }
    }).catch(() => {
      if (exceptionCallback) {
        exceptionCallback()
      }
    })
  },
  /**
   * 是否支持撤回审核
   * @param {Object} self this对象
   * @param {String} errorMsg 错误信息
   */
  supportWithdrawAudit(self, errorMsg) {
    // 钉钉不支持在CT系统内撤回
    if (self.$route.meta.bpmType === 'dingTalk') {
      const msg = errorMsg || self.$t('biz.msg.DingTalkNotSupportWithdrawAudit')
      self.$notify(notifyInfo({ msg: msg }))
      return false
    }
    return true
  },
  /**
   * 是否钉钉审批
   * @param {Object} self  this对象
   */
  isAuditOfDingTalk(self) {
    return self.$route.meta.bpmType === 'dingTalk'
  }
}

export default bpmUtil
