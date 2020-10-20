<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/inProductDetail/listByInCheckNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.inCheckNo
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            event: this.addRow,
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update'],
            callback: this.doDelete
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          height: 300,
          cols: [
            {
              label: 'storage.inCheck.list.productName',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.inCheck.list.stockArea',
              prop: 'stockArea',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            },
            {
              label: 'storage.inCheck.list.stockPosition',
              prop: 'stockPosition',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            },
            {
              label: 'storage.inCheck.list.stockNo',
              prop: 'stockNo',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            },
            {
              label: 'storage.inCheck.list.actualCount',
              prop: 'actualCount',
              element: 'input-formatter',
              width: 120,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'thousands',
                precision: 0,

                clearable: true
              },
              event: this.onActualCountChange
            },
            {
              label: 'storage.inCheck.list.actualQuantity',
              prop: 'actualQuantity',
              element: 'input-formatter',
              width: 120,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,

                clearable: true
              },
              required: true,
              event: this.onActualQuantityChange
            },
            {
              label: 'storage.inCheck.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.inCheck.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              element: 'input-formatter',
              width: 120,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                clearable: true
              },
              required: true,
              event: this.onActualMeasurementQuantityChange
            },
            {
              label: 'storage.inCheck.list.measurementUnitCode',
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
  methods: {
    addRow() {
      const productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs.inCheckProductList['0'].$refs.tab.currentRow
      if (productRow === undefined || productRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('请先选择一条入库商品信息。') }))
        return
      }
      this.$refs.tab.tableData.push({
        productCode: productRow.productCode,
        productName: productRow.productName,
        brand: productRow.brand,
        spec: productRow.spec,
        origin: productRow.origin,
        productKeyAttr01: productRow.productKeyAttr01,
        productKeyAttr02: productRow.productKeyAttr02,
        productKeyAttr03: productRow.productKeyAttr03,
        productUnitCode: productRow.productUnitCode,
        measurementUnitCode: productRow.measurementUnitCode
      })
    },
    doDelete(param) {
      this.calculateSum(param)
    },
    onActualCountChange(param) {
      this.calculateSum(param.row)
    },
    onActualQuantityChange(param) {
      // if (param.val) {
      //   param.row.actualMeasurementQuantity = param.val
      // }
      this.calculateSum(param.row)
    },
    onActualMeasurementQuantityChange(param) {
      this.calculateSum(param.row)
    },
    calculateSum(param) {
      if (!param) {
        return
      }
      const productDetailKey = this.getProductKey(param)
      var actualCountSum = 0
      var actualQuantitySum = 0
      var actualMeasurementQuantitySum = 0
      this.$refs.tab.tableData.forEach(row => {
        if (productDetailKey === this.getProductKey(row)) {
          if (row['actualCount']) {
            actualCountSum += Number(row['actualCount'])
          }
          if (row['actualQuantity']) {
            actualQuantitySum += Number(row['actualQuantity'])
          }
          if (row['actualMeasurementQuantity']) {
            actualMeasurementQuantitySum += Number(row['actualMeasurementQuantity'])
          }
        }
      })
      const productTableData = this.$parent.$parent.$refs.qmRouteEdit.$refs.inCheckProductList['0'].$refs.tab.tableData
      productTableData.forEach(row => {
        if (productDetailKey === this.getProductKey(row)) {
          row.actualCount = actualCountSum
          row.actualQuantity = actualQuantitySum
          row.actualMeasurementQuantity = actualMeasurementQuantitySum
          return
        }
      })
    },
    getProductKey(param) {
      return param.productCode + param.brand + param.spec + param.origin + param.productKeyAttr01 + param.productKeyAttr02 + param.productKeyAttr03
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
  }
}
</script>
