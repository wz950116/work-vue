<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.customsInvoice.popup.list'),
        initChooseParam: this.initChooseParam,
        formData: [
          {
            type: 'date',
            label: 'fee.customsInvoice.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.customsInvoice.form.customsInvoiceNo',
            prop: 'customsInvoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.allotStatusNe',
            prop: 'allotStatusNe',
            element: 'base-select',
            attrs: {
              data: 'ALLOT_STATUS',
              clearable: true
            },
            isShow: false
          },
          {
            label: 'fee.customsInvoice.form.customsNo',
            prop: 'customsNo',
            element: 'base-select',
            attrs: {
              data: 'DD_CUSTOMS',
              params: {},
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              params: {},
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.customsInvoiceType',
            prop: 'customsInvoiceType',
            element: 'base-select',
            list: this.$t('datadict.feeTypeCustoms'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.contractNo',
            prop: 'contractNo',
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
          }
        ],
        mainData: {
          api: {
            search: '/api/fee/customsInvoiceDetail/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'invoiceDate.desc, customsInvoiceNo.desc'
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
              // 商品
              {
                label: 'fee.customsInvoice.list.productCode',
                prop: 'productName',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 单据号
              {
                label: 'fee.customsInvoice.list.customsInvoiceNo',
                prop: 'customsInvoiceNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票号
              {
                label: 'fee.customsInvoice.list.invoiceNo',
                prop: 'invoiceNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 发票日期
              {
                label: 'fee.customsInvoice.list.invoiceDate',
                prop: 'invoiceDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 海关
              {
                label: 'fee.customsInvoice.list.customsName',
                prop: 'customsName',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 科目
              {
                label: 'fee.customsInvoice.list.customsInvoiceType',
                prop: 'customsInvoiceType',
                format: {
                  dict: this.$t('datadict.feeTypeCustoms')
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 采购合同号
              {
                label: 'fee.customsInvoice.list.contractNo',
                prop: 'contractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 税额
              {
                label: 'fee.customsInvoice.list.taxAmount',
                prop: 'taxAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 完税价格
              {
                label: 'fee.customsInvoice.list.dutyPayingValue',
                prop: 'dutyPayingValue',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 发票数量
              {
                label: 'fee.customsInvoice.list.invoiceQuantity',
                prop: 'invoiceQuantity',
                format: {
                  func: 'num'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 税率
              {
                label: 'fee.customsInvoice.list.taxRate',
                prop: 'taxRate',
                format: {
                  func: 'taxrate'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 币种
              {
                label: 'fee.customsInvoice.list.currency',
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
                prop: 'allotStatus',
                width: '80',
                align: 'center',
                label: 'fee.customsInvoice.list.allotStatus',
                format: {
                  dict: this.$t('datadict.allotStatus')
                }
              },
              // 分摊数量
              {
                label: 'fee.customsInvoice.list.allotQuantity',
                prop: 'allotQuantity',
                format: {
                  func: 'num'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },

              // 剩余分摊数量
              {
                label: 'fee.customsInvoice.list.remainAllotQuantity',
                prop: 'remainAllotQuantity',
                format: {
                  func: 'num'
                },
                width: 120,
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
