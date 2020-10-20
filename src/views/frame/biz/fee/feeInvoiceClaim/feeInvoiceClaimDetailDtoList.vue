<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow='handleDeleteRow'></qm-edit-tab>
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
          search: '/api/fee/feeInvoiceClaimDetail/list'
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
            component: () => import('@/views/frame/biz/fee/dialog/chooseFeeSettleFeeDetail.vue'),
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
              label: 'fee.feeInvoiceClaim.detail.settleNo',
              prop: 'settleNo',
              width: 200,
              align: 'left'
            },
            // 费用结算明细单据号
            {
              label: 'fee.feeInvoiceClaim.detail.settleDetailNo',
              prop: 'settleDetailNo',
              width: 200,
              align: 'left'
            },
            // 费用方向
            {
              label: 'fee.feeInvoiceClaim.detail.feeDirection',
              prop: 'feeDirection',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              }
            },
            // 费用名称
            {
              label: 'fee.feeInvoiceClaim.detail.feeNameCode',
              prop: 'feeNameCode',
              width: 100,
              align: 'center',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                disabled: false,
                clearable: true
              },
              required: true
            },

            // 认领数量
            {
              label: 'fee.feeInvoiceClaim.detail.claimQuantity',
              prop: 'claimQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'num',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onClaimQuantityChange
            },
            // 发票价格(不含税)
            {
              label: 'fee.feeInvoiceClaim.detail.excludeTaxPrice',
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
            // 发票金额(不含税)
            {
              label: 'fee.feeInvoiceClaim.detail.excludeTaxAmount',
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
              label: 'fee.feeInvoiceClaim.detail.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              attrs: {
                type: 'taxrate',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 税额
            {
              label: 'fee.feeInvoiceClaim.detail.taxAmount',
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
            // 发票价格（含税）
            {
              label: 'fee.feeInvoiceClaim.detail.includeTaxPrice',
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
            // 发票金额（含税）
            {
              label: 'fee.feeInvoiceClaim.detail.includeTaxAmount',
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
            // 币种
            {
              label: 'fee.feeInvoiceClaim.detail.currency',
              prop: 'currency',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
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
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.customerNo) {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 点击增行弹框初始化
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
          value: '2'
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
        this.$refs.tab.tableData[_index]['excludeTaxAmount'] = row.excludeTaxAmount
        this.$refs.tab.tableData[_index]['excludeTaxPrice'] = row.excludeTaxPrice
        this.$refs.tab.tableData[_index]['includeTaxPrice'] = row.includeTaxPrice
        this.$refs.tab.tableData[_index]['includeTaxAmount'] = row.includeTaxAmount
        this.$refs.tab.tableData[_index]['taxRate'] = row.taxRate
        this.$refs.tab.tableData[_index]['taxAmount'] = row.taxAmount
        this.$refs.tab.tableData[_index]['currency'] = row.currency
        this.$refs.tab.tableData[_index]['claimQuantity'] = row.feeQuantity
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
      var claimQuantity = 0
      var excludeTaxAmount = 0
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        claimQuantity = (Number(claimQuantity) + Number(row.claimQuantity)).toFixed(2)
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
      })
      this.editForm.claimQuantity = claimQuantity + ''
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.includeTaxAmount = includeTaxAmount + ''
      this.onOtherData()
    },

    // 删行触发事件
    handleDeleteRow() {
      var claimQuantity = 0
      var excludeTaxAmount = 0
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        claimQuantity = (Number(claimQuantity) + Number(row.claimQuantity)).toFixed(2)
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
      })
      this.editForm.claimQuantity = claimQuantity + ''
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.includeTaxAmount = includeTaxAmount + ''
      this.onOtherData()
    },
    // 认领数量change事件
    onClaimQuantityChange(val) {
      if (!this.checkEvent()) {
        return
      }
      val.row.claimQuantity = val.val
      // 数量变，含税金额、不含税、税额变  不含税金额=含税金额/(1+税率)   税额=含税金额-不含税金额
      val.row.includeTaxAmount = (Number(val.row.claimQuantity) * Number(val.row.includeTaxPrice)).toFixed(2)
      val.row.excludeTaxAmount = (Number(val.row.includeTaxAmount) / (1 + Number(val.row.taxRate) / 100)).toFixed(2)
      val.row.taxAmount = (Number(val.row.includeTaxAmount) - Number(val.row.excludeTaxAmount)).toFixed(2)
      var claimQuantity = 0
      var excludeTaxAmount = 0
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        claimQuantity = (Number(claimQuantity) + Number(row.claimQuantity)).toFixed(2)
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
      })
      this.editForm.claimQuantity = claimQuantity + ''
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.includeTaxAmount = includeTaxAmount + ''
      this.onOtherData()
    },
    onIncludeTaxAmountChange(val) {
      if (!this.checkEvent()) {
        return
      }
      val.row.includeTaxAmount = val.val
      // 含税金额变，数量、不含税、税额变  不含税金额=含税金额/(1+税率)   税额=含税金额-不含税金额
      val.row.excludeTaxAmount = (Number(val.row.includeTaxAmount) / (1 + Number(val.row.taxRate) / 100)).toFixed(2)
      val.row.taxAmount = (Number(val.row.includeTaxAmount) - Number(val.row.excludeTaxAmount)).toFixed(2)
      val.row.claimQuantity = (Number(val.row.includeTaxAmount) / Number(val.row.includeTaxPrice)).toFixed(2)
      var includeTaxAmount = 0
      var excludeTaxAmount = 0
      var claimQuantity = 0
      this.$refs.tab.tableData.forEach(row => {
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        claimQuantity = (Number(claimQuantity) + Number(row.claimQuantity)).toFixed(2)
      })
      this.editForm.includeTaxAmount = includeTaxAmount + ''
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.claimQuantity = claimQuantity + ''
      this.onOtherData()
    },
    onOtherData() {
      // 不含税金额=含税金额/(1+税率)   税额=含税金额-不含税金额
      this.editForm.taxAmount = (Number(this.editForm.includeTaxAmount) - Number(this.editForm.excludeTaxAmount)).toFixed(2)
      this.editForm.includeTaxPrice = (Number(this.editForm.includeTaxAmount) / Number(this.editForm.claimQuantity)).toFixed(2)
      this.editForm.excludeTaxPrice = (Number(this.editForm.excludeTaxAmount) / Number(this.editForm.claimQuantity)).toFixed(2)
      this.editForm.taxRate = ((Number(this.editForm.includeTaxAmount) / Number(this.editForm.excludeTaxAmount) - 1) * 100).toFixed(2)
    },
    checkEvent() {
      if (event) {
        if (event.srcElement.nodeName) {
          if (event.isPurchaseSettlementTab) {
            return false
          } else {
            event.isPurchaseSettlementTab = true
            return true
          }
        } else {
          return false
        }
      }
    }
  }
}
</script>
