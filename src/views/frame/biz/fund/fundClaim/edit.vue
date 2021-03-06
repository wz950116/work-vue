<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'fundClaimEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            FUND_RECEIVE: '/api/fund/receive/get',
            FUND_RECEIVE_CLAIM_CHECK: '/api/fund/receive/get',
            CON_SL_INFO: '/api/contract/slProductDetail/listChoosePurchaseSaleForFund'
          },
          view: '/api/fund/claim/get',
          save: '/api/fund/claim/save',
          update: '/api/fund/claim/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          pre(param) {
            if (param.preBillType === 'CON_SL_INFO') {
              return {
                lotNo: param.preBillNo,
                customerNo: param.supplierCode
              }
            } else {
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
                billNo: data.claimNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectFundReceive',
            isShow: ['add'],
            event: 'set',
            component: () => import('../dialog/fundReceiveDialog.vue'),
            initChoose: this.selectFundReceiveInitChoose,
            callback: this.selectFundReceiveCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fund.fundClaim.group.editPart1',
            content: [
              // 认领单号
              {
                label: 'fund.fundClaim.form.claimNo',
                prop: 'claimNo',
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
              // 认领日期
              {
                type: 'date',
                label: 'fund.fundClaim.form.claimDate',
                prop: 'claimDate',
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
                label: 'fund.fundClaim.form.customerNo',
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
                  disabled: true,
                  clearable: true
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 收款单号
              {
                label: 'fund.fundClaim.form.receiveNo',
                prop: 'receiveNo',
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
              // 收款方式
              {
                label: 'fund.fundClaim.form.receiveType',
                prop: 'receiveType',
                element: 'base-select',
                list: this.$t('datadict.settlementType'),
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
              {},
              {},
              // 认领类型
              {
                label: 'fund.fundClaim.form.claimType',
                prop: 'claimType',
                element: 'base-select',
                list: this.$t('datadict.fundClaimType'),
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
                event: this.claimTypeChange
              },
              // 业务类别
              {
                label: 'fund.fundClaim.form.businessType',
                prop: 'businessType',
                element: 'base-select',
                list: this.$t('datadict.fundClaimBusinessType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'S',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: true,
                event: this.businessTypeChange
              },
              // 合同号
              {
                label: 'fund.fundClaim.form.contractNo',
                prop: 'contractNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/spot/components/chooseContractInfoSc.vue'),
                validateFunc: this.contractNoValidateFunc,
                initChoose: this.contractNoInitChoose,
                callback: this.contractNoCallback,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: false
              },
              // 预付款单号
              {
                label: 'fund.fundClaim.form.applyNo',
                prop: 'applyNo',
                element: 'base-dialog-select',
                component: () => import('../dialog/fundAdvApplyDialog.vue'),
                validateFunc: this.applyNoValidateFunc,
                initChoose: this.applyNoInitChoose,
                callback: this.applyNoCallback,
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
              // 认领金额
              {
                label: 'fund.fundClaim.form.claimAmount',
                prop: 'claimAmount',
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
                label: 'fund.fundClaim.form.currency',
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
                  disabled: false,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'fundClaimDetailDtoList',
            label: 'fund.fundClaim.tab.fundClaimDetailDtoList',
            component: () => import('./fundClaimDetailDtoList.vue'),
            required: true
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
    // 上级数据查询返回
    handlePreCallback(param) {
      if (this.$route.params.preBillType === 'CON_SL_INFO') {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundClaimDetailDtoList[0].addTableData(param)
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        editForm.customerNo = this.$route.params.customerCode
      } else {
        this.selectFundReceiveCallback(param)
      }
    },
    // 初始化回调
    handleInitCallback(param) {
      // 初始化时，设置为true，防止接口返回快慢导致下方详细数据被刷新
      this.claimTypeChange(param.claimType, true)
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
    // 选择收款登记弹框初始化
    selectFundReceiveInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        typeCodeList: {
          disabled: true,
          value: ['1', '2', '12']
        }
      }
    },
    // 选择收款登记回调函数
    selectFundReceiveCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param.customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveNo'] = param.receiveNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveType'] = param.receiveType
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      this.clearContractInfo()
      this.clearApplyInfo()
      this.clearClaimDetailInfo()
    },
    // 客户change事件
    customerNoChange(val) {
      this.clearReceiveInfo()
      this.clearContractInfo()
      this.clearApplyInfo()
      this.clearClaimDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 认领类型change事件
    claimTypeChange(val, isInit) {
      if (val === 'A') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'fleAttachment'
        // 预收款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'contractNo') info.isShow = true
          if (info.prop === 'applyNo') info.isShow = false
          if (info.prop === 'claimAmount') info.attrs.disabled = false
        })
        this.edit.tabs.forEach(tab => {
          if (tab.name === 'fundClaimDetailDtoList') tab.isShow = false
        })
        this.clearApplyInfo(isInit)
        this.clearClaimDetailInfo(isInit)
      }
      if (val === 'RA') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'fleAttachment'
        // 退预收款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'contractNo') info.isShow = false
          if (info.prop === 'applyNo') info.isShow = true
          if (info.prop === 'claimAmount') info.attrs.disabled = false
        })
        this.edit.tabs.forEach(tab => {
          if (tab.name === 'fundClaimDetailDtoList') tab.isShow = false
        })
        this.clearContractInfo(isInit)
        this.clearClaimDetailInfo(isInit)
      }
      if (val === 'LOT') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'fundClaimDetailDtoList'
        // 批次款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = true
          if (info.prop === 'contractNo') info.isShow = false
          if (info.prop === 'applyNo') info.isShow = false
          if (info.prop === 'claimAmount') info.attrs.disabled = true
        })
        this.edit.tabs.forEach(tab => {
          if (tab.name === 'fundClaimDetailDtoList') tab.isShow = true
        })
        this.clearContractInfo(isInit)
        this.clearApplyInfo(isInit)
        this.clearClaimDetailInfo(isInit)
      }
    },
    // 业务类别change事件
    businessTypeChange(val) {
      this.clearClaimDetailInfo()
    },
    // 选择合同验证
    contractNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 选择合同弹框初始化
    contractNoInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        customerCode: {
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
    // 选择预付款验证
    applyNoValidateFunc() {
      var customerNo = this.getEditFormPropVal('customerNo')
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      var bizOrganCode = this.getEditFormPropVal('bizOrganCode')
      if (bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 选择预付款弹框初始化
    applyNoInitChoose() {
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
    // 选择预付款回调函数
    applyNoCallback(param) {
      if (param.currency !== this.getEditFormPropVal('currency')) {
        this.$notify(
          notifyInfo({
            msg: this.$t('预付款申请与收款登记币种不一致，请重新选择')
          })
        )
        return
      }
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = param.applyNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['claimAmount'] = (Number(param.confirmAmount) - Number(param.usedAmount)).toFixed(2)
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearReceiveInfo()
      this.clearContractInfo()
      this.clearApplyInfo()
      this.clearClaimDetailInfo()
    },
    // 清空收款登记信息
    clearReceiveInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveType'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
    },
    // 清空销售合同信息
    clearContractInfo(isInit) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = ''
      if (!isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['claimAmount'] = ''
      }
    },
    // 清空预付款申请信息
    clearApplyInfo(isInit) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['applyNo'] = ''
      if (!isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['claimAmount'] = ''
      }
    },
    // 清空认领详细信息
    clearClaimDetailInfo(isInit) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundClaimDetailDtoList[0] && !isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundClaimDetailDtoList[0].$refs.tab.tableData = []
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
