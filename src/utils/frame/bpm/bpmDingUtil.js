import QmSelectPrompt from '@/components/frame/qm/qmSelectPrompt/index.js'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import Vue from 'vue'

const bpmDingUtil = {

  /**
   * 开始钉钉审批流程
   * @param {Object} self 自身,this
   * @param {String} moduleCode 模块代码
   * @param {Object} inputParam 参数信息
   */
  auditByDingTalk(self, moduleCode, inputParam) {
    self.loading = false
    request({
      url: '/api/dingtalk/approve/listInputFormInfo',
      method: 'POST',
      data: {
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.submitAudit'),
        data: {
          moduleCode: moduleCode,
          billNo: inputParam.uk.value
        }
      }
    }).then(response => {
      self.loading = false
      if (response.status) {
        if (response.data.length > 1) {
          const processList = []
          for (let i = 0; i < response.data.length; i++) {
            const procBaseInfo = response.data[i].procBaseInfo
            processList.push({
              value: procBaseInfo.processId,
              label: procBaseInfo.processName
            })
          }
          QmSelectPrompt({
            title: '流程选择',
            message: '流程选择',
            inputValue: null,
            inputList: processList
          }).then(({ value }) => {
            if (value) {
              for (let i = 0; i < response.data.length; i++) {
                const procBaseInfo = response.data[i].procBaseInfo
                if (procBaseInfo.processId === value) {
                  this.openInputDialog(self, moduleCode, inputParam, response.data[i])
                }
              }
            }
          })
        } else {
          this.openInputDialog(self, moduleCode, inputParam, response.data[0])
        }
      }
    }).catch(() => {
      self.loading = false
    })
  },
  openInputDialog(self, moduleCode, inputParam, inputInfo) {
    self.dialogDetailVisible = false
    if (inputInfo.dialogData.formData === null || inputInfo.dialogData.formData === undefined) {
      inputInfo.dialogData.formData = []
    }
    Vue.component('view-form-table', () => import('@/views/frame/base/sys/bpmSet/dingTalk/userInputDialog'))
    self.param = inputParam
    self.param.dialogData = inputInfo.dialogData
    self.param.dingCcUserList = inputInfo.dingCcUserList
    self.param.dingSubmitDeptId = inputInfo.dingSubmitDeptId
    self.param.moduleCode = moduleCode
    self.param.procBaseInfo = inputInfo.procBaseInfo
    self.param.procBaseInfo.moduleCode = moduleCode
    self.param.procBaseInfo.inputParam = inputParam
    self.dialogDetailVisible = true
  },
  /**
     * 启动[钉钉]审批
     * @param {Object} inputFormInfo 手动输入信息
     */
  startAuditByDingTalk(self, inputFormInfo) {
    console.log(inputFormInfo)
    self.loading = true
    const formData = Object.assign({}, inputFormInfo)
    delete formData.procBaseInfo
    const bpmVariableParamList = []
    bpmVariableParamList.push(inputFormInfo.procBaseInfo.inputParam.uk)
    // bpmVariableParamList.push(inputFormInfo.procBaseInfo.inputParam.todotext)
    request({
      url: '/api/dingtalk/approve/confirmBillBeforeStart',
      method: 'POST',
      data: {
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.submitAudit'),
        data: {
          moduleCode: inputFormInfo.procBaseInfo.moduleCode,
          billNo: inputFormInfo.procBaseInfo.inputParam.uk.value,
          processId: inputFormInfo.procBaseInfo.processId,
          inputFormInfo: formData,
          bpmVariableParamList: bpmVariableParamList
        }
      }
    }).then(response => {
      self.loading = false
      self.$notify(notifySuccess({ msg: '已提交，请在钉钉客户端进行确认。' }))
      console.log(self)
      self.getList()
    }).catch(() => {
      self.loading = false
    })
  }
}

export default bpmDingUtil
