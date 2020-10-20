<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/contract/ssFeeDetail/listBySettlementNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.settlementNo
          }
        },
        table: {
          cols: [
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'spot.contractLot.form.feeDirection',
              prop: 'feeDirection',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              }
            },
            {
              label: 'spot.contractLot.form.feeTypeName',
              prop: 'feeTypeName',
              width: '120'
            },
            {
              label: 'spot.contractLot.form.feePrice',
              prop: 'feePrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.feeTaxfreePrice',
              prop: 'feeTaxfreePrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.feeTaxRate',
              prop: 'feeTaxRate',
              width: '120',
              align: 'right',
              format: {
                func: 'taxrate'
              }
            },
            {
              label: 'spot.contractLot.form.feeQuantity',
              prop: 'feeQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.valueUnit',
              prop: 'valueUnit',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.contractLot.form.settlementPrice',
              prop: 'settlementPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              event: this.changeSettlementPrice
            },
            {
              label: 'spot.contractLot.form.settlementTfprice',
              prop: 'settlementTfprice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              event: this.changeSettlementTfprice
            },
            {
              label: 'spot.contractLot.form.settlementQuantity',
              prop: 'settlementQuantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              },
              event: this.changeSettlementQuantity
            },
            {
              label: 'spot.contractLot.form.settlementTaxRate',
              prop: 'settlementTaxRate',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'taxrate'
              },
              event: this.changeSettlementTaxRate
            },
            {
              label: 'spot.contractLot.form.taxedAmount',
              prop: 'taxedAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.taxFreeAmount',
              prop: 'taxFreeAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
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
  mounted() {

  },
  methods: {
    changeSettlementPrice(data) {
      if (!this.checkEvent()) {
        return
      }
      const row = data.row
      const settlementPrice = toolUtil.toNum(data.val)
      const settlementTfprice = toolUtil.toNum(row.settlementTfprice)
      const settlementTaxRate = toolUtil.toNum(row.settlementTaxRate)
      row.settlementPrice = settlementPrice
      if (settlementPrice !== null) {
        if (settlementTaxRate !== null) {
          row.settlementTfprice = settlementPrice / (1 + settlementTaxRate / 100)
        } else if (settlementTfprice !== null) {
          if (settlementTfprice > 0) {
            row.settlementTaxRate = (settlementPrice - settlementTfprice) * 100 / settlementTfprice
          }
        }
      }
      this.calcAmountAndSum(row)
    },
    changeSettlementTfprice(data) {
      if (!this.checkEvent()) {
        return
      }
      const row = data.row
      const settlementPrice = toolUtil.toNum(row.settlementPrice)
      const settlementTfprice = toolUtil.toNum(data.val)
      const settlementTaxRate = toolUtil.toNum(row.settlementTaxRate)
      row.settlementTfprice = settlementTfprice
      if (settlementTfprice !== null) {
        if (settlementTaxRate !== null) {
          row.settlementPrice = toolUtil.toNum(settlementTfprice * (1 + settlementTaxRate / 100))
        } else if (settlementPrice !== null) {
          if (settlementTfprice > 0) {
            row.settlementTaxRate = (settlementPrice - settlementTfprice) * 100 / settlementTfprice
          }
        }
      }
      this.calcAmountAndSum(row)
    },
    changeSettlementQuantity(data) {
      if (!this.checkEvent()) {
        return
      }
      const row = data.row
      row.settlementQuantity = toolUtil.toNum(data.val)
      this.calcAmountAndSum(row)
    },
    changeSettlementTaxRate(data) {
      if (!this.checkEvent()) {
        return
      }
      const row = data.row
      const settlementPrice = toolUtil.toNum(row.settlementPrice)
      const settlementTfprice = toolUtil.toNum(row.settlementTfprice)
      const settlementTaxRate = toolUtil.toNum(data.val)
      row.settlementTaxRate = settlementTaxRate
      if (settlementTaxRate !== null) {
        if (settlementTfprice !== null) {
          row.settlementPrice = toolUtil.toNum(settlementTfprice * (1 + settlementTaxRate / 100))
        } else if (settlementPrice !== null) {
          row.settlementTfprice = toolUtil.toNum(settlementPrice / (1 + settlementTaxRate / 100))
        }
      }
      this.calcAmountAndSum(row)
    },
    calcAmountAndSum(row) {
      const settlementPrice = toolUtil.toNum(row.settlementPrice)
      const settlementTfprice = toolUtil.toNum(row.settlementTfprice)
      const settlementQuantity = toolUtil.toNum(row.settlementQuantity)
      let taxedAmount = null
      let taxFreeAmount = null
      let taxAmount = null
      if (settlementQuantity !== null) {
        if (settlementPrice !== null) {
          taxedAmount = toolUtil.toNum(settlementQuantity * settlementPrice)
        }
        if (settlementTfprice !== null) {
          taxFreeAmount = toolUtil.toNum(settlementQuantity * settlementTfprice)
        }
        if (taxedAmount !== null && taxFreeAmount !== null) {
          taxAmount = toolUtil.toNum(taxedAmount - taxFreeAmount)
        }
      }
      row.taxedAmount = taxedAmount
      row.taxFreeAmount = taxFreeAmount
      row.taxAmount = taxAmount

      // 刷新表格
      const feeDtlList = toolUtil.getDataTabFromSelf(this)
      feeDtlList.push({})
      feeDtlList.pop()

      // 计算结算明细
      const editFromRef = toolUtil.getRefEditFromTab(this)
      editFromRef.calcSttList()
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
