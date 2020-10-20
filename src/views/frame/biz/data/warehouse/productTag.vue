<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleClose'></qm-edit-tab>
</template>

<script>
export default {
  name: 'warehouse',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dd/warehouseProduct/getByCode'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            getParam() {
              return {}
            },
            component: () => import('@/views/frame/biz/data/product/choose.vue'),
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
              label: 'data.warehouse.list.productName',
              prop: 'productName'
            },
            {
              label: 'data.warehouse.list.productUnitName',
              prop: 'productUnitCode',

              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              prop: 'measurementUnitCode',
              label: 'data.warehouse.list.measurementUnitName',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'data.warehouse.list.maxCapacity',
              prop: 'maxCapacity',
              required: true,
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3
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
    handleClose(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.productName
            })
            .includes(row.productName)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    }
  }
}
</script>
