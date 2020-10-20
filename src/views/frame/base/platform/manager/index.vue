<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!--     <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
export default {
  name: 'platformManager',
  data() {
    return {
      dialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          defaultSortString: 'id.desc',
          camelToUnderlineFlg: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            account: '',
            name: '',
            usingFlag: ''
          }
        },

        formData: [
          {
            label: 'platform.manager.account',
            prop: 'account',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'platform.manager.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            camelToUnderlineFlg: 'true',
            element: 'base-select',
            attrs: {
              clearable: false
            },
            list: this.$t('datadict.usingFlag')
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/cfgManager/list',
          // 删除
          doDelete: '/api/platform/cfgManager/remove',
          set: '/api/platform/cfgManager/resetPwd'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            opType: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/platform/manager/add.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            opType: 'view',
            type: 'dialog',
            getParam: currentRow => {
              return currentRow.id
            },
            component: () => import('@/views/frame/base/platform/manager/edit.vue')
          },
          {
            name: 'update',
            opType: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/frame/base/platform/manager/edit.vue')
          },
          {
            name: 'set',
            i18n: 'biz.btn.resetPwd',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
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
        initSearch: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'name',
              width: '200',
              label: 'platform.manager.name'
            },
            {
              prop: 'account',
              width: '200',
              label: 'platform.manager.account'
            },
            {
              prop: 'code',
              width: '120',
              label: 'platform.manager.code'
            },
            {
              prop: 'usingFlag',
              width: '80',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              label: 'platform.manager.failnum',
              prop: 'failnum',
              width: '120',
              align: 'right'
            },
            {
              label: 'platform.manager.loginTime',
              prop: 'loginTime',
              width: '140'
            },
            {
              sortable: false,
              prop: 'remark',
              'min-width': '300',
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
  components: {},
  methods: {}
}
</script>

