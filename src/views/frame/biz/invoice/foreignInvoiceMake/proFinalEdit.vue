<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>
<!-- 临时结算票编辑 -->
<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'makeProFinalEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/invoice/foreign/get',
          save: '/api/invoice/foreign/save',
          update: '/api/invoice/foreign/update'
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
            getParam: this.getParamAuditHistory,
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
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                billNo: data.invoiceForeignNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-临时发票选择',
            event: 'set',
            name: 'biz.btn.selectInvoice',
            component: () => import('@/views/frame/biz/invoice/invoiceDialog/invoiceMakeSelect.vue'),
            callback: this.selectCallback,
            isShow: ['add', 'update']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'invoice.foreignInvoiceMake.group.proFinalEditPart1',
            content: [
              {
                label: 'invoice.foreignInvoiceMake.form.makeNo',
                prop: 'invoiceForeignNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.invoiceNo',
                prop: 'invoiceNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              // 发票类型 临时结算
              {
                prop: 'invoiceType',
                default: 'PF',
                isShow: false
              },
              // 发票方向 开票
              {
                prop: 'invoiceDirection',
                default: 'MAKE',
                isShow: false
              },
              {
                label: 'invoice.foreignInvoiceMake.form.customerName',
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
                    typeCode: '1',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true,
                  disabled: true
                },
                event: {
                  changeAll: this.changeAllCustomerNo
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.provisionalNo',
                prop: 'prevInvoiceNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'invoice.foreignInvoiceMake.form.invoiceDate',
                prop: 'invoiceDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.invoiceAmount',
                prop: 'invoiceAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true
                  }
                ],
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.currency',
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
              {
                label: 'invoice.foreignInvoiceMake.form.provisionalAmount',
                prop: 'provisionalAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.diffAmount',
                prop: 'diffAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.loadingPlace',
                prop: 'loadingPlace',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.dischargePlace',
                prop: 'dischargePlace',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceMake.form.priceTerm',
                prop: 'priceTerm',
                element: 'base-select',
                list: this.$t('datadict.priceTerm'),
                attrs: {
                  clearable: true
                }
              },
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
                  filterable: true,
                  data: 'FUNC_ORG',
                  clearable: true
                }
              },
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
                  clearable: true
                }
              },
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
                  clearable: true
                }
              },
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
                label: 'invoice.foreignInvoiceMake.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 3,
                  clearable: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'view', 'audit'],
            name: 'invoiceForeignDetailDtoList',
            label: 'invoice.foreignInvoiceMake.tab.invoiceDetailInfoTab',
            component: () => import('./invoiceDetailInfoTab.vue'),
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
      default: 'router'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
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

    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 临时发票弹框选择关闭
    selectCallback(params) {
      if (params) {
        var invoiceDtoList = []
        invoiceDtoList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForeignDetailDtoList[0].$refs.tab.tableData
        // 客户
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo = params.customerNo
        // 客户名称
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerName = params.customerName
        // 临时单据号
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.prevInvoiceNo = params.invoiceForeignNo
        // 批次号
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lotNo = params.lotNo
        // 临时调整发票金额
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.provisionalAmount = params.invoiceAmount
        // 币种
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currency = params.currency
        invoiceDtoList.splice(0)
        var invoiceDetailList = params.invoiceForeignDetailDtoList
        invoiceDetailList.forEach((row, index) => {
          // 发票信息
          var returnInvoiceDto = {}
          returnInvoiceDto.productCode = row.productCode
          returnInvoiceDto.productName = row.productName
          returnInvoiceDto.brand = row.brand
          returnInvoiceDto.spec = row.spec
          returnInvoiceDto.origin = row.origin
          returnInvoiceDto.productKeyAttr01 = row.productKeyAttr01
          returnInvoiceDto.productKeyAttr02 = row.productKeyAttr02
          returnInvoiceDto.productKeyAttr03 = row.productKeyAttr03
          returnInvoiceDto.grossWeight = row.grossWeight
          returnInvoiceDto.netWeight = row.netWeight
          returnInvoiceDto.dryWeight = row.dryWeight
          returnInvoiceDto.invoicePrice = row.invoicePrice
          returnInvoiceDto.invoiceAmount = row.invoiceAmount
          returnInvoiceDto.prevInvoiceNo = params.invoiceForeignNo
          returnInvoiceDto.prevInvoiceAmount = row.invoiceAmount
          returnInvoiceDto.prevDetailNo = row.invoiceForeignDetailNo
          returnInvoiceDto.diffAmount = 0
          invoiceDtoList.push(returnInvoiceDto)
        })
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForeignDetailDtoList[0].$refs.tab.tableData = invoiceDtoList
      }
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.invoiceForeignNo // 变量值
      }
    }
  }
}
</script>
