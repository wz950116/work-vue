<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'area',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },
        formData: []
      },
      mainData: {
        api: {
          search: '/api/dd/area/treeArea',
          doDelete: '/api/dd/area/removeByCode'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              if (this.$refs.qmTable.currentRow) {
                return this.$refs.qmTable.currentRow.areaCode
              } else {
                return ''
              }
            },
            component: () => import('@/views/frame/biz/data/area/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.areaCode
            },
            component: () => import('@/views/frame/biz/data/area/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.areaCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.areaCode
            },
            component: () => import('@/views/frame/biz/data/area/editForm.vue')
          },
          // {
          //   name: 'export',
          //   $refs: this.$refs
          // },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],

        isColset: false,
        table: {
          id: this.$route.meta.title,
          rowKey: 'areaCode',
          expandAll: true,
          sortable: true,
          cols: [
            {
              prop: 'areaName',
              label: 'data.area.list.areaName',
              width: '300'
            },
            {
              prop: 'areaCode',
              label: 'data.area.list.areaCode',
              width: '200'
            }
          ]
        }
      }
    }
  }
}
</script>
