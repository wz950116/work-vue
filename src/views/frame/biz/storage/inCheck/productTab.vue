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
          search: '/api/warehouse/inCheckProduct/listByInCheckNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.inCheckNo
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
          height: 150,
          cols: [
            {
              label: 'storage.inCheck.list.productName',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.inCheck.list.rightFlag',
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
              prop: 'itemCount',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.inCheck.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isShow: false
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
                disabled: true,
                clearable: true
              }
            },
            {
              prop: 'inQuantity',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.inCheck.list.inQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isShow: false
            },
            {
              prop: 'restQuantity',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.inCheck.list.restQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isShow: true
            },
            {
              label: 'storage.inCheck.list.actualQuantity',
              prop: 'actualQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
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
                disabled: true,
                clearable: true
              },
              required: true
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
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.inCheck.list.measurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isShow: false
            },
            {
              prop: 'restMeasurementQuantity',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.inCheck.list.restMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isShow: true
            },
            {
              label: 'storage.inCheck.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
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
                disabled: true,
                clearable: true
              },
              required: true
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
  methods: {
    doDelete(param) {
      this.deleteDetail(param)
    },
    deleteDetail(param) {
      const productDetailKey = this.getProductKey(param)
      const productDetailTableData = this.$parent.$parent.$refs.qmRouteEdit.$refs.inCheckDetailList['0'].$refs.tab.tableData
      for (let i = productDetailTableData.length - 1; i >= 0; i--) {
        const row = productDetailTableData[i]
        if (productDetailKey === this.getProductKey(row)) {
          productDetailTableData.splice(productDetailTableData.indexOf(row), 1)
        }
      }
    },
    getProductKey(param) {
      return param.productCode + param.brand + param.spec + param.origin + param.productKeyAttr01 + param.productKeyAttr02 + param.productKeyAttr03
    }
  }
}
</script>
