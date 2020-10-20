<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/whOutBill/listProduct'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          // {
          //   name: 'add',
          //   type: 'dialog',
          //   iconName: '线性-增行',
          //   i18n: 'biz.btn.addRow',
          //   getParam() {
          //     return {}
          //   },
          //   component: () =>
          //     import('@/views/frame/biz/data/productItem/choose.vue'),
          //   isShow: ['add', 'update'],
          //   validate: this.validateAdd
          // },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update'],
            callback: this.deleteCallBack
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          showSummary: true,
          height: 200,
          cols: [
            {
              label: 'storage.outNotice.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$route.params.type === 'complete' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols,
            ...this.$route.params.type === 'complete' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols,
            {
              label: 'storage.outNotice.list.rightFlag',
              prop: 'rightFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'storage.outNotice.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              }
            },
            {
              label: 'storage.outNotice.list.outQuantity',
              prop: 'outQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              event: this.onOutQuantityChange
            },
            {
              label: 'storage.outNotice.list.actualQuantity',
              prop: 'actualQuantity',
              width: '120',
              align: 'right',
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'weight'
              },
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.goodsFlag',
              prop: 'goodsFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.settlementQuantity',
              prop: 'settlementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'weight',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.productUnitName',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.outNotice.list.outMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              element: 'input-formatter',
              summary: true,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              event: this.onMeasurementQuantityChange
            },
            {
              label: 'storage.outNotice.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'weight'
              },
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'storage.outNotice.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'money',
                disabled: this.$route.params.type === 'complete',
              },
              format: {
                func: 'money'
              },
              event: this.onIncludeTaxPriceChange,
              isShow: true
            },
            {
              label: 'storage.outNotice.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              width: '120',
              align: 'right',
              summary: true,
              required: false,
              attrs: {
                gtmin: 0,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.outNotice.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: '120',
              align: 'right',
              required: false,
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.outNotice.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              width: '120',
              align: 'right',
              required: false,
              summary: true,
              attrs: {
                gtmin: 0,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.outNotice.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                gtmin: 0,
                disabled: this.$route.params.type === 'complete',
                type: 'taxrate'
              },
              event: this.onTaxRateChange,
              isShow: true
            },
            {
              label: 'storage.outNotice.list.taxAmount',
              prop: 'taxAmount',
              width: '120',
              summary: true,
              align: 'right',
              required: false,
              attrs: {
                gtmin: 0,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
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
  mounted() {
  },
  methods: {
    // validateAdd() {
    //   if (this.editForm.outType !== 'TEMP') {
    //     this.$notify(
    //       notifyInfo({
    //         msg: this.$t('只有出库类型为散购出库时，才可以新增行。')
    //       })
    //     )
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    deleteCallBack(param) {
      this.deleteProductPick(param)
      // TODO 删除商品所相应的费用信息
    },
    deleteProductPick(param) {
      const productDetailKey = this.getProductKey(param)
      const productPickTableData = this.$parent.$parent.$refs.qmRouteEdit.$refs.outProductPickList['0'].$refs.tab.tableData
      for (let i = productPickTableData.length - 1; i >= 0; i--) {
        const row = productPickTableData[i]
        if (productDetailKey === this.getProductKey(row)) {
          productPickTableData.splice(productPickTableData.indexOf(row), 1)
        }
      }
    },
    getProductKey(param) {
      return param.productCode + param.brand + param.spec + param.origin + param.productKeyAttr01 + param.productKeyAttr02 + param.productKeyAttr03
    },
    // 物资属性暂时不便监听change事件，此方法未启用
    onProductKeyAttrChange(param) {
      this.deleteProductPick(param.row)
    },
    onOutQuantityChange(param) {
      const row = param.row
      // if (param.val) {
      //   row.measurementQuantity = param.val
      // }
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onMeasurementQuantityChange(param) {
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
      if (this.editForm.outType === 'TEMP') {
        row.includeTaxAmount = quantity * includeTaxPrice
        row.excludeTaxPrice = (includeTaxPrice / (1 + taxRate / 100)).toFixed(6)
        row.excludeTaxAmount = (row.includeTaxAmount / (1 + taxRate / 100)).toFixed(2)
        row.taxAmount = row.includeTaxAmount - row.excludeTaxAmount
      }
    }
  }
}
</script>
