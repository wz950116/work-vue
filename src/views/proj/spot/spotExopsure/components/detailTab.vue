<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      exchangeRate: 1,
      tab: {
        type: this.$route.params.type,
        param: this.$route.params,
        api: {
          search: '/api/spot/strgExposure/getList'
        },
        apiData: {
          search(param) {
            return param.id
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'copy'],
            event: this.addRow
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'copy']
          }
        ],
        table: {
          cols: [
            {
              width: 100,
              label: 'spotProj.exposure.list.exposureType',
              prop: 'exposureType',
              element: 'base-select',
              list: this.$t('datadict.exposureType'),
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.contractNo',
              prop: 'contractNo',
              element: 'input-validate',
              required: true
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.documentNo',
              prop: 'documentNo',
              element: 'input-validate',
              required: true
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.productCode',
              prop: 'productName',
              element: 'base-dialog-select',
              component: () => import('@/views/frame/biz/data/productItem/chooseSingle.vue'),
              callback: this.productCodeCallback,
              required: true,
              attrs: {
                disabled: false,
                clearable: false
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.documentQuantity',
              prop: 'documentQuantity',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.rawQuantity',
              prop: 'rawQuantity',
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              type: 'date',
              label: 'spotProj.exposure.list.startDate',
              prop: 'startDate',
              required: true,
              width: 130,
              attrs: {
                clearable: true,
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
              }
            },
            {
              type: 'date',
              label: 'spotProj.exposure.list.endDate',
              prop: 'endDate',
              width: 130,
              required: true,
              attrs: {
                clearable: true,
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
              }
            },
            {
              label: 'spotProj.exposure.list.priceItemCode',
              prop: 'priceItemCode',
              element: 'base-select',
              width: 100,
              required: true,
              attrs: {
                data: 'DD_PRICE_ITEM',
                filterable: true,
                params: {
                  usingFlag: '1'
                },
                clearable: true
              }
            },
            {
              label: 'spotProj.exposure.list.valuationCode',
              prop: 'valuationCode',
              element: 'base-select',
              width: 100,
              required: true,
              attrs: {
                data: 'DD_PRICE_ITEM',
                filterable: true,
                params: {
                  usingFlag: '1'
                },
                clearable: true
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.exchangeRate',
              prop: 'exchangeRate',
              element: 'input-formatter',
              event: this.priceChange,
              required: true,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.avgPrice',
              prop: 'avgPrice',
              element: 'input-formatter',
              event: this.priceChange,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.premium',
              prop: 'premium',
              element: 'input-formatter',
              event: this.priceChange,
              attrs: {
                min: -999999999999,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.price',
              prop: 'price',
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2,
                disabled: true
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.priceStandard',
              prop: 'priceStandard',
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2,
                disabled: true
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.sets',
              prop: 'sets',
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.setQuantity',
              prop: 'setQuantity',
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 2
              }
            },
            {
              width: 90,
              label: 'spotProj.exposure.list.unitCode',
              prop: 'unitCode',
              element: 'base-select',
              list: this.$t('datadict.measurementUnit'),
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              width: 100,
              label: 'spotProj.exposure.list.marketCode',
              prop: 'marketCode',
              element: 'base-select',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                data: 'DD_SPOT_MARKET',
                filterable: true,
                clearable: true
              }
            },
            {
              label: 'spotProj.exposure.list.warehouseCode',
              prop: 'warehouseCode',
              element: 'base-select',
              width: 100,
              attrs: {
                data: 'DD_WAREHOUSE',
                clearable: true
              }
            },
            // {
            //   width: 200,
            //   label: 'spotProj.exposure.list.attrValue',
            //   prop: 'attrValue',
            //   element: 'input-validate'
            // },
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy') ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols,
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy') ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    initChoose() {
      return {
        showCheckbox: false
      }
    },
    productCodeCallback(result) {
      var col = this.$refs.tab.tableData[this.$refs.tab.rowOpenNum]
      this.$set(col, 'productCode', result.productCode)
      this.$set(col, 'productName', result.productName)
      this.$set(col, 'brand', result.brand)
      this.$set(col, 'spec', result.spec)
      this.$set(col, 'origin', result.origin)
      this.$set(col, 'productKeyAttr01', result.productKeyAttr01)
      this.$set(col, 'productKeyAttr02', result.productKeyAttr02)
      this.$set(col, 'productKeyAttr03', result.productKeyAttr03)
    },
    priceChange(val) {
      var price = val.row.avgPrice
      var premium = val.row.premium
      var rate = val.row.exchangeRate
      var priceStandard = 0
      priceStandard = ((price ? parseFloat(price) : 0) + (premium ? parseFloat(premium) : 0)) * (rate ? parseFloat(rate) : 1)
      this.$set(
        val.row,
        'price',
        (price ? parseFloat(price) : 0) + (premium ? parseFloat(premium) : 0)
      )
      this.$set(val.row, 'priceStandard', priceStandard)
    },
    changeCurrency(exchangeRate) {
      if (exchangeRate === null) {
        exchangeRate = 1
      }
      this.exchangeRate = exchangeRate
      var table = this.$refs.tab.tableData
      for (let i = 0; i < table.length; i++) {
        table[i].exchangeRate = exchangeRate
      }
    },
    addRow() {
      var obj = {}
      obj.exchangeRate = this.exchangeRate
      obj.unitCode = '1'
      this.$refs.tab.tableData.push(obj)
    },
    changePriceType(val) {
      for (let i = 0; i < this.tab.table.cols.length; i++) {
        var data = this.tab.table.cols[i]
        if (val === '2') {
          if (data.prop === 'endDate') {
            data.required = true
          }
          if (data.prop === 'avgPrice') {
            data.required = false
          }
          if (data.prop === 'priceItemCode') {
            data.required = true
          }
        } else {
          if (data.prop === 'endDate') {
            data.required = false
          }
          if (data.prop === 'avgPrice') {
            data.required = true
          }
          if (data.prop === 'priceItemCode') {
            data.required = false
          }
        }
      }
    }
  }
}
</script>
