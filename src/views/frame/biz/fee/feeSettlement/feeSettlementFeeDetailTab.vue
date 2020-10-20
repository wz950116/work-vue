<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/fee/feeSettleFeeDetail/list'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          cols: [
            // 单据类型
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.typeCode',
              prop: 'typeCode',
              width: 200,
              format: {
                dict: this.$t('datadict.feeSource')
              }
            },
            // 费用明细单据号
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeDetailNo',
              prop: 'feeDetailNo',
              width: 150
            },
            // // 服务商
            // {
            //   label: 'fee.feeSettle.feeSettleFeeDetailDto.customerNo',
            //   prop: 'customerName',
            //   width: 200
            // },
            // 费用名称
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeName',
              prop: 'feeName',
              width: 150
            },
            // 费用方向
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeDirection',
              prop: 'feeDirection',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              }
            },
            // // 费用日期
            // {
            //   label: 'fee.feeSettle.feeSettleFeeDetailDto.feeDate',
            //   prop: 'feeDate',
            //   width: 100,
            //   format: {
            //     func: 'dateFormat',
            //     dict: 'YYYY-MM-DD'
            //   }
            // },
            // 费用单价
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeIncludeTaxPrice',
              prop: 'feeIncludeTaxPrice',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 费用无税单价
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeExcludeTaxPrice',
              prop: 'feeExcludeTaxPrice',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 费用税率
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeTaxRate',
              prop: 'feeTaxRate',
              width: 100,
              align: 'right',
              format: {
                func: 'taxrate'
              }
            },
            // 费用数量
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.costQuantity',
              prop: 'costQuantity',
              format: {
                func: 'num'
              },
              width: 150,
              align: 'right'
            },

            // 计量单位
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.quantityUnit',
              prop: 'quantityUnit',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            // 结算单价
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.includeTaxPrice',
              prop: 'includeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true,
              event: this.includeTaxPriceChange
            },
            // 结算无税单价
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true
              // event: this.excludeTaxPriceChange
            },
            // 结算数量
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.feeQuantity',
              prop: 'feeQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'num',
                disabled: false,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true,
              event: this.feeQuantityChange
            },
            // 结算税率
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              attrs: {
                type: 'taxrate',
                disabled: false,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 100,
              align: 'left',
              required: true,
              event: this.taxRateChange
            },

            // 含税金额
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.includeTaxAmount',
              prop: 'includeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true
            },
            // 不含税金额
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true
            },
            // 税额
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.taxAmount',
              prop: 'taxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true,
                min: 0,
                max: 999999999999.999
              },
              width: 150,
              align: 'left',
              required: true
            },
            // 币种
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.currency',
              prop: 'currency',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            // 商品名称
            {
              label: 'fee.feeSettle.feeSettleFeeDetailDto.productName',
              prop: 'productName',
              width: 100
            },
            ...this.$store.state.user.mainGoodColsTxt,
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
    }
  },
  mounted() {},
  methods: {
    feeQuantityChange(param) {
      if (!this.checkEvent()) {
        return
      }
      param.row.feeQuantity = param.val
      const row = param.row
      // 费用数量修改影响不含税金额和含税金额和税额
      if (Number(row.feeQuantity) !== 0) {
        row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.feeQuantity)).toFixed(2)
        row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
        row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
        const editFromRef = toolUtil.getRefEditFromTab(this)
        // editFromRef.editFeeSettlementDetail()
      }
    },
    // excludeTaxPriceChange(param) {
    //   const row = param.row
    //   // 不含税价格修改影响不含税金额和含税金额和含税价格和税额
    //   if (Number(row.excludeTaxPrice) !== 0) {
    //     row.excludeTaxAmount = (Number(row.feeQuantity) * Number(row.excludeTaxPrice)).toFixed(2)
    //     row.taxAmount = (Number(row.excludeTaxAmount) * Number(row.taxRate) / 100).toFixed(2)
    //     row.includeTaxAmount = (Number(row.excludeTaxAmount) + Number(row.taxAmount)).toFixed(2)
    //     row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
    //     const editFromRef = toolUtil.getRefEditFromTab(this)
    //     editFromRef.editFeeSettlementDetail()
    //   }
    // },
    taxRateChange(param) {
      if (!this.checkEvent()) {
        return
      }
      param.row.taxRate = toolUtil.toNum(param.val)
      const row = param.row
      // 税率修改影响含税金额和含税价格和税额
      if (Number(row.taxRate) !== 0) {
        row.taxAmount = (Number(row.excludeTaxAmount) * Number(row.taxRate) / 100).toFixed(2)
        row.includeTaxAmount = (Number(row.excludeTaxAmount) + Number(row.taxAmount)).toFixed(2)
        row.includeTaxPrice = (Number(row.includeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
        const editFromRef = toolUtil.getRefEditFromTab(this)
        // editFromRef.editFeeSettlementDetail()
      }
    },
    includeTaxPriceChange(param) {
      if (!this.checkEvent()) {
        return
      }
      param.row.includeTaxPrice = param.val
      const row = param.row
      // 含税价格修改影响不含税金额和含税金额和税额
      if (Number(row.includeTaxPrice) !== 0) {
        row.includeTaxAmount = (Number(row.feeQuantity) * Number(row.includeTaxPrice)).toFixed(2)
        row.excludeTaxAmount = (Number(row.includeTaxAmount) / (Number(row.taxRate) / 100 + 1)).toFixed(2)
        row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.feeQuantity)).toFixed(2)
        const editFromRef = toolUtil.getRefEditFromTab(this)
        // editFromRef.editFeeSettlementDetail()
      }
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
