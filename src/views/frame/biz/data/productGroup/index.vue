<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'product',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 0,
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      },

      mainData: {
        api: {
          search: '/api/dd/product/group/treeProductGroup',
          doDelete: '/api/dd/product/group/remove'
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
                return this.$refs.qmTable.currentRow.productGroupCode
              } else {
                return ''
              }
            },
            component: () => import('@/views/frame/biz/data/productGroup/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productGroupCode
            },
            component: () => import('@/views/frame/biz/data/productGroup/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productGroupCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productGroupCode
            },
            component: () => import('@/views/frame/biz/data/productGroup/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + 'ff',
          rowKey: 'id',
          sortable: true,
          expandAll: true,
          cols: [
            {
              prop: 'productGroupName',
              width: '220',
              label: 'data.productGroup.list.productGroupName'
            }
          ]
        }
      }
    }
  }
}
</script>
