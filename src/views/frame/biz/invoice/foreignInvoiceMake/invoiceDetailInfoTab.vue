<template>
  <qm-edit-tab ref='tab' :tab='tab' @deleteRow='applyAmountChange'></qm-edit-tab>
</template>

<script>
// 导入计算工具
import { mul, add, sub } from '@/utils/proj/calculateUtil'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/invoice/foreignDetail/get'
        },
        topBar: [
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          cols: [
            {
              label: 'invoice.foreignInvoiceMake.list.productCode',
              prop: 'productCode',
              element: 'base-select',
              width: '150',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                data: 'DD_PRODUCT',
                disabled: true,
                clearable: true
              }
            },
            // 物资属性
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'invoice.foreignInvoiceMake.list.grossWeight',
              prop: 'grossWeight',
              width: '150',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                type: 'weight'
              }
            },
            {
              label: 'invoice.foreignInvoiceMake.list.netWeight',
              prop: 'netWeight',
              width: '150',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                type: 'weight'
              },
              event: this.changeAmount
            },
            {
              label: 'invoice.foreignInvoiceMake.list.dryWeight',
              prop: 'dryWeight',
              width: '150',
              element: 'input-formatter',
              attrs: {
                type: 'weight'
              },
              event: this.changeAmount
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoicePrice',
              prop: 'invoicePrice',
              width: '150',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                type: 'price'
              },
              event: this.changeAmount
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoiceAmount',
              prop: 'invoiceAmount',
              width: '150',
              element: 'input-formatter',
              attrs: {
                disabled: true,
                type: 'money'
              },
              required: true
            },
            {
              label: 'invoice.foreignInvoiceMake.list.prevInvoiceAmount',
              prop: 'prevInvoiceAmount',
              width: '150',
              element: 'input-formatter',
              attrs: {
                disabled: true,
                type: 'money'
              },
              isShow: this.editForm.invoiceType === 'A' || this.editForm.invoiceType === 'PF'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.diffAmount',
              prop: 'diffAmount',
              width: '150',
              element: 'input-formatter',
              attrs: {
                disabled: true,
                type: 'money'
              },
              isShow: this.editForm.invoiceType === 'A' || this.editForm.invoiceType === 'PF'
            },
            // 批次号
            {
              prop: 'lotNo',
              isShow: false
            },
            // 选择返回的批次商品编码
            {
              prop: 'lotProductDetailCode',
              isShow: false
            },
            {
              prop: 'invoiceForeignDetailNo',
              isShow: false
            },
            // 上次发票明细号
            {
              prop: 'prevDetailNo',
              isShow: false
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
      type: [Object, String],
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
      if (Number(param.row.invoicePrice) !== 0) {
        if (param.row.dryWeight === undefined || param.row.dryWeight === '' || Number(param.row.dryWeight) === 0) {
          param.row.invoiceAmount = mul(param.row.netWeight, param.row.invoicePrice, 2)
        } else {
          param.row.invoiceAmount = mul(param.row.dryWeight, param.row.invoicePrice, 2)
        }
        param.row.diffAmount = sub(param.row.invoiceAmount, param.row.prevInvoiceAmount, 2)
      } else {
        param.row.invoiceAmount = 0
        param.row.diffAmount = 0
      }

      var invoiceDetailList = this.$refs.tab.tableData
      var invoiceTotalAmount = 0
      invoiceDetailList.forEach((row, index) => {
        invoiceTotalAmount = add(invoiceTotalAmount, row.invoiceAmount, 2)
      })
      this.editForm.invoiceAmount = invoiceTotalAmount
      // 差额
      var diffAmount = 0
      diffAmount = sub(invoiceTotalAmount, this.editForm.provisionalAmount, 2)
      this.editForm.diffAmount = diffAmount + ''
    },
    // 总金额修改
    applyAmountChange(val) {
      var applyAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        applyAmount = (Number(applyAmount) + Number(row.invoiceAmount)).toFixed(2)
      })
      this.editForm.invoiceAmount = applyAmount + ''
      // 差额
      var diffAmount = 0
      diffAmount = sub(applyAmount, this.editForm.provisionalAmount, 2)
      this.editForm.diffAmount = diffAmount + ''
    }
  }
}
</script>
