<template>
  <qm-edit-tab ref='tab' :tab='tab' @deleteRow='handleDeleteRow'></qm-edit-tab>
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
          search: '/api/fee/feeDetailInfo/listByCode'
        },
        apiData: {
          search(param) {
            if (param.uk) {
              return { feeNo: param.uk }
            }
            if (param.id) {
              return param.id
            }
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
            // 费用名称
            {
              label: 'fee.feeInfo.detail.feeName',
              prop: 'feeNameCode',
              width: 100,
              align: 'left',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                disabled: false,
                clearable: true
              },
              required: true,
              changeAll: this.feeNameCodeChange
            },
            // 商品
            {
              label: 'fee.feeInfo.detail.productCode',
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
            // 费用方向
            {
              label: 'fee.feeInfo.detail.feeDirection',
              prop: 'feeDirection',
              width: 100,
              align: 'center',
              element: 'base-select',
              list: this.$t('datadict.feeDirection'),
              attrs: {
                disabled: false,
                clearable: true
              },
              required: true
            },

            // 费用数量
            {
              label: 'fee.feeInfo.detail.feeQuantity',
              prop: 'feeQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.feeQuantityChange
            },
            // 数量单位
            {
              label: 'fee.feeInfo.detail.quantityUnit',
              prop: 'quantityUnit',
              width: 100,
              align: 'center',
              element: 'base-select',
              list: this.$t('datadict.measurementUnit'),
              attrs: {
                disabled: false,
                clearable: true
              },
              required: true
            },
            // 不含税价格
            {
              label: 'fee.feeInfo.detail.excludeTaxPrice',
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
              label: 'fee.feeInfo.detail.excludeTaxAmount',
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
              label: 'fee.feeInfo.detail.taxRate',
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
              label: 'fee.feeInfo.detail.taxAmount',
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
              label: 'fee.feeInfo.detail.includeTaxPrice',
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
              label: 'fee.feeInfo.detail.includeTaxAmount',
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
            // 币种
            {
              label: 'fee.feeInfo.detail.currency',
              prop: 'currency',
              width: 100,
              align: 'center',
              element: 'base-select',
              list: this.$t('datadict.currency'),
              attrs: {
                disabled: true,
                clearable: true
              },
              required: true
            },
            {
              label: 'fee.feeInfo.detail.costFlag',
              prop: 'costFlag',
              element: 'el-checkbox',
              align: 'center',
              width: '90',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'fee.feeInfo.detail.transactionFlag',
              prop: 'transactionFlag',
              element: 'el-checkbox',
              align: 'center',
              width: '90',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            // 费用合同
            {
              label: 'fee.feeInfo.form.feeContractNo',
              prop: 'feeContractNo',
              element: 'base-dialog-select',
              component: () => import('@/views/frame/biz/fee/dialog/feeContractDialog.vue'),
              validateFunc: this.feeContractValidateFunc,
              initChoose: this.feeContractInitChoose,
              callback: this.feeContractCallback,
              attrs: {
                disabled: false,
                clearable: true
              },
              width: '150'
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
      // this.sumDetail()
    },
    // 费用数量change事件
    feeQuantityChange(param) {
      const row = param.row
      // 数量修改影响不含税单价、含税单价
      if (Number(row.feeQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.feeQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
        row.includeTaxPrice = '0'
      }
    },
    // 含税金额change事件
    includeTaxAmountChange(param) {
      const row = param.row
      // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.feeQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.feeQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
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
      if (Number(row.feeQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.feeQuantity)).toFixed(6)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
        row.includeTaxPrice = '0'
      }
      // this.sumDetail()
    },
    // 税率change事件
    taxRateChange(param) {
      const row = param.row
      // 税率修改，影响税额、含税金额、含税单价
      row.taxAmount = (Number(row.excludeTaxAmount) * Number(row.taxRate) / 100).toFixed(2)
      row.includeTaxAmount = (Number(row.excludeTaxAmount) + Number(row.taxAmount)).toFixed(2)
      if (Number(row.feeQuantity) !== 0) {
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
      } else {
        row.includeTaxPrice = '0'
      }
      // this.sumDetail()
    },
    // // 计算合计信息
    // sumDetail() {
    //   var excludeTaxAmount = 0
    //   var taxAmount = 0
    //   var includeTaxAmount = 0
    //   this.$refs.tab.tableData.forEach(row => {
    //     excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
    //     taxAmount = (Number(taxAmount) + Number(row.taxAmount)).toFixed(2)
    //     includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
    //   })
    //   this.editForm.excludeTaxAmount = excludeTaxAmount + ''
    //   this.editForm.taxAmount = taxAmount + ''
    //   this.editForm.includeTaxAmount = includeTaxAmount + ''
    // },
    feeNameCodeChange(param) {
      param.row.taxRate = param.val.data.rate
      param.row.currency = param.val.data.currency
    },
    feeContractInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        customerNo: {
          disabled: true,
          value: this.editForm.customerNo
        },
        auditStatus: {
          value: '3'
        }
      }
    },
    feeContractValidateFunc() {
      var customerNo = this.editForm.customerNo
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择服务商') }))
        return false
      }
      return true
    },
    feeContractCallback(result) {
      var col = this.$refs.tab.tableData[this.$refs.tab.rowOpenNum]
      this.$set(col, 'feeContractNo', result.feeContractNo)
    }
  }
}
</script>
