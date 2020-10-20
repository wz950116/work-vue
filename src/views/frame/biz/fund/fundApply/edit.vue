<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'fundApplyEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            FUND_CLAIM: '/api/fund/claim/get',
            CON_PL_INFO: '/api/contract/slProductDetail/listChoosePurchaseSaleForFund'
          },
          view: '/api/fund/apply/get',
          save: '/api/fund/apply/save',
          update: '/api/fund/apply/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          pre(param) {
            // 可以根据不同的 preBillType 返回没的数据
            if (param.preBillType === 'CON_PL_INFO') {
              return {
                lotNo: param.preBillNo,
                customerNo: param.supplierCode
              }
            }
            if (param.preBillType === 'FUND_CLAIM') {
              return param.preBillNo
            }
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
                billNo: data.applyNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fund.fundApply.group.editPart1',
            content: [
              // 申请单号
              {
                label: 'fund.fundApply.form.applyNo',
                prop: 'applyNo',
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
              // 申请日期
              {
                type: 'date',
                label: 'fund.fundApply.form.applyDate',
                prop: 'applyDate',
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
                label: 'fund.fundApply.form.customerNo',
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
                    typeCode: '12',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  cols: 2,
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 申请类型
              {
                label: 'fund.fundApply.form.applyType',
                prop: 'applyType',
                element: 'base-select',
                list: this.$t('datadict.fundApplyType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'LOT',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                event: this.applyTypeChange
              },
              // 业务类别
              {
                label: 'fund.fundApply.form.businessType',
                prop: 'businessType',
                element: 'base-select',
                list: this.$t('datadict.fundApplyBusinessType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'B',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: true,
                event: this.businessTypeChange
              },
              // 合同号
              {
                label: 'fund.fundApply.form.contractNo',
                prop: 'contractNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/spot/dialog/fund/chooseContractInfoPc.vue'),
                validateFunc: this.contractNoValidateFunc,
                initChoose: this.contractNoInitChoose,
                callback: this.contractNoCallback,
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: false
              },
              // 预收款单号
              {
                label: 'fund.fundApply.form.claimNo',
                prop: 'claimNo',
                element: 'base-dialog-select',
                component: () => import('../dialog/fundAdvClaimDialog.vue'),
                validateFunc: this.claimNoValidateFunc,
                initChoose: this.claimNoInitChoose,
                callback: this.claimNoCallback,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: false
                },
                isShow: false
              },
              // 申请金额
              {
                label: 'fund.fundApply.form.applyAmount',
                prop: 'applyAmount',
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
                  change: this.applyAmountChange
                }
              },
              // 币种
              {
                label: 'fund.fundApply.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'CNY',
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              // 付款方式
              {
                label: 'fund.fundApply.form.paymentType',
                prop: 'paymentTypeList',
                element: 'base-select',
                list: this.$t('datadict.settlementTypePay'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  cols: 2,
                  multiple: true,
                  disabled: false,
                  clearable: true
                },
                default: [],
                event: this.paymentTypeChange
              },
              // 最迟付款日期
              {
                type: 'date',
                label: 'fund.fundApply.form.latestPaymentDate',
                prop: 'latestPaymentDate',
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {},
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userOrganCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: false,
                  clearable: true
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
                label: 'biz.lbl.bizApplyName',
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
              {
                label: 'storage.outNotice.form.custCreditNo',
                prop: 'custCreditNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/cst/components/creditCsDialog.vue'),
                validateFunc: this.custCreditValidateFunc,
                initChoose: this.custCreditInitChoose,
                callback: this.custCreditCallback,
                attrs: {
                  disabled: false,
                  clearable: true
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
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'fundApplyDetailDtoList',
            label: 'fund.fundApply.tab.fundApplyDetailDtoList',
            component: () => import('./fundApplyDetailDtoList.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'fundApplyPaymentDtoList',
            label: 'fund.fundApply.tab.fundApplyPaymentDtoList',
            component: () => import('./fundApplyPaymentDtoList.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'fundAdvApplyDtoList',
            label: 'fund.fundApply.tab.fundAdvApplyDtoList',
            component: () => import('./fundAdvApplyDtoList.vue')
          }
        ]
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
    custCreditValidateFunc() {
      var customerNo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('fund.fundApply.form.customerNo') }))
        return false
      }
      return true
    },
    custCreditCallback(result) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.custCreditNo = result.custCreditNo
    },
    custCreditInitChoose() {
      return {
        billNo: {
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyNo
        },
        custCode: {
          disabled: true,
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo
        }
      }
    },
    // 上级数据查询返回
    handlePreCallback(param) {
      if (this.$route.params.preBillType === 'FUND_CLAIM') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyType'] = 'RA'
        this.claimNoCallback(param)
        this.applyTypeChange('RA', true)
      }
      if (this.$route.params.preBillType === 'CON_PL_INFO') {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyDetailDtoList[0].addTableData(param)
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        editForm.customerNo = this.$route.params.supplierCode
      }
    },
    // 初始化回调
    handleInitCallback(param) {
      // 初始化时，设置为true，防止接口返回快慢导致下方详细数据被刷新
      this.applyTypeChange(param.applyType, true)
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
    // 客户change事件
    customerNoChange(val) {
      this.clearContractInfo()
      this.clearClaimInfo()
      this.clearApplyDetailInfo()
      this.getAdvApplyInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 申请类型change事件
    applyTypeChange(val, isInit) {
      if (val === 'A') {
        // 预付款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'contractNo') info.isShow = true
          if (info.prop === 'claimNo') info.isShow = false
          if (info.prop === 'applyAmount') info.attrs.disabled = false
          if (info.prop === 'currency') info.attrs.disabled = false
        })
        this.edit.tables.forEach(table => {
          if (table.name === 'fundApplyDetailDtoList') table.isShow = false
        })
        this.clearClaimInfo(isInit)
        this.clearApplyDetailInfo(isInit)
      }
      if (val === 'RA') {
        // 退预收款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'contractNo') info.isShow = false
          if (info.prop === 'claimNo') info.isShow = true
          if (info.prop === 'applyAmount') info.attrs.disabled = false
          if (info.prop === 'currency') info.attrs.disabled = true
        })
        this.edit.tables.forEach(table => {
          if (table.name === 'fundApplyDetailDtoList') table.isShow = false
        })
        this.clearContractInfo(isInit)
        this.clearApplyDetailInfo(isInit)
      }
      if (val === 'LOT') {
        // 批次款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = true
          if (info.prop === 'contractNo') info.isShow = false
          if (info.prop === 'claimNo') info.isShow = false
          if (info.prop === 'applyAmount') info.attrs.disabled = true
          if (info.prop === 'currency') info.attrs.disabled = false
        })
        this.edit.tables.forEach(table => {
          if (table.name === 'fundApplyDetailDtoList') table.isShow = true
        })
        this.clearContractInfo(isInit)
        this.clearClaimInfo(isInit)
        this.clearApplyDetailInfo(isInit)
      }
    },
    // 业务类别change事件
    businessTypeChange(val) {
      this.clearApplyDetailInfo()
    },
    // 选择合同验证
    contractNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('fund.fundApply.form.customerNo') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('biz.lbl.bizOrganName') }))
        return false
      }
      return true
    },
    // 选择合同弹框初始化
    contractNoInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        supplierCode: {
          disabled: true,
          value: this.getEditFormPropVal('customerNo')
        },
        bizOrganCode: {
          disabled: true,
          value: this.getEditFormPropVal('bizOrganCode')
        }
      }
    },
    // 选择合同回调函数
    contractNoCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = param.contractNo
    },
    // 选择预收款验证
    claimNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('fund.fundApply.form.customerNo') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('biz.lbl.bizOrganName') }))
        return false
      }
      return true
    },
    // 选择预收款弹框初始化
    claimNoInitChoose() {
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
        }
      }
    },
    // 选择预收款回调函数
    claimNoCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['claimNo'] = param.claimNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyAmount'] = (Number(param.claimAmount) - Number(param.usedAmount)).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
    },
    // 申请金额change事件
    applyAmountChange(val) {
      var fundApplyPaymentDtoList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyPaymentDtoList[0].$refs.tab.tableData
      fundApplyPaymentDtoList.forEach((fundApplyPaymentDto, index) => {
        fundApplyPaymentDto.applyAmount = ((Number(val) * Number(fundApplyPaymentDto.paymentRate)) / 100).toFixed(2)
      })
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyPaymentDtoList[0].$refs.tab.tableData = fundApplyPaymentDtoList
    },
    // 付款方式change事件
    paymentTypeChange(vals) {
      var fundApplyPaymentDtoList = []
      if (vals.length > 0) {
        var paymentRate = (Number(100) / Number(vals.length)).toFixed(2)
        vals.forEach((val, index) => {
          var fundApplyPaymentDto = {}
          fundApplyPaymentDto.paymentType = val
          if (index === vals.length - 1) {
            paymentRate = (Number(100) - (Number(paymentRate) * index).toFixed(2)).toFixed(2)
          }
          fundApplyPaymentDto.paymentRate = paymentRate
          fundApplyPaymentDto.applyAmount = ((Number(this.getEditFormPropVal('applyAmount')) * Number(paymentRate)) / 100).toFixed(2)
          fundApplyPaymentDto.remark = ''
          fundApplyPaymentDtoList.push(fundApplyPaymentDto)
        })
      }
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyPaymentDtoList[0].$refs.tab.tableData = fundApplyPaymentDtoList
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearContractInfo()
      this.clearClaimInfo()
      this.clearApplyDetailInfo()
    },
    // 清空采购合同信息
    clearContractInfo(isInit) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = ''
      if (!isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyAmount'] = ''
      }
    },
    // 清空预收款认领信息
    clearClaimInfo(isInit) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['claimNo'] = ''
      if (!isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyAmount'] = ''
      }
    },
    // 清空申请详细信息
    clearApplyDetailInfo(isInit) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyDetailDtoList[0] && !isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyDetailDtoList[0].$refs.tab.tableData = []
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyAmount'] = ''
      }
    },
    // 根据客户编号查询相关预付款申请信息
    getAdvApplyInfo() {
      // 客户编号
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo) {
        request({
          url: '/api/fund/apply/listAdvApplyByCustomerNo',
          method: 'POST',
          data: {
            data: customerNo,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
        })
          .then(response => {
            this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundAdvApplyDtoList[0].$refs.tab.tableData = response.data
          })
          .catch(() => {
            this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundAdvApplyDtoList[0].$refs.tab.tableData = []
          })
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundAdvApplyDtoList[0].$refs.tab.tableData = []
      }
    },
    // 获取属性值
    getEditFormPropVal(prop, dtokey) {
      if (dtokey) {
        return this.$refs.qmEdit.$refs.qmRouteEdit.editForm[dtokey][prop]
      } else {
        return this.$refs.qmEdit.$refs.qmRouteEdit.editForm[prop]
      }
    }
  }
}
</script>
