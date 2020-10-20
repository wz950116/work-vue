<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.feeInvoice.popup.list'),
        initChooseParam: this.initChooseParam,
        formData: [
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          },
          {
            prop: 'claimStatusNe',
            default: '2',
            isShow: false
          },
          {
            type: 'date',
            label: 'fee.feeInvoice.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeInvoice.form.feeInvoiceNo',
            prop: 'feeInvoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeInvoice.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },

          {
            label: 'fee.feeInvoice.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          }
        ],
        mainData: {
          api: {
            search: '/api/fee/feeInvoiceDetail/listUnion'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'invoiceDate.desc, feeInvoiceNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                prop: 'auditStatus',
                width: '80',
                align: 'center',
                label: 'biz.lbl.auditStatus',
                format: {
                  dict: this.$t('datadict.auditStatus')
                }
              },
              // 单据号
              {
                label: 'fee.feeInvoice.list.feeInvoiceNo',
                prop: 'feeInvoiceNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 明细单据号
              {
                label: 'fee.feeInvoice.list.feeInvoiceDetailNo',
                prop: 'feeInvoiceDetailNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票号
              {
                label: 'fee.feeInvoice.list.invoiceNo',
                prop: 'invoiceNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票日期
              {
                label: 'fee.feeInvoice.list.invoiceDate',
                prop: 'invoiceDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 服务商
              {
                label: 'fee.feeInvoice.list.customerName',
                prop: 'customerName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              // 费用类型
              {
                label: 'fee.feeInvoice.list.feeType',
                prop: 'feeName',
                width: 100,
                align: 'center'
              },
              // 商品
              {
                label: 'fee.feeInvoice.list.productCode',
                prop: 'productCode',
                attrs: {
                  data: 'DD_PRODUCT'
                },
                width: 120,
                align: 'left'
              },
              // 发票数量
              {
                label: 'fee.feeInvoice.list.invoiceQuantity',
                prop: 'invoiceQuantity',
                attrs: {
                  type: 'weight'
                },
                width: 150,
                align: 'right'
              },
              // 不含税价格
              {
                label: 'fee.feeInvoice.list.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                attrs: {
                  type: 'exprice'
                },
                width: 150,
                align: 'right'
              },
              // 不含税金额
              {
                label: 'fee.feeInvoice.list.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                attrs: {
                  type: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 税率
              {
                label: 'fee.feeInvoice.list.taxRate',
                prop: 'taxRate',
                format: {
                  func: 'taxrate'
                },
                width: 100,
                align: 'right'
              },
              // 税额
              {
                label: 'fee.feeInvoice.list.taxAmount',
                prop: 'taxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 含税价格
              {
                label: 'fee.feeInvoice.list.includeTaxPrice',
                prop: 'includeTaxPrice',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 含税金额
              {
                label: 'fee.feeInvoice.list.includeTaxAmount',
                prop: 'includeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              {
                label: 'fee.feeInvoice.list.currency',
                prop: 'currency',
                format: {
                  dict: this.$t('datadict.currency')
                },
                width: 80,
                align: 'center',
                sortable: 'custom'
              },
              // 分摊状态
              {
                label: 'fee.feeInvoice.list.allotStatus',
                prop: 'allotStatus',
                format: {
                  dict: this.$t('datadict.allotStatus')
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 分摊金额
              {
                label: 'fee.feeInvoice.list.allotAmount',
                prop: 'allotAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 剩余分摊金额
              {
                label: 'fee.feeInvoice.list.canAllotAmount',
                prop: 'canAllotAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 业务机构
              {
                prop: 'bizOrganName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              // 业务部门
              {
                prop: 'bizDeptName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              // 业务员
              {
                prop: 'bizEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              // 制单人
              {
                prop: 'optEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.optName'
              }
            ]
          }
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: false
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    // 列表是否初始化查询
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    // 列表是否支持多选
    getMultiple() {
      if (typeof this.param.multiple === 'boolean') {
        return this.param.multiple
      }
      if (typeof this.initChooseParam.multiple === 'boolean') {
        return this.initChooseParam.multiple
      }
      return this.multiple
    },
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
