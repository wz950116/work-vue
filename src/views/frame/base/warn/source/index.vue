<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'warnSource',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          defaultSortString: 'createDate.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },

        formData: [
          {
            label: 'data.warnSource.sourceCode',
            prop: 'sourceCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.warnSource.sourceName',
            prop: 'sourceName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warn/source/list',
          doDelete: '/api/warn/source/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.sourceCode
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          required: true,
          cols: [
            {
              prop: 'sourceName',
              width: '300',
              label: 'data.warnSource.sourceName'
            },
            {
              prop: 'sourceCode',
              width: '200',
              label: 'data.warnSource.sourceCode'
            },
            {
              prop: 'remark',
              sortable: false,
              label: 'biz.lbl.remark',
              'min-width': '400',
              'show-overflow-tooltip': 'true'
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },
  methods: {}
}
</script>
