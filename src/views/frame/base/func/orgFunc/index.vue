<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
export default {
  name: 'orgFuncManage',
  components: {},
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          orderByField: 'key',
          data: {
            orgName: '',
            usingFlag: ''
          }
        },
        formData: [
          {
            label: 'func.org.organName',
            prop: 'orgName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/func/orgFunc/page',
          doDelete: '/api/func/orgFunc/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue'),
            getParam: () => {
              return this.$refs.qmTable.currentRow.code
            }
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.code
            }
          },
          {
            name: 'detailSet',
            type: 'route',
            routeInfo: () => {
              return {
                name: 'orgFuncDetail',
                type: 'detailSet',
                params: {
                  back: 'orgFuncManage',
                  code: this.$refs.qmTable.currentRow.code
                }
              }
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + 'ff',

          cols: [
            {
              prop: 'orgName',
              width: '300',
              label: 'func.org.organName'
            },
            {
              prop: 'usingFlag',
              label: 'biz.lbl.usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              sortable: false,
              prop: 'remark',
              label: 'biz.lbl.remark'
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

