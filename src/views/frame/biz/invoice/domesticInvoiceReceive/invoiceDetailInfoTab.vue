<template>
  <qm-edit-tab ref='tab' :tab='tab' @deleteRow='handleDeleteRow'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/invoice/domReceDetail/listByReceiveNo'
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
              label: 'invoice.domesticInvoiceReceive.list.productCode',
              prop: 'productCode',
              element: 'base-select',
              attrs: {
                data: 'DD_PRODUCT',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'left',
              required: true,
              event: this.productCodeChange
            },
            // 发票名称
            {
              label: 'invoice.domesticInvoiceReceive.list.invoiceName',
              prop: 'invoiceName',
              element: 'input-validate',
              attrs: {
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'left',
              required: true
            },
            // 发票数量
            {
              label: 'invoice.domesticInvoiceReceive.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.invoiceQuantityChange
            },
            // 不含税价格
            {
              label: 'invoice.domesticInvoiceReceive.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'exprice',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 不含税金额
            {
              label: 'invoice.domesticInvoiceReceive.list.excludeTaxAmount',
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
              label: 'invoice.domesticInvoiceReceive.list.taxRate',
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
              label: 'invoice.domesticInvoiceReceive.list.taxAmount',
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
              label: 'invoice.domesticInvoiceReceive.list.includeTaxPrice',
              prop: 'includeTaxPrice',
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
            // 含税金额
            {
              label: 'invoice.domesticInvoiceReceive.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.includeTaxAmountChange
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
    // 商品change事件
    productCodeChange(param) {
      const row = param.row
      if (row.productCode) {
        request({
          url: '/api/dd/product/get',
          method: 'POST',
          data: {
            data: row.productCode,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
        }).then(response => {
          row.invoiceName = response.data.productName
        }).catch(() => {
          row.invoiceName = ''
        })
      } else {
        row.invoiceName = ''
      }
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
      if (Number(row.invoiceQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
      } else {
        row.includeTaxPrice = '0'
      }
      this.sumDetail()
    },
    // 含税金额change事件
    includeTaxAmountChange(param) {
      const row = param.row
      row.includeTaxAmount = param.val.replace(/,/g, '')
      // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
        row.includeTaxPrice = '0'
      }
      this.sumDetail()
    },
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
