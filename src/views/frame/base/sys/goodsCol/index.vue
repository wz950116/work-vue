<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'goodsColManage',
  data() {
    return {
      form: {
        listQuery: {
          defaultSortString: 'columnName.asc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },

        formData: []
      },

      mainData: {
        api: {
          search: '/api/sys/goodsCol/listAll'
        },
        isTopBar: true,
        initSearch: true,
        topBar: [
          {
            name: 'update',
            opType: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('./edit.vue')
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
              prop: 'usingFlag',
              width: '100',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'columnDatatype',
              width: '180',
              label: 'sys.goodsCol.columnDatatype'
            },
            {
              prop: 'columnTxt',
              width: '120',
              label: 'sys.goodsCol.columnTxt'
            },
            {
              prop: 'columnTxtEn',
              width: '120',
              label: 'sys.goodsCol.columnTxtEn'
            },
            {
              prop: 'columnSumflag',
              width: '100',
              align: 'center',
              label: 'sys.goodsCol.columnSumflag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'columnFormat',
              width: '200',
              label: 'sys.goodsCol.columnFormat',
              format: {
                dict: this.$t('datadict.numFormat')
              }
            },
            {
              prop: 'reservedStr5',
              width: '100',
              label: '×Öµä'
            },
            {
              prop: 'columnWidth',
              width: '100',
              label: 'sys.goodsCol.columnWidth'
            },
            {
              prop: 'orderNum',
              width: '80',
              label: 'sys.goodsCol.orderNum'
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
  }
}
</script>

