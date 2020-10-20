<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'feeAllotEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            FEE_INVOICE_ALLOT_CHECK: '/api/fee/feeInvoiceDetail/get'
          },
          view: '/api/fee/feeAllot/get',
          save: '/api/fee/feeAllot/save',
          update: '/api/fee/feeAllot/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          pre(param) {
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
            isShow: ['view', 'update', 'assist', 'audit'],
            event: 'auditHistory'
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
                allotNo: data.uk || data.allotNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectFeeSettleDetail',
            isShow: ['add'],
            event: 'set',
            component: () => import('@/views/frame/biz/fee/dialog/chooseFeeSettleFeeDetailForAllot.vue'),
            initChoose: this.selectFeeSettleDetailInitChoose,
            callback: this.selectFeeSettleDetailCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fee.feeInvoiceAllot.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fee.feeAllot.form.allotNo',
                prop: 'allotNo',
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
              // 分摊日期
              {
                type: 'date',
                label: 'fee.feeAllot.form.allotDate',
                prop: 'allotDate',
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },

              // 服务商
              {
                label: 'fee.feeAllot.form.customerNo',
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
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 结算单据号
              {
                label: 'fee.feeAllot.form.settleDetailNo',
                prop: 'settleDetailNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: false
                }
              },
              // 商品
              {
                label: 'fee.feeAllot.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                attrs: {
                  data: 'DD_PRODUCT',
                  disabled: true
                },
                validate: [
                  {
                    trigger: 'change'
                  }
                ]
              },
              // 费用类型
              {
                label: 'fee.feeAllot.form.feeType',
                prop: 'feeType',
                element: 'base-select',
                attrs: {
                  data: 'DD_FEE_TYPE',
                  params: {},
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 分摊数量
              {
                label: 'fee.feeAllot.form.allotQuantity',
                prop: 'allotQuantity',
                element: 'input-formatter',
                attrs: {
                  type: 'weight',
                  disabled: true
                },
                validate: [
                  {
                    trigger: 'blur'
                  }
                ]
              },
              // 发票价格(不含税)
              {
                label: 'fee.feeAllot.form.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                element: 'input-formatter',
                attrs: {
                  type: 'exprice',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 发票金额(不含税)
              {
                label: 'fee.feeAllot.form.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                element: 'input-formatter',
                attrs: {
                  type: 'money',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 税率
              {
                label: 'fee.feeAllot.form.taxRate',
                prop: 'taxRate',
                element: 'input-formatter',
                attrs: {
                  type: 'taxrate',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 税额
              {
                label: 'fee.feeAllot.form.taxAmount',
                prop: 'taxAmount',
                element: 'input-formatter',
                attrs: {
                  type: 'money',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 发票价格(含税)
              {
                label: 'fee.feeAllot.form.includeTaxPrice',
                prop: 'includeTaxPrice',
                element: 'input-formatter',
                attrs: {
                  type: 'money',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 发票金额(含税)
              {
                label: 'fee.feeAllot.form.includeTaxAmount',
                prop: 'includeTaxAmount',
                element: 'input-formatter',
                attrs: {
                  type: 'money',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 币种
              {
                label: 'fee.feeAllot.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                attrs: {
                  disabled: true,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: true,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 业务部门
              {
                label: 'biz.lbl.bizDeptName',
                prop: 'bizDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                attrs: {
                  data: 'FUNC_DEPT',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 业务员
              {
                label: 'biz.lbl.bizEmployeeName',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
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
            name: 'feeAllotDetailDtoList',
            label: 'fee.feeAllot.tab.feeAllotDetailTab',
            component: () => import('./feeAllotDetailTab.vue'),
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
    // 上级数据查询返回
    handlePreCallback(param) {
      this.selectFeeSettleDetailCallback(param)
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
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 选择费用结算明细弹框初始化
    selectFeeSettleDetailInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        allotStatusNe: {
          value: '2'
        }
      }
    },
    // 选择费用结算明细回调函数
    selectFeeSettleDetailCallback(param) {
      // 服务商
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      // 服务商名称
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param.customerName
      // 商品
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['productCode'] = param.productCode
      // 费用类型
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['feeType'] = param.feeNameCode
      // 税额
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = ''
      // 发票价格(不含税)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxPrice'] = param.excludeTaxPrice
      // 发票价格(含税)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxPrice'] = param.includeTaxPrice
      // 发票金额(不含税)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxAmount'] = ''
      // 发票金额(含税)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxAmount'] = ''
      // 税率
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxRate'] = param.taxRate
      // 币种
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      // 机构
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      // 结算单据号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['settleNo'] = param.settleNo
      // 结算单据详细号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['settleDetailNo'] = param.settleFeeDetailNo
      // 清空费用分摊详细信息
      this.feeAllotDetailTab()
    },

    // 清空费用分摊详细信息
    feeAllotDetailTab() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeAllotDetailDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
