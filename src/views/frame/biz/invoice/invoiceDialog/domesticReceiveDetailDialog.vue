<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('invoice.domesticInvoiceReceive.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'invoice.domesticInvoiceReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'invoice.domesticInvoiceReceive.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.list.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.list.invoiceName',
            prop: 'invoiceName',
            element: 'input-validate',
            attrs: {
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
          },
          {
            prop: 'claimStatusNe',
            default: '2',
            isShow: false
          },
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          }
        ],
        mainData: {
          api: {
            search: '/api/invoice/domReceDetail/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'invoiceDate.asc, receiveNo.asc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              // 单据号
              {
                label: 'invoice.domesticInvoiceReceive.list.receiveNo',
                prop: 'receiveNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票号
              {
                label: 'invoice.domesticInvoiceReceive.list.invoiceNo',
                prop: 'invoiceNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票日期
              {
                label: 'invoice.domesticInvoiceReceive.list.invoiceDate',
                prop: 'invoiceDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 供应商
              {
                label: 'invoice.domesticInvoiceReceive.list.customerName',
                prop: 'customerName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              // 商品
              {
                label: 'invoice.domesticInvoiceReceive.list.productCode',
                prop: 'productName',
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 发票名称
              {
                label: 'invoice.domesticInvoiceReceive.list.invoiceName',
                prop: 'invoiceName',
                width: 100,
                align: 'left',
                sortable: 'custom'
              },
              // 发票数量
              {
                label: 'invoice.domesticInvoiceReceive.list.invoiceQuantity',
                prop: 'invoiceQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 不含税价格
              {
                label: 'invoice.domesticInvoiceReceive.list.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                format: {
                  func: 'exprice'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 不含税金额
              {
                label: 'invoice.domesticInvoiceReceive.list.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 税率
              {
                label: 'invoice.domesticInvoiceReceive.list.taxRate',
                prop: 'taxRate',
                format: {
                  func: 'taxrate'
                },
                width: 100,
                align: 'right',
                sortable: 'custom'
              },
              // 税额
              {
                label: 'invoice.domesticInvoiceReceive.list.taxAmount',
                prop: 'taxAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 含税价格
              {
                label: 'invoice.domesticInvoiceReceive.list.includeTaxPrice',
                prop: 'includeTaxPrice',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 含税金额
              {
                label: 'invoice.domesticInvoiceReceive.list.includeTaxAmount',
                prop: 'includeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 币种
              {
                label: 'invoice.domesticInvoiceReceive.list.currency',
                prop: 'currency',
                format: {
                  dict: this.$t('datadict.currency')
                },
                width: 80,
                align: 'center',
                sortable: 'custom'
              },
              // 认领数量
              {
                label: 'invoice.domesticInvoiceReceive.list.claimQuantity',
                prop: 'claimQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 认领状态
              {
                label: 'invoice.domesticInvoiceReceive.list.claimStatus',
                prop: 'claimStatus',
                format: {
                  dict: this.$t('datadict.claimStatus')
                },
                width: 100,
                align: 'center',
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
