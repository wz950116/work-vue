<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @preCallback='handlePreCallback' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'fundConfirmEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            FUND_APPLY: '/api/fund/apply/get',
            FUND_APPLY_CONFIRM_CHECK: '/api/fund/apply/get'
          },
          view: '/api/fund/confirm/get',
          save: '/api/fund/confirm/save',
          update: '/api/fund/confirm/update'
        },
        apiData: {
          pre(param) {
            // 可以根据不同的 preBillType 返回没的数据
            return param.preBillNo
          },
          view(param) {
            return param.uk || param.id
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
            name: 'biz.btn.selectFundApply',
            isShow: ['add'],
            event: 'set',
            component: () => import('../dialog/viewFundApplyInfoDialog.vue'),
            initChoose: this.selectFundApplyInitChoose,
            callback: this.selectFundApplyCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fund.fundConfirm.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fund.fundConfirm.form.confirmNo',
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
              // 付款日期
              {
                type: 'date',
                label: 'fund.fundConfirm.form.paymentDate',
                prop: 'paymentDate',
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
              // 客户
              {
                label: 'fund.fundConfirm.form.customerNo',
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
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  cols: 2,
                  filterable: true,
                  disabled: true,
                  clearable: true
                },
                event: {
                  evn: this.onCustomerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 申请单号
              {
                label: 'fund.fundConfirm.form.applyNo',
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
              // 申请单据类型
              {
                label: 'fund.fundConfirm.form.applyBillType',
                prop: 'applyBillType',
                element: 'base-select',
                list: this.$t('datadict.fundApplyBillType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '',
                attrs: {
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
                  clearable: true
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
                  disabled: false,
                  clearable: true
                }
              }
            ]
          },
          part2: {
            titleName: 'fund.fundConfirm.group.editPart2',
            content: [
              // 付款方式
              {
                label: 'fund.fundConfirm.form.paymentType',
                prop: 'paymentType',
                element: 'base-select',
                list: this.$t('datadict.settlementTypePay'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'EFT',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                event: this.onPaymentTypeChange
              },
              // 付款金额
              {
                label: 'fund.fundConfirm.form.paymentAmount',
                prop: 'paymentAmount',
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
                  change: this.onPaymentAmountChange
                }
              },
              // 币种
              {
                label: 'fund.fundConfirm.form.currency',
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
                event: this.onCurrencyChange
              },
              {},
              // 付款帐号
              {
                label: 'fund.fundConfirm.form.bankAccountCode',
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
                label: 'fund.fundConfirm.form.bankCode',
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
              // 承兑汇票
              {
                label: 'fund.fundConfirm.form.acceptanceNo',
                prop: 'acceptanceNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/acceptance/dialog/viewAcceptanceInfoDialog.vue'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: false
                },
                validateFunc: this.acceptanceNoValidateFunc,
                initChoose: this.acceptanceNoInitChoose,
                callback: this.acceptanceNoCallback,
                isShow: false
              },
              {
                prop: 'acceptanceDirection',
                isShow: false
              },
              {
                prop: 'acceptanceBillNo',
                isShow: false
              },
              // 信用证
              {
                label: 'fund.fundConfirm.form.letterCreditNo',
                prop: 'letterCreditNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/lc/dialog/lcConfirmDialog.vue'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: false
                },
                validateFunc: this.letterCreditNoValidateFunc,
                initChoose: this.letterCreditNoInitChoose,
                callback: this.letterCreditNoCallback,
                isShow: false
              },
              {
                prop: 'letterCreditBillNo',
                isShow: false
              }
            ]
          },
          part3: {
            titleName: 'fund.fundConfirm.group.editPart3',
            hidden: true,
            content: [
              // 押汇日期
              {
                type: 'date',
                label: 'fund.fundConfirm.form.draftDate',
                prop: 'draftDate',
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
                default: dateFormate(new Date(), 'yyyyMMdd'),
                event: this.onDraftDateChange
              },
              // 押汇天数
              {
                label: 'fund.fundConfirm.form.draftDays',
                prop: 'draftDays',
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
                event: {
                  change: this.onDraftDaysChange
                }
              },
              // 到期日
              {
                type: 'date',
                label: 'fund.fundConfirm.form.draftDueDate',
                prop: 'draftDueDate',
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
              {},
              // 押汇比例
              {
                label: 'fund.fundConfirm.form.draftRate',
                prop: 'draftRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  disabled: false,
                  clearable: true
                },
                event: {
                  change: this.onDraftRateChange
                }
              },
              // 押汇金额
              {
                label: 'fund.fundConfirm.form.draftAmount',
                prop: 'draftAmount',
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
              // 即期购汇
              {
                label: 'fund.fundConfirm.form.sightDraftAmount',
                prop: 'sightDraftAmount',
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
              // 汇率
              {
                label: 'fund.fundConfirm.form.exchangeRate',
                prop: 'exchangeRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'exchangeRate',
                  disabled: false,
                  clearable: true
                }
              },
              // labor
              {
                label: 'fund.fundConfirm.form.laborRate',
                prop: 'laborRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  disabled: false,
                  clearable: true
                },
                event: {
                  change: this.onLaborRateChange
                }
              },
              // 上浮
              {
                label: 'fund.fundConfirm.form.goUpRate',
                prop: 'goUpRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  disabled: false,
                  clearable: true
                },
                event: {
                  change: this.onGoUpRateChange
                }
              },
              // 利率
              {
                label: 'fund.fundConfirm.form.interestRate',
                prop: 'interestRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  disabled: true,
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
      this.selectFundApplyCallback(param)
    },
    // 编辑初始化回调
    handleInitCallback(param) {
      this.onPaymentTypeChange(param.paymentType)
      this.onCurrencyChange(param.currency)
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
    // 选择付款申请弹框初始化
    selectFundApplyInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 选择付款申请回调函数
    selectFundApplyCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param.customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = param.applyNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyBillType'] = param.applyBillType
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['paymentAmount'] = (Number(param.applyAmount) - Number(param.confirmAmount)).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      this.clearFundInfo()
      this.changeBankAccountSelectInfo()
      this.onCurrencyChange(param.currency)
    },
    // 客户change事件
    onCustomerNoChange(val) {
      this.clearApplyInfo()
      this.clearFundInfo()
      this.changeBankAccountSelectInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 业务机构change事件
    onBizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearApplyInfo()
      this.clearFundInfo()
      this.changeBankAccountSelectInfo()
    },
    // 付款方式change事件
    onPaymentTypeChange(val) {
      if (val === 'EFT') {
        // 电汇
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = true
          if (info.prop === 'bankAccountCode') info.isShow = true
          if (info.prop === 'acceptanceNo') info.isShow = false
          if (info.prop === 'letterCreditNo') info.isShow = false
          if (info.prop === 'paymentAmount') info.attrs.disabled = false
        })
        this.edit.formData.part3.hidden = true
      }
      if (val === 'ACCEPTANCE') {
        // 承兑汇票
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = false
          if (info.prop === 'bankAccountCode') info.isShow = false
          if (info.prop === 'acceptanceNo') info.isShow = true
          if (info.prop === 'letterCreditNo') info.isShow = false
          if (info.prop === 'paymentAmount') info.attrs.disabled = true
        })
        this.edit.formData.part3.hidden = true
      }
      if (val === 'LC') {
        // 信用证
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = false
          if (info.prop === 'bankAccountCode') info.isShow = false
          if (info.prop === 'acceptanceNo') info.isShow = false
          if (info.prop === 'letterCreditNo') info.isShow = true
          if (info.prop === 'paymentAmount') info.attrs.disabled = false
        })
        this.edit.formData.part3.hidden = true
      }
      if (val === 'DRAFT') {
        // 押汇
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = false
          if (info.prop === 'bankAccountCode') info.isShow = false
          if (info.prop === 'acceptanceNo') info.isShow = false
          if (info.prop === 'letterCreditNo') info.isShow = false
          if (info.prop === 'paymentAmount') info.attrs.disabled = false
        })
        this.edit.formData.part3.hidden = false
      }
    },
    // 付款账号change事件
    onBankAccountCodeChangeAll(value) {
      if (value !== '') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = value.data.bankCode
        // this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode = value.data.organCode
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = ''
        // this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode = ''
      }
    },
    // 选择承兑汇票验证
    acceptanceNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('fund.fundConfirm.form.customerNo') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('biz.lbl.bizOrganName') }))
        return false
      }
      return true
    },
    // 选择承兑汇票弹框初始化
    acceptanceNoInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        // 'customerNo': {
        //   disabled: true,
        //   value: this.getEditFormPropVal('customerNo')
        // },
        bizOrganCode: {
          disabled: true,
          value: this.getEditFormPropVal('bizOrganCode')
        }
      }
    },
    // 选择承兑汇票回调函数
    acceptanceNoCallback(param) {
      if (param.currency !== this.getEditFormPropVal('currency')) {
        this.$notify(notifyInfo({ msg: this.$t('fund.fundConfirm.msg.acceptanceCurrencyNe') }))
        return
      }
      if (param.acceptanceDirection === 'SIGN' && param.customerNo !== this.getEditFormPropVal('customerNo')) {
        this.$notify(notifyInfo({ msg: this.$t('fund.fundConfirm.msg.signAcceptanceCustomerNe') }))
        return
      }
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceBillNo'] = param.infoNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceDirection'] = param.acceptanceDirection
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceNo'] = param.acceptanceNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['paymentAmount'] = param.acceptanceAmount
    },
    // 选择信用证验证
    letterCreditNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('fund.fundConfirm.form.customerNo') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('biz.lbl.bizOrganName') }))
        return false
      }
      return true
    },
    // 选择信用证弹框初始化
    letterCreditNoInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        customerNo: {
          disabled: true,
          value: this.getEditFormPropVal('customerNo')
        },
        bizOrganCode: {
          disabled: true,
          value: this.getEditFormPropVal('bizOrganCode')
        },
        useStatusNe: {
          value: '2'
        }
      }
    },
    // 选择信用证回调函数
    letterCreditNoCallback(param) {
      if (param.currency !== this.getEditFormPropVal('currency')) {
        this.$notify(notifyInfo({ msg: this.$t('fund.fundConfirm.msg.letterCreditCurrencyNe') }))
        return
      }
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditBillNo'] = param.confirmNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditNo'] = param.letterCreditNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['paymentAmount'] = (Number(param.letterCreditAmount) - Number(param.usedAmount)).toFixed(2)
    },
    // 改变付款帐号下拉框
    changeBankAccountSelectInfo() {
      this.edit.formData.part2.content.forEach(info => {
        if (info.prop === 'bankAccountCode') {
          info.attrs.params = {
            organCode: this.getEditFormPropVal('bizOrganCode')
          }
        }
      })
    },
    // 付款金额change事件
    onPaymentAmountChange(val) {
      this.calculateDraftAmount()
    },
    // 币种change事件
    onCurrencyChange(val) {
      if (val === 'CNY') {
        this.edit.formData.part3.content.forEach(info => {
          if (info.prop === 'exchangeRate') info.attrs.disabled = true
        })
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['exchangeRate'] = 1
      } else {
        this.edit.formData.part3.content.forEach(info => {
          if (info.prop === 'exchangeRate') info.attrs.disabled = false
        })
      }
    },
    // 押汇日期change事件
    onDraftDateChange(val) {
      this.calculateDraftDueDate()
    },
    // 押汇天数change事件
    onDraftDaysChange(val) {
      this.calculateDraftDueDate()
    },
    // 押汇比例change事件
    onDraftRateChange(val) {
      this.calculateDraftAmount()
    },
    // labor change事件
    onLaborRateChange(val) {
      this.calculateInterestRate()
    },
    // 上浮change事件
    onGoUpRateChange(val) {
      this.calculateInterestRate()
    },
    // 计算押汇到期日
    calculateDraftDueDate() {
      var draftDate = this.getEditFormPropVal('draftDate')
      var draftDays = this.getEditFormPropVal('draftDays')
      var draftDueDate = new Date(draftDate.substring(0, 4) + '/' + draftDate.substring(4, 6) + '/' + draftDate.substring(6, 8))
      draftDueDate = new Date(Date.parse(draftDueDate) + 1000 * 60 * 60 * 24 * Number(draftDays))
      const y = draftDueDate.getFullYear()
      const m = draftDueDate.getMonth() + 1
      const d = draftDueDate.getDate()
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['draftDueDate'] = (y * 10000 + m * 100 + d).toString()
    },
    // 计算押汇金额、即期购汇金额
    calculateDraftAmount() {
      var paymentAmount = this.getEditFormPropVal('paymentAmount')
      var draftRate = this.getEditFormPropVal('draftRate')
      var draftAmount = ((Number(paymentAmount) * Number(draftRate)) / 100).toFixed(2)
      var sightDraftAmount = (Number(paymentAmount) - Number(draftAmount)).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['draftAmount'] = draftAmount
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['sightDraftAmount'] = sightDraftAmount
    },
    // 计算利率
    calculateInterestRate() {
      var laborRate = this.getEditFormPropVal('laborRate')
      var goUpRate = this.getEditFormPropVal('goUpRate')
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['interestRate'] = Number(laborRate) + Number(goUpRate)
    },
    // 清空付款申请信息
    clearApplyInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyBillType'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['paymentAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
    },
    // 清空付款信息
    clearFundInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankCode'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankAccountCode'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceBillNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceDirection'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditBillNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['letterCreditNo'] = ''
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
