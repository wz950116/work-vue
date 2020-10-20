<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'lcConfirmEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            LC_APPLY: '/api/lc/apply/get',
            LC_APPLY_CHECK: '/api/lc/apply/get'
          },
          view: '/api/lc/confirm/get',
          save: '/api/lc/confirm/save',
          update: '/api/lc/confirm/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          pre(param) {
            // 可以根据不同的 preBillType 返回没的数据
            return param.preBillNo
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
            $refs: this.$refs,
            getParam() {
              return this.param
            },
            event: 'audit',
            isShow: ['assist', 'audit'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核历史',
            name: 'biz.btn.auditHistory',
            $route: this.$route,
            getParam() {
              return {
                moduleCode: this.$route.meta.bpmModule,
                uk: this.$route.params.uk || this.$route.params.id
              }
            },
            event: 'auditHistory',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.id,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                billNo: data.confirmNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectLcApply',
            event: 'set',
            isShow: ['add'],
            component: () => import('../dialog/lcApplyDialog.vue'),
            initChoose: this.selectLcApplyInitChoose,
            callback: this.selectLcApplyCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'lc.lcConfirm.group.editPart1',
            content: [
              // 确认单号
              {
                label: 'lc.lcConfirm.form.confirmNo',
                prop: 'confirmNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: false
                }
              },
              // 申请单号
              {
                label: 'lc.lcConfirm.form.applyNo',
                prop: 'applyNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 供应商
              {
                label: 'lc.lcConfirm.form.customerNo',
                prop: 'customerNo',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '2',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  cols: 2,
                  filterable: true,
                  disabled: true,
                  clearable: false
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 信用证号
              {
                label: 'lc.lcConfirm.form.letterCreditNo',
                prop: 'letterCreditNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              // 信用证日期
              {
                type: 'date',
                label: 'lc.lcConfirm.form.issueDate',
                prop: 'issueDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              // 采购合同
              {
                label: 'lc.lcConfirm.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 溢短装(%)
              {
                label: 'lc.lcConfirm.form.moreOrLess',
                prop: 'moreOrLess',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  disabled: false,
                  clearable: true
                }
              },
              // 信用证金额
              {
                label: 'lc.lcConfirm.form.letterCreditAmount',
                prop: 'letterCreditAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: false,
                  clearable: true
                }
              },
              // 信用证类型
              {
                label: 'lc.lcConfirm.form.lcType',
                prop: 'lcType',
                element: 'base-select',
                list: this.$t('datadict.letterCreditType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'SIGHT',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                event: this.lcTypeChange
              },
              // 远期天数
              {
                label: 'lc.lcConfirm.form.usanceDays',
                prop: 'usanceDays',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'num',
                  disabled: false,
                  clearable: true
                },
                isShow: false
              },
              // 到期日
              {
                type: 'date',
                label: 'lc.lcConfirm.form.dueDate',
                prop: 'dueDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                prop: 'zhanweizhi1',
                isShow: true
              },
              // 币种
              {
                label: 'lc.lcConfirm.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 开证行
              {
                label: 'lc.lcConfirm.form.issuingBank',
                prop: 'issuingBank',
                element: 'input-validate',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              // 通知行
              {
                label: 'lc.lcConfirm.form.adviseBank',
                prop: 'adviseBank',
                element: 'input-validate',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              // 议付行
              {
                label: 'lc.lcConfirm.form.negoBank',
                prop: 'negoBank',
                element: 'input-validate',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: true,
                  clearable: false
                },
                event: {
                  evn: this.bizOrganCodeChange
                }
              },
              // 业务部门
              {
                label: 'biz.lbl.bizDeptName',
                prop: 'bizDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_DEPT',
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 业务员
              {
                label: 'biz.lbl.bizEmployeeName',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 操作员
              {
                label: 'biz.lbl.optName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: []
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'route'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    // 上级数据查询返回
    handlePreCallback(param) {
      this.selectLcApplyCallback(param)
    },
    // 初始化回调
    handleInitCallback(param) {
      this.lcTypeChange(param.lcType)
      if (this.edit.type !== 'add') {
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'customerNo') info.attrs.disabled = true
          if (info.prop === 'bizOrganCode') info.attrs.disabled = true
        })
      }
    },
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    // 本页面关闭
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    },
    // 选择开证申请弹框初始化
    selectLcApplyInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 选择开证申请回调函数
    selectLcApplyCallback(param) {
      this.lcTypeChange(param.lcType)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param.customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = param.contractNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = param.applyNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['moreOrLess'] = param.moreOrLess
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditAmount'] = param.letterCreditAmount
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcType'] = param.lcType
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['usanceDays'] = param.usanceDays
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['issuingBank'] = param.issuingBank
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['adviseBank'] = param.adviseBank
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['negoBank'] = param.negoBank
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
    },
    // 供应商change事件
    customerNoChange(val) {
      this.clearApplyInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 信用证类型change事件
    lcTypeChange(val) {
      if (val === 'SIGHT') {
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'usanceDays') info.isShow = false
          if (info.prop === 'zhanweizhi1') info.isShow = true
        })
      } else {
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'usanceDays') info.isShow = true
          if (info.prop === 'zhanweizhi1') info.isShow = false
        })
      }
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearApplyInfo()
    },
    // 清空供应商信息
    clearCustomerInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = ''
    },
    // 清空开证申请信息
    clearApplyInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['moreOrLess'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
      // this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcType'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['usanceDays'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['issuingBank'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['adviseBank'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['negoBank'] = ''
    }
  }
}
</script>
