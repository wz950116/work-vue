<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import { add } from '@/utils/proj/calculateUtil'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/whLadingOutCfmPick/get'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          height: 200,
          cols: [
            {
              label: 'storage.ladingOut.list.ladingBillNo',
              width: '200',
              prop: 'ladingBillNo'
            },
            {
              label: 'storage.ladingOut.list.ladingProductNo',
              width: '120',
              prop: 'ladingProductNo'
            },
            {
              prop: 'supplierName',
              width: '200',
              align: 'left',
              label: 'storage.ladingOut.list.supplierName'
            },
            {
              label: 'storage.ladingOut.list.productName',
              prop: 'productName',
              width: '100',
              attrs: {
                disabled: true
              }
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'storage.ladingOut.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                type: 'num',
                disabled: true
              }
            },
            {
              label: 'storage.ladingOut.list.ladingOutMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                disabled: true,
                type: 'weight'
              }
            },
            {
              label: 'storage.ladingOutCheck.list.checkMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight'
              },
              required: true,
              event: this.changeMeasurementQuantity
            },
            {
              label: 'storage.ladingOut.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '100',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                disabled: true
              }
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                disabled: true,
                type: 'weight'
              }
            },
            {
              label: 'storage.ladingOutCheck.list.checkQuantity',
              prop: 'actualQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight'
              },
              required: true,
              event: this.changeQuantity
            },
            {
              label: 'storage.ladingOut.list.productUnitName',
              prop: 'productUnitCode',
              width: '100',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              attrs: {
                disabled: true
              }
            },
            ...this.$store.state.user.reserveGoodColsTxt
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
    // 合计确认计量数量
    changeMeasurementQuantity(param) {
      const productList = this.$parent.$refs.whLadingOutCfmPrdDtoList[0].$refs.tab.tableData
      const pickList = this.$refs.tab.tableData
      for (let i = 0; i < productList.length; i++) {
        const productRow = productList[i]
        var totalQuantity = 0
        for (let j = 0; j < pickList.length; j++) {
          const pickRow = pickList[j]
          if (productRow.ladingOutProductNo === pickRow.ladingOutProductNo) {
            totalQuantity += add(totalQuantity, pickRow.actualMeasurementQuantity)
          }
        }
        productRow.actualMeasurementQuantity = totalQuantity + ''
      }
    },
    // 合计确认货物重量
    changeQuantity(param) {
      const productList = this.$parent.$refs.whLadingOutCfmPrdDtoList[0].$refs.tab.tableData
      const pickList = this.$refs.tab.tableData
      for (let i = 0; i < productList.length; i++) {
        const productRow = productList[i]
        var totalQuantity = 0
        for (let j = 0; j < pickList.length; j++) {
          const pickRow = pickList[j]
          if (productRow.ladingOutProductNo === pickRow.ladingOutProductNo) {
            totalQuantity += add(totalQuantity, pickRow.actualQuantity)
          }
        }
        productRow.actualQuantity = totalQuantity + ''
      }
    }
  }
}
</script>
