<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'feeApplyEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/fee/feeApply/get',
          save: '/api/fee/feeApply/save',
          update: '/api/fee/feeApply/update'
        },
        apiData: {
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
            name: 'biz.btn.print',
            getParam(data) {
              return {
                applyNo: data.uk || data.applyNo
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
                label: 'fee.feeApplyInfo.form.applyNo',
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
                label: 'fee.feeApplyInfo.form.applyDate',
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
              // 结算单位
              {
                label: 'fee.feeApplyInfo.form.customerNo',
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
                label: 'fee.feeApplyInfo.form.applyType',
                prop: 'applyType',
                element: 'base-select',
                list: this.$t('datadict.feeApplyType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'FEE',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                event: this.applyTypeChange
              },
              // 费用认领单据号
              {
                label: 'fee.feeApplyInfo.form.claimNo',
                prop: 'claimNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/fee/dialog/feeAdvClaimDialog.vue'),
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
              // 业务类别
              {
                label: 'fee.feeApplyInfo.form.businessType',
                prop: 'businessType',
                element: 'base-select',
                list: this.$t('datadict.feeApplyBusinessType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: true,
                event: this.businessTypeChange
              },
              // 申请金额
              {
                label: 'fee.feeApplyInfo.form.applyAmount',
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
                }
              },
              // 币种
              {
                label: 'fee.feeApplyInfo.form.currency',
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

              // 最迟付款日期
              {
                type: 'date',
                label: 'fee.feeApplyInfo.form.latestPaymentDate',
                prop: 'latestPaymentDate',
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
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
            name: 'feeApplyDetailDtoList',
            label: 'fee.feeApplyInfo.tab.feeApplyDetailDtoList',
            component: () => import('./feeApplyDetailDtoList.vue'),
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
    // 选择费用收款认领验证
    claimNoValidateFunc() {
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
    // 选择费用收款认领弹框初始化
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
    customerNoChange() {
      this.clearApplyDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 申请类型change事件
    applyTypeChange(val, isInit) {
      if (val === 'A') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'fleAttachment'
        // 预付款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'claimNo') info.isShow = false
          if (info.prop === 'applyAmount') info.attrs.disabled = false
          if (info.prop === 'currency') info.attrs.disabled = false
        })
        this.edit.tabs.forEach(table => {
          if (table.name === 'feeApplyDetailDtoList') table.isShow = false
        })
        this.clearClaimInfo(isInit)
        this.clearApplyDetailInfo(isInit)
      }
      if (val === 'RA') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'fleAttachment'
        // 退预收款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = false
          if (info.prop === 'claimNo') info.isShow = true
          if (info.prop === 'applyAmount') info.attrs.disabled = false
          if (info.prop === 'currency') info.attrs.disabled = true
        })
        this.edit.tabs.forEach(table => {
          if (table.name === 'feeApplyDetailDtoList') table.isShow = false
        })
        this.clearApplyDetailInfo(isInit)
      }
      if (val === 'FEE') {
        this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'feeApplyDetailDtoList'
        // 批次款
        this.edit.formData.part1.content.forEach(info => {
          if (info.prop === 'businessType') info.isShow = true
          if (info.prop === 'claimNo') info.isShow = false
          if (info.prop === 'applyAmount') info.attrs.disabled = true
          if (info.prop === 'currency') info.attrs.disabled = false
        })
        this.edit.tabs.forEach(table => {
          if (table.name === 'feeApplyDetailDtoList') table.isShow = true
        })
        this.clearClaimInfo(isInit)
        this.clearApplyDetailInfo(isInit)
      }
    },
    // 业务类别change事件
    businessTypeChange(val) {
      this.clearApplyDetailInfo()
    },

    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.clearClaimInfo()
      this.clearApplyDetailInfo()
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
      if (this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeApplyDetailDtoList[0] && !isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeApplyDetailDtoList[0].$refs.tab.tableData = []
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
