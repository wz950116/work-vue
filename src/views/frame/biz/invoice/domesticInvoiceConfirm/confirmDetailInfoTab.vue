<template>
  <qm-edit-tab ref='tab' :tab='tab' @addRow='handleAddRow'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/invoice/domConfDeta/listByConfirmNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          {
            name: 'add',
            isShow: ['add', 'update'],
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            validate: this.validateAdd
          },
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
              label: 'invoice.domesticInvoiceConfirm.list.productCode',
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
              label: 'invoice.domesticInvoiceConfirm.list.invoiceName',
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
              label: 'invoice.domesticInvoiceConfirm.list.invoiceQuantity',
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
              event: this.onInvoiceQuantityChange
            },
            // 不含税价格
            {
              label: 'invoice.domesticInvoiceConfirm.list.excludeTaxPrice',
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
              label: 'invoice.domesticInvoiceConfirm.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
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
            // 税率
            {
              label: 'invoice.domesticInvoiceConfirm.list.taxRate',
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
              event: this.onTaxRateChange
            },
            // 税额
            {
              label: 'invoice.domesticInvoiceConfirm.list.taxAmount',
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
              label: 'invoice.domesticInvoiceConfirm.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onIncludeTaxPriceChange
            },
            // 含税金额
            {
              label: 'invoice.domesticInvoiceConfirm.list.includeTaxAmount',
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
    // 增行
    handleAddRow() {
      const productList = this.getProductList()
      this.tab.table.cols.forEach(col => {
        if (col.prop === 'productCode') {
          col.list = productList
        }
      })
    },
    // 申请信息删除时，同步删除开票信息内有关的信息
    handleApplyInfoDelete(productCode) {
      const productList = this.getProductList()
      if (productList.map(v => { return v.value }).includes(productCode)) {
        return
      }
      const newData = []
      const detailData = this.$refs.tab.tableData
      detailData.forEach(detailInfo => {
        if (detailInfo.productCode !== productCode) {
          newData.push(detailInfo)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 通过申请信息获取商品信息List
    getProductList() {
      const productList = []
      const applyData = this.$parent.$refs.invoiceDomConfDetaJoDtoList[0].$refs.tab.tableData
      applyData.forEach(applyInfo => {
        const productInfo = {
          value: applyInfo.productCode,
          label: applyInfo.productName
        }
        if (!productList.map(v => { return v.value }).includes(productInfo.value)) {
          productList.push(productInfo)
        }
      })
      return productList
    },
    // 点击增行验证
    validateAdd() {
      if (this.$parent.$refs.invoiceDomConfDetaJoDtoList[0].$refs.tab.tableData.length === 0) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('invoice.domesticInvoiceConfirm.tab.applyDetailInfoTab') }))
        return false
      }
      return true
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
    onInvoiceQuantityChange(param) {
      const row = param.row
      // 数量修改，影响含税金额、税额、不含税金额、不含税单价
      row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.invoiceQuantity)).toFixed(2)
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
    },
    // 税率change事件
    onTaxRateChange(param) {
      const row = param.row
      // 税率修改，影响税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
    },
    // 含税价格change事件
    onIncludeTaxPriceChange(param) {
      const row = param.row
      // 含税价格修改，影响含税金额、税额、不含税金额、不含税单价
      row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.invoiceQuantity)).toFixed(2)
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
    }
  }
}
</script>
