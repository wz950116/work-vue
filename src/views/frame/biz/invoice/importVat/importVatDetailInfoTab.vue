<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// 导入计算工具
import { div, add } from '@/utils/proj/calculateUtil'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/invoice/importVatDeta/get'
        },
        topBar: [{
          name: 'add',
          iconName: '线性-增行',
          isShow: ['add', 'update'],
          i18n: 'biz.btn.addRow'
        }, {
          name: 'delete',
          iconName: '线性-删行',
          isShow: ['add', 'update'],
          i18n: 'biz.btn.deleteRow'
        }],
        table: {
          cols: [{
            label: 'invoice.importVat.list.productCode',
            prop: 'productCode',
            element: 'base-select',
            width: '150',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.list.invoiceName',
            prop: 'invoiceName',
            element: 'input-validate',
            width: '150',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.list.invoiceQuantity',
            prop: 'invoiceQuantity',
            width: '150',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              type: 'weight',
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.list.taxAmount',
            prop: 'taxAmount',
            width: '150',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              type: 'money',
              clearable: true
            },
            event: this.changeAmount
          },
          {
            label: 'invoice.importVat.list.taxRate',
            prop: 'taxRate',
            width: '150',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              type: 'taxrate',
              clearable: true
            },
            event: this.changeAmount
          },
          {
            label: 'invoice.importVat.list.dutyPayingValue',
            prop: 'dutyPayingValue',
            width: '150',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true,
              type: 'price'
            }
          }]
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
    changeAmount(param) {
      if (param.row.taxAmount && param.row.taxRate) {
        var taxRate = div(param.row.taxRate, 100, 2)
        param.row.dutyPayingValue = div(param.row.taxAmount, taxRate, 2)
      } else {
        param.row.dutyPayingValue = 0
      }

      var detailList = this.$refs.tab.tableData
      var dutyPayingValueTotal = 0
      detailList.forEach((row, index) => {
        dutyPayingValueTotal = add(dutyPayingValueTotal, row.dutyPayingValue, 2)
      })

      this.editForm.taxAmount = dutyPayingValueTotal
    }
  }
}
</script>
