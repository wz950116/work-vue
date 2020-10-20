<template>
  <qm-edit-tab ref='tab' :tab='tab' @deleteRow='handleDeleteRow'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/fee/feeInvoiceDetail/listByFeeInvoiceNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.addRow'
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          height: 300,
          cols: [
            // 费用类型
            {
              label: 'fee.feeInvoice.list.feeType',
              prop: 'feeType',
              width: 100,
              align: 'center',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                params: {},
                filterable: true,
                disabled: false,
                clearable: true
              },
              required: true
            },
            // 商品
            {
              label: 'fee.feeInvoice.list.productCode',
              prop: 'productCode',
              element: 'base-select',
              attrs: {
                data: 'DD_PRODUCT',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'left'
            },
            // 发票数量
            {
              label: 'fee.feeInvoice.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              event: this.invoiceQuantityChange
            },
            // 不含税价格
            {
              label: 'fee.feeInvoice.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'exprice',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right'
            },
            // 不含税金额
            {
              label: 'fee.feeInvoice.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.excludeTaxAmountChange
            },
            // 税率
            {
              label: 'fee.feeInvoice.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              attrs: {
                type: 'taxrate',
                disabled: false,
                clearable: true
              },
              width: 100,
              align: 'right',
              required: true,
              event: this.taxRateChange
            },
            // 税额
            {
              label: 'fee.feeInvoice.list.taxAmount',
              prop: 'taxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 含税价格
            {
              label: 'fee.feeInvoice.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right'
            },
            // 含税金额
            {
              label: 'fee.feeInvoice.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
              // event: this.includeTaxAmountChange
            },
            // 备注
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
              attrs: {
                maxlength: 100,
                clearable: true
              },
              'min-width': 200
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // 删行触发事件
    handleDeleteRow() {
      this.sumDetail()
    },
    // 发票数量change事件
    invoiceQuantityChange(param) {
      const row = param.row
      // 数量修改影响不含税单价、含税单价
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
        row.includeTaxPrice = '0'
      }
    },
    // 不含税金额change事件
    excludeTaxAmountChange(param) {
      const row = param.row
      // 不含税金额修改，影响不含税单价、税额、含税金额、含税单价
      row.taxAmount = (Number(row.excludeTaxAmount) * Number(row.taxRate) / 100).toFixed(2)
      row.includeTaxAmount = (Number(row.excludeTaxAmount) + Number(row.taxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
        row.includeTaxPrice = '0'
      }
      this.sumDetail()
    },
    // 税率change事件
    taxRateChange(param) {
      const row = param.row
      // 税率修改，影响税额、含税金额、含税单价
      row.taxAmount = (Number(row.excludeTaxAmount) * Number(row.taxRate) / 100).toFixed(2)
      row.includeTaxAmount = (Number(row.excludeTaxAmount) + Number(row.taxAmount)).toFixed(2)
      // row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      // row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
      } else {
        row.includeTaxPrice = '0'
      }
      this.sumDetail()
    },
    // // 含税金额change事件
    // includeTaxAmountChange(param) {
    //   const row = param.row
    //   // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
    //   row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
    //   row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
    //   if (Number(row.invoiceQuantity) !== 0) {
    //     row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
    //     row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
    //   } else {
    //     row.excludeTaxPrice = '0'
    //     row.includeTaxPrice = '0'
    //   }
    //   this.sumDetail()
    // },
    // 计算合计信息
    sumDetail() {
      var excludeTaxAmount = 0
      var taxAmount = 0
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        taxAmount = (Number(taxAmount) + Number(row.taxAmount)).toFixed(2)
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
      })
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.taxAmount = taxAmount + ''
      this.editForm.includeTaxAmount = includeTaxAmount + ''
    }
  }
}
</script>
