<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleClose'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dd/productAllocation/getByCode'
        },
        apiData: {
          productItemCode: this.param.productItemCode,
          search() {
            return { productItemCode: this.productItemCode }
          }
        },
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            getParam() {
              return { productItemCode: this.productItemCode }
            },
            component: () => import('@/views/frame/biz/data/warehouse/deptChoose.vue'),
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
              label: 'data.productItem.list.organName',
              width: '300',
              prop: 'organName'
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
      this.$refs.tab.tableData = params

      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.organName
            })
            .includes(row.organName)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    }
  }
}
</script>
