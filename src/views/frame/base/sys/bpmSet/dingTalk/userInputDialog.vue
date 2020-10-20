<template>
  <qm-dialog-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-dialog-edit>
</template>

<script>
import request from '@/utils/frame/base/request'
import bpmUtil from '@/utils/frame/bpm/bpmUtil.js'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      edit: {
        initType: 'param',
        type: 'submitAudit',
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title) + ' 提交审批',
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['submitAudit']
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.submit',
            event: this.doSubmit,
            isShow: ['submitAudit'],
            showLoading: true,
            attrs: {
              type: 'primary'
            }
          }
        ],
        api: {},
        formData: {
          // 提交人信息
          partSubmitUser: {
            titleName: 'bpm.common.changeName',
            content: [
              {
                label: '提交人',
                prop: 'dingSubmitUserName',
                element: 'input-validate',
                default: '',
                attrs: {
                  disabled: false
                }
              },
              {
                label: '所在部门',
                prop: 'dingSubmitDeptId',
                element: 'base-select',
                default: '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                list: [],
                attrs: {
                  clearable: true,
                  filterable: true,
                }
              },
              {
                label: '流程名称',
                prop: 'dingProcessName',
                element: 'input-validate',
                default: '',
                attrs: {
                  disabled: true,
                  cols: 2
                }
              },
            ]
          }
        },
        tables: [
          {
            isShow: ['submitAudit'],
            name: 'dingCcUserList',
            label: '抄送人',
            component: () => import('./userInputCcUser.vue')
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {
    // 去掉关联单据的默认值
    // const approvalFormArray = []
    for (let i = 0; i < this.param.dialogData.formData.length; i++) {
      const v = this.param.dialogData.formData[i]
      if (v.isShow === false) {
        delete v.default
      }
      if (v.type === 'date') {
        if (v.default !== null && v.default !== undefined && v.default !== '') {
          if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(v.default)) {
            delete v.default
          }
        }
      }
    }
    // 预处理
    let handleFormData = []
    const approvalFormItemPropSet = []
    for (let i = 0; i < this.param.dialogData.formData.length; i++) {
      const v = this.param.dialogData.formData[i]
      // 关联审批单
      if (v.isApprovalForm) {
        const approvalFormItemFormData = {
          label: v.label,
          prop: v.prop,
          element: 'base-dialog-select',
          component: () => import('./approvalFormSelectDialog.vue'),
          callback: (val) => this.callbackOfApprovalForm(val, v.prop),
          event: {
            clear: () => this.callbackOfApprovalForm([], v.prop)
          },
          validate: [
            {
              required: false,
              trigger: 'blur'
            }
          ],
          attrs: {
            clearable: true,
            cols: 4,
            filterable: true
          }
        }
        handleFormData.push(approvalFormItemFormData)
        approvalFormItemPropSet.push(approvalFormItemFormData.prop.substring(0, approvalFormItemFormData.prop.length - 4))
      }
    }
    for (let i = 0; i < this.param.dialogData.formData.length; i++) {
      const v = this.param.dialogData.formData[i]
      // 关联审批单
      if (v.isApprovalForm) {
      } else {
        if (approvalFormItemPropSet.includes(v.prop)) {
        } else {
          handleFormData.push(v)
        }
      }
    }

    // this.edit.formData.partA = {
    //   titleName: '单据信息',
    //   content: []
    // }
    if (Array.isArray(handleFormData) && handleFormData.length > 0) {
      this.edit.formData.partB = {
        titleName: '附加信息',
        content: handleFormData
      }
    }
  },
  mounted() {
    const partSubmitUser = this.edit.formData.partSubmitUser.content
    const editForm = this.$refs.qmEdit.editForm
    editForm.dingProcessName = this.param.procBaseInfo.processName
    editForm.dingSubmitDeptId = ''
    console.log(editForm)
    partSubmitUser[0].attrs.disabled = true
    request({
      url: '/api/dingtalk/bpmUserBaseInfo/getCurrentDingUser',
      method: 'post',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: null
      }
    }).then(response => {
      if (response.status) {
        if (response.data) {
          editForm.dingSubmitUserName = response.data.userName
          if (response.data.deptInfoList) {
            for (let i = 0; i < response.data.deptInfoList.length; i++) {
              const deptInfo = response.data.deptInfoList[i]
              partSubmitUser[1].list.push({ key: deptInfo.departId, value: deptInfo.departId, label: deptInfo.departName })
              if (response.data.deptInfoList.length === 1) {
                editForm.dingSubmitDeptId = deptInfo.departId
                // } else if (deptInfo.departId === this.param.dingSubmitDeptId) {
                // // 所在部门默认值
                // editForm.dingSubmitDeptId = deptInfo.departId
              }
            }
          }

        }
      }
    })
  },
  methods: {
    /**
     * 关闭回调
     * @param {Object|Bool} params 回调参数
     */
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    /**
     * 提交
     */
    doSubmit() {
      const validateArr = []
      const editForm = this.$refs.qmEdit.editForm
      if (Array.isArray(this.$refs.qmEdit.$refs.refForm)) {
        this.$refs.qmEdit.$refs.refForm.forEach(r => {
          r.validate(valid => {
            validateArr.push(valid)
          })
        })
      } else {
        this.$refs.qmEdit.$refs.refForm.validate(valid => {
          validateArr.push(valid)
        })
      }
      if (validateArr.includes(false)) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.saveCheck') }))
        return false
      }
      const dingCcUserList = this.$refs.qmEdit.$refs.dingCcUserList[0].$refs.tab.tableData
      const submitData = Object.assign({}, editForm)
      submitData.dingCcUserList = Array.isArray(dingCcUserList) ? dingCcUserList : []
      delete submitData.dialogData
      delete submitData.row
      for (let i = 0; i < submitData.dingCcUserList.length; i++) {
        const row = submitData.dingCcUserList[i]
        const ccPosition = Array.isArray(row.ccPosition) && row.ccPosition.length > 0
        const ccUserId = toolUtil.isNotEmpty(row.ccUserId)
        if (ccUserId && !ccPosition) {
          this.$notify(notifyInfo({ msg: '抄送节点不可为空。' }))
          return false
        }
      }

      this.$emit('closeHandler', true, submitData)

    },
    /**
     * [关联审批单]弹窗选择后回调
     * @param {Object} callbackData 回调数据
     */
    callbackOfApprovalForm(callbackData, prop) {
      const formDataRef = this.$refs.qmEdit.editForm
      const billIdArray = []
      const billNmArray = []
      if (Array.isArray(callbackData)) {
        for (let i = 0; i < callbackData.length; i++) {
          const row = callbackData[i]
          billIdArray.push(row.processInstanceId)
          billNmArray.push(row.title)
        }
      }
      formDataRef[prop] = billNmArray.join(', ')
      formDataRef[prop.substring(0, prop.length - 4)] = billIdArray
    }
  }
}
</script>
