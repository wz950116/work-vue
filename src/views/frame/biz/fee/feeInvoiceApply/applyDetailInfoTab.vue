<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow='handleDelete'></qm-edit-tab>
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
          search: '/api/fee/invoiceApplyDetail/listByApplyNo'
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
            type: 'dialog',
            i18n: 'biz.btn.selectFeeSettleDetail',
            component: () => import('@/views/frame/biz/fee/dialog/chooseFeeSettleFeeDetailForInvoice.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd
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
            // 费用结算单据号
            {
              label: 'fee.feeInvoiceApply.list.settleNo',
              prop: 'settleNo',
              width: 200,
              align: 'left'
            },
            // 费用结算明细单据号
            {
              label: 'fee.feeInvoiceApply.list.settleDetailNo',
              prop: 'settleDetailNo',
              width: 200,
              align: 'left'
            },
            // 费用方向
            {
              label: 'fee.feeInvoiceApply.list.feeDirection',
              prop: 'feeDirection',
              format: {
                dict: this.$t('datadict.feeDirection')
              },
              width: 100,
              align: 'center'
            },
            // 费用名称
            {
              label: 'fee.feeInvoiceApply.list.feeNameCode',
              prop: 'feeNameCode',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                disabled: true,
                clearable: true
              },
              width: 120,
              align: 'left'
            },
            // 申请数量
            {
              label: 'fee.feeInvoiceApply.list.applyQuantity',
              prop: 'applyQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'right',
              event: this.onApplyQuantityChange
            },
            // 含税价格
            {
              label: 'fee.feeInvoiceApply.list.includeTaxPrice',
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
              label: 'fee.feeInvoiceApply.list.includeTaxAmount',
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
              label: 'fee.feeInvoiceApply.list.taxRate',
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
              label: 'fee.feeInvoiceApply.list.taxAmount',
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
              label: 'fee.feeInvoiceApply.list.excludeTaxPrice',
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
              label: 'fee.feeInvoiceApply.list.excludeTaxAmount',
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
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.customerNo) {
        this.$notify(notifyInfo({ msg: this.$t('请选择服务商') }))
        return false
      }
      if (!this.editForm.currency) {
        this.$notify(notifyInfo({ msg: this.$t('请选择币种') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 点击增行弹窗初始化
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        customerNo: {
          disabled: true,
          value: this.editForm.customerNo
        },
        feeDirection: {
          disabled: true,
          value: '1'
        },
        currency: {
          disabled: true,
          value: this.editForm.currency
        },
        bizOrganCode: {
          disabled: true,
          value: this.editForm.bizOrganCode
        }
      }
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['settleNo'] = row.settleNo
        this.$refs.tab.tableData[_index]['settleDetailNo'] = row.settleFeeDetailNo
        this.$refs.tab.tableData[_index]['feeDirection'] = row.feeDirection
        this.$refs.tab.tableData[_index]['feeNameCode'] = row.feeNameCode
        this.$refs.tab.tableData[_index]['applyQuantity'] = row.feeQuantity
        this.$refs.tab.tableData[_index]['excludeTaxPrice'] = row.excludeTaxPrice
        this.$refs.tab.tableData[_index]['excludeTaxAmount'] = row.excludeTaxAmount
        this.$refs.tab.tableData[_index]['taxRate'] = row.taxRate
        this.$refs.tab.tableData[_index]['taxAmount'] = row.taxAmount
        this.$refs.tab.tableData[_index]['includeTaxPrice'] = row.includeTaxPrice
        this.$refs.tab.tableData[_index]['includeTaxAmount'] = row.includeTaxAmount
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.settleNo + v.settleDetailNo
            })
            .includes(row.settleNo + row.settleDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDelete() {
      this.sumApplyAmount()
    },
    // 申请数量change事件
    onApplyQuantityChange(param) {
      const row = param.row
      // // (数量、单价可改，金额不可改)数量修改影响含税金额、税额、不含税金额、不含税单价
      // row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.applyQuantity)).toFixed(2)
      // row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      // row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      // if (Number(row.applyQuantity) !== 0) {
      //   row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      // } else {
      //   row.excludeTaxPrice = '0'
      // }
      // (数量、金额可改，单价不可改)数量修改影响含税单价、不含税单价
      if (Number(row.applyQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.includeTaxPrice = '0'
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 含税单价change事件
    onIncludeTaxPriceChange(param) {
      const row = param.row
      // 含税单价修改，影响含税金额、税额、不含税金额、不含税单价
      row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.applyQuantity)).toFixed(2)
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 含税金额change事件
    onIncludeTaxAmountChange(param) {
      const row = param.row
      // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.applyQuantity)).toFixed(2)
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.includeTaxPrice = '0'
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 税率change事件
    onTaxRateChange(param) {
      const row = param.row
      // 税率修改，影响税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 计算合计信息
    sumApplyAmount() {
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
