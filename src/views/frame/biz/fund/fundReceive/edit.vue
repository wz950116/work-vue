<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'fundReceiveEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/fund/receive/get',
          save: '/api/fund/receive/save',
          update: '/api/fund/receive/update'
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
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                billNo: data.receiveNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fund.fundReceive.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fund.fundReceive.form.receiveNo',
                prop: 'receiveNo',
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
              // 收款日期
              {
                type: 'date',
                label: 'fund.fundReceive.form.receiveDate',
                prop: 'receiveDate',
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
                label: 'fund.fundReceive.form.customerNo',
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
                  clearable: true,
                  cols: 2
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
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
                },
                event: {
                  evn: this.bizDeptCodeChange
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
                },
                event: {
                  evn: this.bizEmployeeCodeChange
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
          },
          part2: {
            titleName: 'fund.fundReceive.group.editPart2',
            content: [
              // 收款方式
              {
                label: 'fund.fundReceive.form.receiveType',
                prop: 'receiveType',
                element: 'base-select',
                list: this.$t('datadict.settlementType'),
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
                event: this.receiveTypeChange
              },
              // 收款金额
              {
                label: 'fund.fundReceive.form.receiveAmount',
                prop: 'receiveAmount',
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
              // 币种
              {
                label: 'fund.fundReceive.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                default: 'CNY',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              {},
              // 收款帐号
              {
                label: 'fund.fundReceive.form.bankAccountCode',
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
                    organCode: this.$store.state.user.userOrganCode
                  },
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  changeAll: this.bankAccountCodeChangeAll
                }
              },
              // 收款银行
              {
                label: 'fund.fundReceive.form.bankCode',
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
              }
            ]
          },
          // 承兑汇票信息
          partAcc: {
            titleName: 'fund.fundReceive.group.editPartAcc',
            hidden: true,
            dtoKey: 'acceptanceReceiveDto',
            content: [
              // 票据号
              {
                label: 'acceptance.acceptanceReceive.form.acceptanceNo',
                prop: 'acceptanceNo',
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
              // 出票日期
              {
                type: 'date',
                label: 'acceptance.acceptanceReceive.form.acceptanceDate',
                prop: 'acceptanceDate',
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
                label: 'acceptance.acceptanceReceive.form.customerNo',
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
                  filterable: true,
                  disabled: true,
                  clearable: true
                }
              },
              {},
              // 票面金额
              {
                label: 'acceptance.acceptanceReceive.form.acceptanceAmount',
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
                  disabled: false,
                  clearable: true
                },
                event: {
                  change: this.changeReceiveAmount
                }
              },
              // 币种
              {
                label: 'acceptance.acceptanceReceive.form.currency',
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
                  disabled: false,
                  clearable: true
                },
                event: this.changeCurrency
              },
              // 到期日
              {
                type: 'date',
                label: 'acceptance.acceptanceReceive.form.dueDate',
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
              // 承兑银行
              {
                label: 'acceptance.acceptanceReceive.form.acceptanceBank',
                prop: 'acceptanceBank',
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
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
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
                  disabled: true,
                  clearable: true
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
                  disabled: true,
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
                  disabled: true,
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
              }
            ]
          },
          // 信用证信息
          partLc: {
            titleName: 'fund.fundReceive.group.editPartLc',
            hidden: true,
            dtoKey: 'lcReceiveDto',
            content: [
              // 信用证号
              {
                label: 'lc.lcReceive.form.letterCreditNo',
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
                label: 'lc.lcReceive.form.issueDate',
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
              // 客户
              {
                label: 'lc.lcReceive.form.customerNo',
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
                  filterable: true,
                  disabled: true,
                  clearable: true
                }
              },
              {},
              // 销售合同
              {
                label: 'lc.lcReceive.form.contractNo',
                prop: 'contractNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/spot/components/chooseContractInfoSc.vue'),
                validateFunc: this.contractNoValidateFunc,
                initChoose: this.contractNoInitChoose,
                callback: this.contractNoCallBack,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: false
                }
              },
              // 溢短装(%)
              {
                label: 'lc.lcReceive.form.moreOrLess',
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
                label: 'lc.lcReceive.form.letterCreditAmount',
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
                },
                event: {
                  change: this.changeReceiveAmount
                }
              },
              // 币种
              {
                label: 'lc.lcReceive.form.currency',
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
                  disabled: false,
                  clearable: true
                },
                event: this.changeCurrency
              },
              // 信用证类型
              {
                label: 'lc.lcReceive.form.lcType',
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
                label: 'lc.lcReceive.form.usanceDays',
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
                label: 'lc.lcReceive.form.dueDate',
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
              {},
              {
                prop: 'xinyongzhengzhanweizhi',
                isShow: true
              },
              // 开证行
              {
                label: 'lc.lcReceive.form.issuingBank',
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
                label: 'lc.lcReceive.form.adviseBank',
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
                label: 'lc.lcReceive.form.negoBank',
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
                  disabled: true,
                  clearable: true
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
                  disabled: true,
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
                  disabled: true,
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
    // 编辑初始化回调
    handleInitCallback(param) {
      this.receiveTypeChange(param.receiveType)
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
    // 收款方式change事件
    receiveTypeChange(val) {
      if (val === 'EFT') {
        // 电汇
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = true
          if (info.prop === 'bankAccountCode') info.isShow = true
          if (info.prop === 'receiveAmount') info.attrs.disabled = false
          if (info.prop === 'currency') info.attrs.disabled = false
        })
        this.edit.formData.partAcc.hidden = true
        this.edit.formData.partLc.hidden = true
      }
      if (val === 'ACCEPTANCE') {
        // 承兑汇票
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = false
          if (info.prop === 'bankAccountCode') info.isShow = false
          if (info.prop === 'receiveAmount') info.attrs.disabled = true
          if (info.prop === 'currency') info.attrs.disabled = true
        })
        this.edit.formData.partAcc.hidden = false
        this.edit.formData.partLc.hidden = true
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['customerNo'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['customerName'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['acceptanceAmount'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveAmount']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['currency'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizOrganCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizDeptCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizDeptCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizEmployeeCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizEmployeeCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['optEmployeeCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['optEmployeeCode']
      }
      if (val === 'LC') {
        // 信用证
        this.edit.formData.part2.content.forEach(info => {
          if (info.prop === 'bankCode') info.isShow = false
          if (info.prop === 'bankAccountCode') info.isShow = false
          if (info.prop === 'receiveAmount') info.attrs.disabled = true
          if (info.prop === 'currency') info.attrs.disabled = true
        })
        this.edit.formData.partAcc.hidden = true
        this.edit.formData.partLc.hidden = false
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['customerNo'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['customerName'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['letterCreditAmount'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveAmount']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['currency'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizOrganCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizDeptCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizDeptCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizEmployeeCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizEmployeeCode']
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['optEmployeeCode'] = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['optEmployeeCode']
      }
    },
    // 客户change事件
    customerNoChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['customerNo'] = val
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['customerNo'] = val
      this.clearContractInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
      editForm['lcReceiveDto']['customerName'] = item.name
      editForm['acceptanceReceiveDto']['customerName'] = item.name
    },
    // 收款金额change事件
    changeReceiveAmount(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveAmount'] = val
    },
    // 收款币种change事件
    changeCurrency(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = val
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizOrganCode'] = val
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizOrganCode'] = val
      this.clearBankInfo()
      this.clearContractInfo()
      this.changeBankAccountSelectInfo()
    },
    // 业务部门change事件
    bizDeptCodeChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizDeptCode'] = val
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizDeptCode'] = val
    },
    // 业务员change事件
    bizEmployeeCodeChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['bizEmployeeCode'] = val
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['acceptanceReceiveDto']['bizEmployeeCode'] = val
    },
    // 收款账号change事件
    bankAccountCodeChangeAll(value) {
      var oldOrganCode = this.getEditFormPropVal('bizOrganCode')
      var newOrganCode
      if (value !== '') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = value.data.bankCode
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode = value.data.organCode
        newOrganCode = value.data.organCode
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bankCode = ''
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode = ''
        newOrganCode = ''
      }
      if (oldOrganCode !== newOrganCode) {
        this.clearContractInfo()
      }
    },
    // 清空银行信息
    clearBankInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankAccountCode'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bankCode'] = ''
    },
    // 改变收款帐号下拉框
    changeBankAccountSelectInfo() {
      this.edit.formData.part2.content.forEach(info => {
        if (info.prop === 'bankAccountCode') info.attrs.params = { organCode: this.getEditFormPropVal('bizOrganCode') }
      })
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
    contractNoCallBack(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['contractNo'] = param.contractNo
    },
    // 信用证类型change事件
    lcTypeChange(val) {
      if (val === 'SIGHT') {
        this.edit.formData.partLc.content.forEach(info => {
          if (info.prop === 'usanceDays') info.isShow = false
          if (info.prop === 'xinyongzhengzhanweizhi') info.isShow = true
        })
      } else {
        this.edit.formData.partLc.content.forEach(info => {
          if (info.prop === 'usanceDays') info.isShow = true
          if (info.prop === 'xinyongzhengzhanweizhi') info.isShow = false
        })
      }
    },
    // 清空合同信息
    clearContractInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lcReceiveDto']['contractNo'] = ''
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
