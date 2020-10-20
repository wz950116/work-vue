<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/cust/creditWhProduct/listByCustCreditNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.custCreditNo
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'copy'],
            getParam() {
              return {}
            },
            component: () => import('@/views/frame/biz/data/product/choose.vue')
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
              label: 'cst.creditWh.list.productCode',
              prop: 'productName',
              required: true
            },
            {
              label: 'cst.creditWh.list.productUnitName',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'cst.creditWh.list.warehouseCode',
              prop: 'warehouseCode',
              required: true,
              element: 'base-select',
              list: [],
              attrs: {
                clearable: true,
                disabled: this.isReadonlyAll()
              }
            },
            {
              label: 'cst.creditWh.list.warnQuantity',
              prop: 'warnQuantity',
              required: true,
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.isReadonlyAll()
              }
            },
            {
              label: 'cst.creditWh.list.limitQuantity',
              prop: 'limitQuantity',
              required: true,
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.isReadonlyAll()
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    isReadonlyAll() {
      return false
    },
    handleClose(params) {
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
      })
    }
  }
}
</script>
