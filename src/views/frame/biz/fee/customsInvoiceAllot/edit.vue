<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'customsInvoiceAllotEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            CUSTOMS_INVOICE_ALLOT_CHECK: '/api/fee/customsInvoiceDetail/get'
          },
          view: '/api/fee/customsInvoiceAllot/get',
          save: '/api/fee/customsInvoiceAllot/save',
          update: '/api/fee/customsInvoiceAllot/update'
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
            name: 'biz.btn.selectCustomsInvoice',
            isShow: ['add'],
            event: 'set',
            component: () => import('@/views/frame/biz/fee/customsInvoice/customsInvoiceDetailDialog.vue'),
            initChoose: this.selectCustomsInvoiceInitChoose,
            callback: this.selectCustomsInvoiceCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fee.customsInvoiceAllot.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fee.customsInvoiceAllot.form.allotNo',
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
                label: 'fee.customsInvoiceAllot.form.allotDate',
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
              // 发票号
              {
                label: 'fee.customsInvoiceAllot.form.invoiceNo',
                prop: 'invoiceNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 海关
              {
                label: 'fee.customsInvoiceAllot.form.customsNo',
                prop: 'customsNo',
                element: 'base-select',
                attrs: {
                  data: 'DD_CUSTOMS',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 商品
              {
                label: 'fee.customsInvoiceAllot.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                attrs: {
                  data: 'DD_PRODUCT',
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 科目
              {
                label: 'fee.customsInvoiceAllot.form.customsInvoiceType',
                prop: 'customsInvoiceType',
                element: 'base-select',
                list: this.$t('datadict.feeTypeCustoms'),
                attrs: {
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              // 合同
              {
                label: 'fee.customsInvoiceAllot.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              // 分摊数量
              {
                label: 'fee.customsInvoiceAllot.form.allotQuantity',
                prop: 'allotQuantity',
                element: 'input-formatter',
                attrs: {
                  type: 'weight',
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
                label: 'fee.customsInvoiceAllot.form.taxAmount',
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
              // 税率
              {
                label: 'fee.customsInvoiceAllot.form.taxRate',
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
              // 币种
              {
                label: 'fee.customsInvoiceAllot.form.currency',
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
            name: 'customsInvoiceAllotDeDtoList',
            label: 'fee.customsInvoiceAllot.tab.customsInvoiceAllotDetailInfoTab',
            component: () => import('./customsInvoiceAllotDetailTab.vue'),
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
    // 选择海关发票弹框初始化
    selectCustomsInvoiceInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        allotStatusNe: {
          value: '2'
        }
      }
    },
    // 上级数据查询返回
    handlePreCallback(param) {
      this.selectCustomsInvoiceCallback(param)
    },
    // 选择海关发票回调函数
    selectCustomsInvoiceCallback(param) {
      // 海关
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customsNo'] = param.customsNo
      // 商品
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['productCode'] = param.productCode
      // 发票号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['invoiceNo'] = param.invoiceNo
      // 科目
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customsInvoiceType'] = param.customsInvoiceType
      // 合同号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = param.contractNo
      // 税额
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = param.taxAmount
      // 税额单价
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxPrice'] = param.taxPrice
      // 税率
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxRate'] = param.taxRate
      // 币种
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      // 机构
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      // 海关发票单据号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customsInvoiceNo'] = param.customsInvoiceNo
      // 海关发票单据详细号
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customsInvoiceDetailNo'] = param.customsInvoiceDetailNo
      // 发票日期
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['invoiceDate'] = param.invoiceDate
      // 税额单价
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxPrice'] = param.taxPrice
      // 清空海关发票分摊详细信息
      this.customsInvoiceAllotDetailInfo()
    },

    // 清空海关发票分摊详细信息
    customsInvoiceAllotDetailInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.customsInvoiceAllotDeDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
