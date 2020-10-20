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
          search: '/api/fee/customsInvoiceDetail/listByCustomsInvoiceNo'
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
            // 商品
            {
              label: 'fee.customsInvoice.list.productCode',
              prop: 'productCode',
              element: 'base-select',
              attrs: {
                data: 'DD_PRODUCT',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'left',
              required: true
            },
            // 发票数量
            {
              label: 'fee.customsInvoice.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 税额
            {
              label: 'fee.customsInvoice.list.taxAmount',
              prop: 'taxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.taxAmountChange
            },
            // 税率
            {
              label: 'fee.customsInvoice.list.taxRate',
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
            // 完税价格
            {
              label: 'fee.customsInvoice.list.dutyPayingValue',
              prop: 'dutyPayingValue',
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
    // 税额change事件
    taxAmountChange(param) {
      const row = param.row
      // 税额修改，影响影响完税价格
      if (Number(row.taxRate) !== 0) {
        row.dutyPayingValue = (Number(row.taxAmount) / Number(row.taxRate) * 100).toFixed(2)
      } else {
        row.dutyPayingValue = '0'
      }
      this.sumDetail()
    },
    // 税率change事件
    taxRateChange(param) {
      const row = param.row
      // 税率修改，影响完税价格
      if (Number(row.taxRate) !== 0) {
        row.dutyPayingValue = (Number(row.taxAmount) / Number(row.taxRate) * 100).toFixed(2)
      } else {
        row.dutyPayingValue = '0'
      }
      this.sumDetail()
    },
    // 计算合计信息
    sumDetail() {
      var taxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        taxAmount = (Number(taxAmount) + Number(row.taxAmount)).toFixed(2)
      })
      this.editForm.taxAmount = taxAmount + ''
    }
  }
}
</script>
