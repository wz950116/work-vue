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
          search: '/api/warehouse/whRevisionProduct/listByRevisionNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.revisionNo
          }
        },
        topBar: [],
        table: {
          cols: [
            {
              label: 'storage.revision.list.stockDetailNo',
              prop: 'stockDetailNo',
              width: '180'
            },
            {
              label: 'storage.transferIn.list.contractNo',
              prop: 'contractNo',
              width: 180,
              align: 'left',
            },
            {
              label: 'storage.transferIn.list.lotNo',
              prop: 'lotNo',
              width: 180,
              align: 'left',
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
              prop: 'productCode',
              width: '180',
              element: 'base-select',
              required: true,
              attrs: {
                data: 'DD_PRODUCT',
                params: {
                  usingFlag: '1'
                },

                clearable: false,
                filterable: true
              },
              changeAll: this.onProductCodeChangeAll
            },
            ...(this.$route.params.type === 'view' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.revision.list.revisionCount',
              prop: 'revisionCount',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'num',
                clearable: true,
                event: this.onRevisionCountChange
              }
            },
            {
              label: 'storage.revision.list.revisionQuantity',
              prop: 'revisionQuantity',
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
                gtmin: 0,
                type: 'weight',
                clearable: true
              },
              event: this.onRevisionQuantityChange
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
              label: 'storage.revision.list.revisionMeasurementQuantity',
              prop: 'revisionMeasurementQuantity',
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
                gtmin: 0,
                type: 'weight',
                clearable: true
              },
              event: this.onRevisionMeasurementQuantityChange
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
  mounted() { },
  methods: {
    onProductCodeChangeAll(param) {
      const row = param.row
      const val = param.val
      row.productName = val.data.productName
    },
    onRevisionCountChange(param) { },
    onRevisionQuantityChange(param) { },
    onRevisionMeasurementQuantityChange(param) { }
  }
}
</script>
