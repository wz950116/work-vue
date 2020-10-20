<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/whLadingOutProduct/getInfoByLadingOutNo'
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
          },
          {
            name: 'copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          height: 140,
          cols: [
            // 商品编码
            {
              prop: 'productCode',
              isShow: false
            },
            // 选择返回的批次商品编码
            {
              prop: 'lotProductDetailCode',
              isShow: false
            },
            {
              label: 'storage.ladingOut.list.productName',
              prop: 'productName',
              width: '150',
              attrs: {
                disabled: true
              }
            },
            ...this.$route.params.type === 'complete' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols,
            {
              label: 'storage.ladingOut.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                gtmin: 0,
                type: 'num'
              }
            },
            {
              label: 'storage.ladingOut.list.ladingOutMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '150',
              element: 'input-formatter',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                gtmin: 0,
                type: 'weight'
              },
              required: true,
              event: this.onInQuantityChange
            },
            {
              label: 'storage.ladingOut.list.checkMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '150',
              attrs: {
                type: 'weight',
                disabled: true
              }
            },
            {
              label: 'storage.ladingOut.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              attrs: {
                disabled: true
              }
            },
            {
              label: 'storage.ladingOut.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '150',
              element: 'input-formatter',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                gtmin: 0,
                type: 'weight'
              },
              required: true
            },
            {
              label: 'storage.ladingOut.list.checkQuantity',
              prop: 'actualQuantity',
              width: '150',
              attrs: {
                type: 'weight',
                disabled: true
              }
            },
            {
              label: 'storage.ladingOut.list.productUnitName',
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              attrs: {
                disabled: true
              }
            },
            {
              label: 'storage.ladingOut.list.rightFlag',
              prop: 'rightFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'storage.ladingOut.list.goodsFlag',
              prop: 'goodsFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'storage.ladingOut.list.settlementQuantity',
              prop: 'settlementQuantity',
              width: '150',
              element: 'input-formatter',
              attrs: {
                type: 'weight'
              }
            },
            {
              label: 'storage.ladingOut.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                disabled: this.$route.params.type === 'complete',
                min: 0,
                max: 999999999999.999,
                type: 'price'
              },
              event: this.onIncludeTaxPriceChange,
              isShow: true
            },
            {
              label: 'storage.ladingOut.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              width: '120',
              align: 'right',
              required: false,
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.ladingOut.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: '120',
              align: 'right',
              required: false,
              format: {
                func: 'price'
              },
              isShow: true
            },
            {
              label: 'storage.ladingOut.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              width: '120',
              align: 'right',
              required: false,
              format: {
                func: 'money'
              },
              attrs: {
                disabled: this.$route.params.type === 'complete'
              },
              isShow: true
            },
            {
              label: 'storage.ladingOut.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                disabled: this.$route.params.type === 'complete',
                min: 0,
                max: 999999999999.999,
                type: 'taxrate'
              },
              event: this.onTaxRateChange,
              isShow: true
            },
            {
              label: 'storage.ladingOut.list.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              required: false,
              format: {
                func: 'money'
              },
              attrs: {
                disabled: this.$route.params.type === 'complete'
              },
              isShow: true
            },
            ...this.$route.params.type === 'complete' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols,
            // 选择返回的批次商品编码
            {
              prop: 'lotProductDetailCode',
              isShow: false
            },
            // 选择返回的批次商品编码
            {
              prop: 'preBillProductDetailCode',
              isShow: false
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
      type: [Object, String],
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
    handleClose(params) {
      // 后过滤
      // const newData = []
      // this.$refs.tab.tableData.forEach(row => {
      //   if (
      //     !newData
      //       .map(v => {
      //         return v.productName
      //       })
      //       .includes(row.productName)
      //   ) {
      //     newData.push(row)
      //   }
      // })
      // this.$refs.tab.tableData = newData
    },
    onInQuantityChange(param) {
      const row = param.row
      const quantity = Number(param.val)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onIncludeTaxPriceChange(param) {
      const row = param.row
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(param.val)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onTaxRateChange(param) {
      const row = param.row
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(param.val)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    calculate(row, quantity, includeTaxPrice, taxRate) {
      if (this.editForm.ladingOutType === 'TEMP') {
        row.includeTaxAmount = quantity * includeTaxPrice
        row.excludeTaxPrice = (includeTaxPrice / (1 + taxRate / 100)).toFixed(6)
        row.excludeTaxAmount = (row.includeTaxAmount / (1 + taxRate / 100)).toFixed(2)
        row.taxAmount = row.includeTaxAmount - row.excludeTaxAmount
      }
    }
  }
}
</script>
