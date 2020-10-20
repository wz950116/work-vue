<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/whOutCheckBill/listProduct'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
        ],
        table: {
          showSummary: true,
          height: 200,
          cols: [
            {
              label: 'storage.outCheck.list.productName',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.outCheck.list.rightFlag',
              prop: 'rightFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0',
                disabled: true
              }
            },
            {
              label: 'storage.outCheck.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: true
              }
            },
            {
              label: 'storage.outCheck.list.outQuantity',
              prop: 'outQuantity',
              width: '120',
              summary: true,
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.outCheck.list.actualQuantity',
              prop: 'actualQuantity',
              width: '120',
              summary: true,
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.outCheck.list.productUnitName',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.outCheck.list.outMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              summary: true,
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.outCheck.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              summary: true,
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.outCheck.list.measurementUnitName',
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
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
