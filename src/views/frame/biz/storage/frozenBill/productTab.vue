<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose"></qm-edit-tab>
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
          search: '/api/warehouse/whFrozenBill/listProductByInCheckNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.frozenBillNo
          }
        },
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            iconName: '线性-增行',
            i18n: 'biz.btn.selectStockDetail',
            getParam() {
              return {}
            },
            component: () => import('@/views/frame/biz/storage/stock/stockSelect.vue'),
            validate: this.onStockDetail,
            initChoose: this.initChooseAdd,
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          }
        ],
        table: {
          cols: [
            {
              label: 'storage.frozenBill.list.stockDetailNo',
              prop: 'stockDetailNo',
              width: '180'
            },
            {
              label: 'storage.frozenBill.list.inBillNo',
              prop: 'inBillNo',
              width: '180'
            },
            {
              label: 'storage.frozenBill.list.inProductNo',
              prop: 'inProductNo',
              width: '180'
            },
            {
              label: 'storage.frozenBill.list.inDetailNo',
              prop: 'inDetailNo',
              width: '180'
            },
            {
              label: 'storage.frozenBill.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.frozenBill.list.itemCount',
              prop: 'itemCount',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.frozenBill.list.frozenCount',
              prop: 'frozenCount',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                clearable: true
              }
            },
            {
              label: 'storage.frozenBill.list.quantity',
              prop: 'quantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.frozenBill.list.restQuantity',
              prop: 'restQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              },
              isShow: false
            },
            {
              label: 'storage.frozenBill.list.frozenQuantity',
              prop: 'frozenQuantity',
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
              event: this.onFrozenQuantityChange
            },
            {
              label: 'storage.frozenBill.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.frozenBill.list.measurementQuantity',
              prop: 'measurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.frozenBill.list.restMeasurementQuantity',
              prop: 'restMeasurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              },
              isShow: false
            },
            {
              label: 'storage.frozenBill.list.frozenMeasurementQuantity',
              prop: 'frozenMeasurementQuantity',
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
              }
            },
            {
              label: 'storage.frozenBill.list.measurementUnitCode',
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
  },
  mounted() { },
  methods: {
    onFrozenQuantityChange(param) {
      const row = param.row
      const restMeasurementQuantity = Number(row.restMeasurementQuantity)
      if (param.val) {
        const frozenQuantity = Number(param.val)
        if (frozenQuantity < restMeasurementQuantity) {
          row.frozenMeasurementQuantity = param.val
        }
      }
    },
    // 增行按钮做相应验证
    onStockDetail() {
      if (!this.editForm.warehouseCode) {
        this.$notify(
          notifyInfo({
            // 请先选择仓库
            msg: this.$t('storage.frozenBill.validateMsg.chooseStockDetail')
          })
        )
        return false
      }
      return true
    },
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        warehouseCode: {
          disabled: true,
          value: this.editForm.warehouseCode
        }
      }
    },
    // 选择库存商品回调
    handleClose(params) {
      const productList = this.$refs.tab.tableData
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        productList[_index]['stockDetailNo'] = row.stockDetailNo
        productList[_index]['inBillNo'] = row.inBillNo
        productList[_index]['inProductNo'] = row.inProductNo
        productList[_index]['inDetailNo'] = row.inDetailNo
        productList[_index]['productCode'] = row.productCode
        productList[_index]['productName'] = row.productName
        productList[_index]['brand'] = row.brand
        productList[_index]['spec'] = row.spec
        productList[_index]['origin'] = row.origin
        productList[_index]['productKeyAttr01'] = row.productKeyAttr01
        productList[_index]['productKeyAttr02'] = row.productKeyAttr02
        productList[_index]['productKeyAttr03'] = row.productKeyAttr03
        productList[_index]['stockArea'] = row.stockArea
        productList[_index]['stockPosition'] = row.stockPosition
        productList[_index]['stockNo'] = row.stockNo
        productList[_index]['productUnitCode'] = row.productUnitCode
        productList[_index]['productUnitName'] = row.productUnitName
        productList[_index]['measurementUnitCode'] = row.measurementUnitCode
        productList[_index]['measurementUnitName'] = row.measurementUnitName

        productList[_index]['itemCount'] = row.itemCount
        productList[_index]['quantity'] = row.quantity
        productList[_index]['restQuantity'] = row.restQuantity
        productList[_index]['frozenQuantity'] = row.restQuantity
        productList[_index]['measurementQuantity'] = row.measurementQuantity
        productList[_index]['restMeasurementQuantity'] = row.restMeasurementQuantity
        productList[_index]['frozenMeasurementQuantity'] = row.restMeasurementQuantity
      })
      // 后过滤
      const newData = []
      productList.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.stockDetailNo + v.inBillNo + v.inProductNo + v.inDetailNo
            })
            .includes(row.stockDetailNo + row.inBillNo + row.inProductNo + row.inDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    }
  }
}
</script>
