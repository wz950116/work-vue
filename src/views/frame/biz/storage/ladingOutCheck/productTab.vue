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
          search: '/api/warehouse/whLadingOutCfmPrd/get'
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
              label: 'storage.ladingOut.list.productName',
              prop: 'productName',
              width: '150',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
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
              width: '150',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                type: 'weight',
                disabled: true
              }
            },
            {
              label: 'storage.ladingOutCheck.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                type: 'weight',
                disabled: true
              },
              required: true
            },
            {
              label: 'storage.ladingOut.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '120',
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
              label: 'storage.ladingOut.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '150',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                type: 'weight',
                disabled: true
              }
            },
            {
              label: 'storage.ladingOutCheck.list.actualQuantity',
              prop: 'actualQuantity',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  trigger: 'blur'
                }
              ],
              attrs: {
                type: 'weight',
                disabled: true
              },
              required: true
            },
            {
              label: 'storage.ladingOut.list.productUnitName',
              prop: 'productUnitCode',
              width: '120',
              format: {
                dict: this.$t('datadict.goodsUnit')
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
              label: 'storage.ladingOut.list.rightFlag',
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
    }
  }
}
</script>
