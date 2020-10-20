<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'operationLog',
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
          data: {
            account: '',
            createDateStart: '',
            createDateEnd: '',
            funcModule: '',
            funcOperation: ''
          }
        },

        formData: [
          {
            type: 'date',
            label: 'sys.log.operationTime',
            props: ['createDateStart', 'createDateEnd'],
            default: this.$toolUtil.getLatestWeek(),
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'sys.log.account',
            prop: 'account',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.log.bizModel',
            prop: 'funcModule',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.log.operation',
            prop: 'funcOperation',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.log.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.log.billType',
            element: 'input-validate',
            prop: 'billType',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/sys/log/operation'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'view',
            allowDblClick: true,
            component: () => import('@/views/frame/base/sys/log/operation/view.vue'),
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            }
          },
          {
            name: 'view',
            i18n: 'sys.log.param',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/sys/log/api/parameter.vue')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'createDate',
              width: '150',
              label: 'sys.log.operationTime'
            },
            {
              prop: 'account',
              width: '100',
              label: 'sys.log.account'
            },
            {
              prop: 'tenantName',
              width: '100',
              label: 'sys.log.tenantName'
            },
            {
              prop: 'loginType',
              label: 'sys.log.loginType',
              width: '100',
              format: {
                dict: this.$t('datadict.loginType')
              }
            },
            {
              prop: 'identity',
              label: 'sys.log.identity',
              width: '100',
              format: {
                dict: this.$t('datadict.userIdentity')
              }
            },
            {
              prop: 'ipAddress',
              width: '120',
              label: 'sys.log.ipAddress'
            },
            {
              prop: 'funcModule',
              width: '160',
              label: 'sys.log.bizModel'
            },
            {
              prop: 'funcOperation',
              width: '100',
              label: 'sys.log.operation',
              'show-overflow-tooltip': 'true'
            },
            {
              prop: 'dataType',
              width: '100',
              label: 'sys.log.bizData'
            },
            {
              prop: 'billNo',
              width: '200',
              label: 'sys.log.billNo'
            },
            {
              prop: 'billType',
              width: '120',
              label: 'sys.log.billType'
            },
            {
              prop: 'dataDescription',
              label: 'sys.log.outline',
              'min-width': '200',
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
