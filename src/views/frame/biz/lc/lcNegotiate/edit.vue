<template>

  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'lcNegotiateEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            LC_RECEIVE: '/api/lc/receive/get'
          },
          view: '/api/lc/negotiate/get',
          save: '/api/lc/negotiate/save',
          update: '/api/lc/negotiate/update'
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
                billNo: data.negotiateNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectLcReceive',
            event: 'set',
            isShow: ['add'],
            component: () => import('../dialog/lcReceiveDialog.vue'),
            initChoose: this.selectLcApplyInitChoose,
            callback: this.selectLcReceiveCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'lc.lcNegotiate.group.editPart1',
            content: [
              // 单据号
              {
                label: 'lc.lcNegotiate.form.negotiateNo',
                prop: 'negotiateNo',
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
              }, // 议付日期
              {
                label: 'lc.lcNegotiate.form.negotiateDate',
                prop: 'negotiateDate',
                element: 'el-date-picker',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'date',
                  data: 'startDate',
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              {},
              {},
              // 信用证号
              {
                label: 'lc.lcNegotiate.form.letterCreditNo',
                prop: 'letterCreditNo',
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
              // 信用证金额
              {
                label: 'lc.lcNegotiate.form.letterCreditAmount',
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
                  disabled: true,
                  clearable: true
                },
                event: {
                  change: this.letterCreditAmountChange
                }
              },
              // 币种
              {
                label: 'lc.lcNegotiate.form.currency',
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
                },
                default: 'CNY'
              },
              {},
              // 议付行
              {
                label: 'lc.lcNegotiate.form.negoBank',
                prop: 'negoBank',
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

              // 议付利息
              {
                label: 'lc.lcNegotiate.form.negotiateInterest',
                prop: 'negotiateInterest',
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
                },
                event: {
                  change: this.negotiateInterest
                }
              },
              // 议付手续费
              {
                label: 'lc.lcNegotiate.form.negotiateServiceFee',
                prop: 'negotiateServiceFee',
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
                },
                event: {
                  change: this.negotiateServiceFeeChange
                }
              },
              // 实付议付金额
              {
                label: 'lc.lcNegotiate.form.negotiateAmount',
                prop: 'negotiateAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  gtmin: 0,
                  type: 'money',
                  disabled: true,
                  clearable: true
                }
              },

              // 付款帐号
              {
                label: 'lc.lcNegotiate.form.bankAccountCode',
                prop: 'bankAccountCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_ORGAN_BANK_ACCOUNT',
                  params: {
                    organCode: ''
                  },
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  changeAll: this.bankAccountCodeChangeAll
                }
              },
              // 付款银行
              {
                label: 'lc.lcNegotiate.form.bankName',
                prop: 'bankCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_BANK',
                  filterable: true,
                  disabled: true,
                  clearable: true
                }
              },
              {},
              {},
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
        }
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
      this.selectLcReceiveCallback(param)
    },
    // 编辑初始化回调
    handleInitCallback(param) {
      this.changeBankAccountSelectInfo()
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
    // 选择收信用证弹框初始化
    selectLcApplyInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 选择收信用证回调函数
    selectLcReceiveCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditNo'] = param.letterCreditNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditBillNo'] = param.receiveNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditAmount'] = param.letterCreditAmount
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      this.changeBankAccountSelectInfo()
      // 机构change事件
      this.bizOrganCodeChange(this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode)
    },
    // 议付手续费change事件 实付议付 = 信用证金额 -议付利息-议付手续费
    negotiateServiceFeeChange(value) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.letterCreditAmount && value && this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateInterest) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateAmount = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.letterCreditAmount - this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateInterest - value
      }
    },
    // 信用证金额change事件
    letterCreditAmountChange(value) {
      this.negotiateServiceFeeChange(this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateServiceFee)
    },
    // 议付利息change事件
    negotiateInterest(value) {
      this.negotiateServiceFeeChange(this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateServiceFee)
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankAccountCode = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = ''
    },
    // 账号change事件
    bankAccountCodeChangeAll(value) {
      if (value !== '') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = value.data.bankCode
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = ''
      }
    },
    // 改变帐号下拉框
    changeBankAccountSelectInfo() {
      this.edit.formData.part1.content.forEach(info => {
        if (info.prop === 'bankAccountCode') {
          info.attrs.params = {
            organCode: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode
          }
        }
      })
    }
  }
}
</script>
