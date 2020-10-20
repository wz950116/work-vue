<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'acceptanceDiscountEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            ACCEPTANCE_RECEIVE: '/api/acceptance/receive/get'
          },
          view: '/api/acceptance/discount/get',
          save: '/api/acceptance/discount/save',
          update: '/api/acceptance/discount/update'
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
                billNo: data.discountNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectAcceptanceReceive',
            event: 'set',
            isShow: ['add'],
            component: () => import('../dialog/acceptanceReceiveDialog.vue'),
            initChoose: this.selectAcceptanceReceiveInitChoose,
            callback: this.selectAcceptanceReceiveCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'acceptance.acceptanceDiscount.group.editPart1',
            content: [
              // 单据号
              {
                label: 'acceptance.acceptanceDiscount.form.discountNo',
                prop: 'discountNo',
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
              // 贴现日期
              {
                type: 'date',
                label: 'acceptance.acceptanceDiscount.form.discountDate',
                prop: 'discountDate',
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
                event: this.calculateDiscountAmount,
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              {},
              {},
              // 承兑汇票单据号
              {
                label: 'acceptance.acceptanceDiscount.form.acceptanceBillNo',
                prop: 'acceptanceBillNo',
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
              // 票据单据号
              {
                label: 'acceptance.acceptanceDiscount.form.acceptanceNo',
                prop: 'acceptanceNo',
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
              // 票面金额
              {
                label: 'acceptance.acceptanceDiscount.form.acceptanceAmount',
                prop: 'acceptanceAmount',
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
                }
              },
              // 币种
              {
                label: 'acceptance.acceptanceDiscount.form.currency',
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
              // 到期日
              {
                type: 'date',
                label: 'acceptance.acceptanceDiscount.form.dueDate',
                prop: 'dueDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              // 贴现天数
              {
                label: 'acceptance.acceptanceDiscount.form.discountDays',
                prop: 'discountDays',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'num',
                  disabled: true,
                  clearable: true
                }
              },
              // 贴现行
              {
                label: 'acceptance.acceptanceDiscount.form.discountBank',
                prop: 'discountBank',
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
              {},
              // 贴现利率
              {
                label: 'acceptance.acceptanceDiscount.form.discountRate',
                prop: 'discountRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'taxrate',
                  disabled: false,
                  clearable: true
                },
                event: {
                  change: this.calculateDiscountAmount
                }
              },
              // 贴现利息
              {
                label: 'acceptance.acceptanceDiscount.form.discountInterest',
                prop: 'discountInterest',
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
                }
              },
              // 贴现手续费
              {
                label: 'acceptance.acceptanceDiscount.form.discountServiceFee',
                prop: 'discountServiceFee',
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
                  change: this.calculateDiscountAmount
                }
              },
              // 实际贴现金额
              {
                label: 'acceptance.acceptanceDiscount.form.discountAmount',
                prop: 'discountAmount',
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
                }
              },
              // 收款帐号
              {
                label: 'acceptance.acceptanceDiscount.form.bankAccountCode',
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
                  changeAll: this.onBankAccountCodeChangeAll
                }
              },
              // 付款银行
              {
                label: 'acceptance.acceptanceDiscount.form.bankCode',
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
                  evn: this.onBizOrganCodeChange
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
                  maxlength: 500,
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
      this.selectAcceptanceReceiveCallback(param)
    },
    // 初始化回调
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
    // 选择外收承兑汇票弹框初始化
    selectAcceptanceReceiveInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 选择外收承兑汇票回调函数
    selectAcceptanceReceiveCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceNo'] = param.acceptanceNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceBillNo'] = param.receiveNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceAmount'] = param.acceptanceAmount
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['dueDate'] = param.dueDate
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      this.clearDiscountInfo()
      this.changeBankAccountSelectInfo()
      this.calculateDiscountAmount()
    },
    // 计算实际贴现金额
    calculateDiscountAmount() {
      var acceptanceAmount = this.getEditFormPropVal('acceptanceAmount')
      var discountDate = this.getEditFormPropVal('discountDate')
      var dueDate = this.getEditFormPropVal('dueDate')
      var discountDays = 0
      if (dueDate && discountDate) {
        discountDays = parseInt((Date.parse(new Date(dueDate.substring(0, 4) + '/' + dueDate.substring(4, 6) + '/' + dueDate.substring(6, 8))) - Date.parse(new Date(discountDate.substring(0, 4) + '/' + discountDate.substring(4, 6) + '/' + discountDate.substring(6, 8)))) / (1000 * 60 * 60 * 24)) + 1
      }
      var discountRate = Number(this.getEditFormPropVal('discountRate')) / 100
      var discountInterest = ((Number(acceptanceAmount) * Number(discountRate) * Number(discountDays)) / 360).toFixed(2)
      var discountServiceFee = this.getEditFormPropVal('discountServiceFee')
      var discountAmount = (Number(acceptanceAmount) - Number(discountInterest) - Number(discountServiceFee)).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.discountDays = discountDays
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.discountInterest = discountInterest
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.discountAmount = discountAmount
    },
    // 账号change事件
    onBankAccountCodeChangeAll(value) {
      if (value !== '') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = value.data.bankCode
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = ''
      }
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.clearAcceptanceInfo()
      this.clearDiscountInfo()
      this.changeBankAccountSelectInfo()
    },
    // 改变帐号下拉框
    changeBankAccountSelectInfo() {
      this.edit.formData.part1.content.forEach(info => {
        if (info.prop === 'bankAccountCode') {
          info.attrs.params = {
            organCode: this.getEditFormPropVal('bizOrganCode')
          }
        }
      })
    },
    // 清空承兑汇票信息
    clearAcceptanceInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceBillNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['dueDate'] = ''
    },
    // 清空贴现信息
    clearDiscountInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountDays'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountBank'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountRate'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountInterest'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountServiceFee'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['discountAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankAccountCode'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankCode'] = ''
    },
    // 获取属性值
    getEditFormPropVal(key, dtoKey) {
      if (dtoKey) {
        return this.$refs.qmEdit.$refs.qmRouteEdit.editForm[dtoKey][key]
      } else {
        return this.$refs.qmEdit.$refs.qmRouteEdit.editForm[key]
      }
    }
  }
}
</script>
