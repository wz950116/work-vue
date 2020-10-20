<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'cfgGoodsColManage',
  data() {
    return {
      form: {
        listQuery: {
          defaultSortString: 'orderNum.asc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },
        formData: []
      },
      mainData: {
        api: {
          search: '/api/platform/cfgGoodsCol/listAll',
          // 删除
          doDelete: '/api/platform/cfgGoodsCol/remove'
        },
        isTopBar: true,
        initSearch: true,
        topBar: [
          {
            name: 'add',
            opType: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            opType: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          sortable: true,
          id: this.$route.meta.title,
          cols: [
            {
              prop: 'columnName',
              width: '200',
              label: 'sys.goodsCol.columnName'
            },
            {
              prop: 'columnDatatype',
              width: '200',
              label: 'sys.goodsCol.columnDatatype'
            },
            {
              prop: 'columnTxt',
              label: 'sys.goodsCol.columnTxt',
              width: '200'
            },
            {
              prop: 'columnTxtEn',
              label: 'sys.goodsCol.columnTxtEn',
              width: '200'
            },
            {
              prop: 'columnSumflag',
              width: '100',
              label: 'sys.goodsCol.columnSumflag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'orderNum',
              width: '100',
              label: 'sys.goodsCol.orderNum'
            },
            {
              prop: 'proType',
              width: '100',
              label: 'sys.goodsCol.proType',
              format: {
                dict: this.$t('datadict.proType')
              }
            },
            {
              prop: 'usingFlag',
              width: '100',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },
  components: {},
  methods: {}
}
</script>

