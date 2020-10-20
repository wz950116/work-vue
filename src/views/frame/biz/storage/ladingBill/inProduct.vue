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
          search: '/api/warehouse/whLadingBillProduct/get'
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
          cols: [
            {
              label: 'storage.ladingBill.list.productName',
              prop: 'productName',
              width: '150',
              required: true,
              attrs: {
                clearable: true
              }
            },
            ...(this.param.type !== 'add' && this.param.type !== 'update' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            {
              label: 'storage.ladingBill.list.rightFlag',
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
              label: 'storage.ladingBill.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              maxlength: 10,
              attrs: {
                gtmin: 0,
                type: 'num'
              }
            },
            {
              label: 'storage.ladingBill.list.measurementQuantity',
              prop: 'measurementQuantity',
              width: '150',
              element: 'input-formatter',
              required: true,
              attrs: {
                gtmin: 0,
                type: 'weight'
              }
            },
            {
              label: 'storage.ladingBill.list.measurementUnitName',
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
              label: 'storage.ladingBill.list.ladingQuantity',
              prop: 'ladingQuantity',
              width: '150',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight'
              },
              required: true
            },
            {
              label: 'storage.ladingBill.list.productUnitName',
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
            ...(this.param.type !== 'add' && this.param.type !== 'update' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
            // 商品编码
            {
              prop: 'productCode',
              isShow: false
            },
            // 选择返回的批次商品编码
            {
              prop: 'lotProductDetailCode',
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
    }
  },
  methods: {
    handleClose(params) { }
  }
}
</script>
