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
          search: '/api/fee/invoiceConfDetail/listByConfirmNo'
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
            // 费用名称
            {
              label: 'fee.feeInvoiceConfirm.list.feeNameCode',
              prop: 'feeNameCode',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                disabled: false,
                clearable: true
              },
              width: 100,
              align: 'left',
              required: true
            },
            // 发票数量
            {
              label: 'fee.feeInvoiceConfirm.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'right',
              event: this.onInvoiceQuantityChange
            },
            // 含税价格
            {
              label: 'fee.feeInvoiceConfirm.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              required: true
            },
            // 含税金额
            {
              label: 'fee.feeInvoiceConfirm.list.includeTaxAmount',
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
              event: this.onIncludeTaxAmountChange
            },
            // 税率
            {
              label: 'fee.feeInvoiceConfirm.list.taxRate',
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
              label: 'fee.feeInvoiceConfirm.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              required: true
            },
            // 不含税价格
            {
              label: 'fee.feeInvoiceConfirm.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              format: {
                func: 'exprice'
              },
              width: 120,
              align: 'right',
              required: true
            },
            // 不含税金额
            {
              label: 'fee.feeInvoiceConfirm.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 120,
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
      const feeNameCodeList = this.getFeeNameCodeList()
      this.tab.table.cols.forEach(col => {
        if (col.prop === 'feeNameCode') {
          col.list = feeNameCodeList
        }
      })
    },
    // 费用开票申请信息删除时，同步删除开票信息内有关的信息
    handleConfirmJoinDetailInfoDelete(feeNameCode) {
      const feeNameCodeList = this.getFeeNameCodeList()
      if (feeNameCodeList.map(v => { return v.value }).includes(feeNameCode)) {
        return
      }
      const newData = []
      const detailData = this.$refs.tab.tableData
      detailData.forEach(detailInfo => {
        if (detailInfo.feeNameCode !== feeNameCode) {
          newData.push(detailInfo)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 通过费用开票申请信息获取费用名称信息List
    getFeeNameCodeList() {
      const feeNameCodeList = []
      const applyData = this.$parent.$refs.feeInvoiceConfJoDetaDtoList[0].$refs.tab.tableData
      applyData.forEach(applyInfo => {
        if (!feeNameCodeList.map(v => { return v.value }).includes(applyInfo.feeNameCode)) {
          const feeNameInfo = {
            value: applyInfo.feeNameCode,
            label: ''
          }
          request({
            url: '/api/data/ddFeeType/get',
            method: 'POST',
            data: {
              data: applyInfo.feeNameCode,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search')
            }
          }).then(response => {
            feeNameInfo.label = response.data.name
          }).catch(() => {
            feeNameInfo.label = ''
          })
          feeNameCodeList.push(feeNameInfo)
        }
      })
      return feeNameCodeList
    },
    // 点击增行验证
    validateAdd() {
      if (this.$parent.$refs.feeInvoiceConfJoDetaDtoList[0].$refs.tab.tableData.length === 0) {
        this.$notify(notifyInfo({ msg: this.$t('请选择费用开票申请信息') }))
        return false
      }
      return true
    },
    // 发票数量change事件
    onInvoiceQuantityChange(param) {
      const row = param.row
      // // (数量、单价可改，金额不可改)数量修改，影响含税金额、税额、不含税金额、不含税单价
      // row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.invoiceQuantity)).toFixed(2)
      // row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      // row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      // if (Number(row.invoiceQuantity) !== 0) {
      //   row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      // } else {
      //   row.excludeTaxPrice = '0'
      // }
      // (数量、金额可改，单价不可改)数量修改影响含税单价、不含税单价
      if (Number(row.invoiceQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      } else {
        row.includeTaxPrice = '0'
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
    },
    // 含税金额change事件
    onIncludeTaxAmountChange(param) {
      const row = param.row
      // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.invoiceQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.invoiceQuantity)).toFixed(2)
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)).toFixed(6)
      } else {
        row.includeTaxPrice = '0'
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
    }
  }
}
</script>
