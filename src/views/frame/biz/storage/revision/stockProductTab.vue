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
          search: '/api/warehouse/whRevisionProduct/listStockByRevisionNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.revisionNo
          }
        },
        topBar: [
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update'],
            callback: this.doDelete
          }
        ],
        table: {
          cols: [
            {
              label: 'storage.revision.list.stockDetailNo',
              prop: 'stockDetailNo',
              width: '180'
            },
            {
              label: 'storage.revision.list.inBillNo',
              prop: 'inBillNo',
              width: '180'
            },
            {
              label: 'storage.revision.list.inProductNo',
              prop: 'inProductNo',
              width: '180'
            },
            {
              label: 'storage.revision.list.inDetailNo',
              prop: 'inDetailNo',
              width: '180'
            },
            {
              label: 'storage.revision.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.revision.list.itemCount',
              prop: 'itemCount',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 0,
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.revision.list.quantity',
              prop: 'quantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.revision.list.restQuantity',
              prop: 'restQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.revision.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.revision.list.measurementQuantity',
              prop: 'measurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.revision.list.restMeasurementQuantity',
              prop: 'restMeasurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.revision.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
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
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
  },
  methods: {
    doDelete(param) {
      // 库存调整商品信息
      const revisionProductList = this.$parent.$parent.$refs.qmRouteEdit.$refs.revisionProductList['0'].$refs.tab.tableData

      // 过滤掉删除商品对应的调整商品
      const newData = []
      revisionProductList.forEach(row => {
        if (param.stockDetailNo !== row.stockDetailNo) {
          newData.push(row)
        }
      })
      this.$parent.$parent.$refs.qmRouteEdit.$refs.revisionProductList['0'].$refs.tab.tableData = newData
    }
  }
}
</script>
