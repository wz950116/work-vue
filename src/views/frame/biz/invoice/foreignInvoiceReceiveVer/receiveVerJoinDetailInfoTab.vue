<template>
  <qm-edit-tab ref='tab' :tab='tab' @deleteRow='handleDelete'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/invoice/invoiceForReVerJoDe/listByVerificatNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
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
          height: 200,
          cols: [
            // 商品
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.productCode',
              prop: 'productName',
              width: 200,
              align: 'left',
              required: true
            },
            // 物资属性
            ...this.$store.state.user.mainGoodColsTxt,
            // 毛重
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.grossWeight',
              prop: 'grossWeight',
              width: '150',
              required: true,
              format: {
                func: 'weight'
              }
            },
            // 净重
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.netWeight',
              prop: 'netWeight',
              width: '150',
              required: true,
              format: {
                func: 'weight'
              }
            },
            // 干重
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.dryWeight',
              prop: 'dryWeight',
              width: '150',
              format: {
                func: 'weight'
              }
            },
            // 发票单价
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.invoicePrice',
              prop: 'invoicePrice',
              width: '150',
              required: true,
              format: {
                func: 'price'
              }
            },
            // 发票金额
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.invoiceAmount',
              prop: 'invoiceAmount',
              width: '150',
              required: true,
              format: {
                func: 'money'
              }
            },
            // 核销数量
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.verificatQuantity',
              prop: 'verificatQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onVerificatQuantityChange
            },

            // 核销金额
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.includeTaxAmount',
              prop: 'verificatAmount',
              width: 150,
              required: true,
              format: {
                func: 'money'
              }
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
    onVerificatQuantityChange(param) {
      const row = param.row
      // 核销数量修改影响核销金额
      row.verificatAmount = (Number(row.invoicePrice) * Number(param.val)).toFixed(2)
      this.sumConfirmAmount()
    },
    // 删行触发事件
    handleDelete(row) {
      this.sumConfirmAmount()
    },
    // 计算合计信息
    sumConfirmAmount() {
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.verificatAmount)).toFixed(2)
      })
      this.editForm.includeTaxAmount = includeTaxAmount + ''
    }
  }
}
</script>
