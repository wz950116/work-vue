<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleClose'></qm-edit-tab>
</template>

<script>
export default {
  name: 'spotMarket',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dd/market/product/getByCode'
        },
        apiData: {
          search(params) {
            return params.marketCode
          }
        },
        topBar: [
          {
            name: 'add',
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
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          cols: [
            {
              prop: 'productGroupName',
              width: '300',
              label: 'data.spotMarket.list.productGroupName'
            },
            {
              prop: 'productName',
              width: '300',
              label: 'data.spotMarket.list.productName'
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
    handleClose(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productGroupName'] = row.productGroupName
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
