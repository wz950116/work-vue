<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: 'add',
        param: this.param,
        api: {
          search: null
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
              label: 'spot.contractLot.form.fundType',
              prop: 'fundType',
              width: '120'
            },
            {
              label: 'spot.contractLot.form.settlementPrice',
              prop: 'settlementPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.settlementTfprice',
              prop: 'settlementTfprice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.settlementQuantity',
              prop: 'settlementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.settlementTaxRate',
              prop: 'settlementTaxRate',
              width: '120',
              align: 'right',
              format: {
                func: 'taxrate'
              }
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

  }
}
</script>
