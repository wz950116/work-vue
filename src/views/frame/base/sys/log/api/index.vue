<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!-- <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'>
      <!-- isException 此列特殊处理-->
      <template slot='isException' slot-scope='scope'>
        <el-tag size="mini" v-if="scope.row.isException==='1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
        <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
      </template>
    </qm-table>
    <!-- </template> -->
  </div>
</template>
<script>
export default {
  name: 'apiLog',
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
            staff: '',
            apiUrl: '',
            createDateStart: '',
            createDateEnd: '',
            funcModule: '',
            funcOperation: '',
            organ: null,
            isException: ''
          }
        },
        formData: [
          {
            width: '120',
            type: 'date',
            label: 'sys.log.requestTime',
            props: ['createDateStart', 'createDateEnd'],
            default: this.$toolUtil.getLatestWeek(),
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'sys.log.apiUrl',
            prop: 'apiUrl',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.log.account',
            prop: 'account',
            element: 'input-validate',
            clearable: true
          },
          {
            label: 'sys.log.exception',
            prop: 'isException',
            element: 'el-checkbox',
            attrs: {
              'true-label': '1',
              'false-label': ''
            }
          },
          {
            label: 'sys.log.tenantName',
            prop: 'tenantName',
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
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/sys/log/api'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'view',
            allowDblClick: true,
            i18n: 'sys.log.param',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/sys/log/api/parameter.vue')
          },
          {
            name: 'view',
            i18n: 'sys.log.exception',
            msg: this.$t('sys.log.msg.noException'),
            validate(currentRow) {
              return currentRow ? currentRow.isException === '1' : true
            },
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            type: 'dialog',
            component: () => import('@/views/frame/base/sys/log/api/exception.vue')
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
              label: 'sys.log.requestTime',
              width: '150'
            },
            {
              prop: 'apiUrl',
              label: 'sys.log.apiUrl',
              'min-width': '300'
            },
            {
              prop: 'executeTime',
              label: 'sys.log.executeTime'
            },
            {
              prop: 'account',
              label: 'sys.log.account'
            },
            {
              prop: 'loginType',
              label: 'sys.log.loginType',
              format: {
                dict: this.$t('datadict.loginType')
              }
            },
            {
              prop: 'tenantName',
              label: 'sys.log.tenantName'
            },
            {
              prop: 'identity',
              label: 'sys.log.identity',
              format: {
                dict: this.$t('datadict.userIdentity')
              }
            },
            {
              prop: 'ipAddress',
              label: 'sys.log.ipAddress',
              width: '150'
            },
            {
              prop: 'funcModule',
              label: 'sys.log.bizModel'
            },
            {
              prop: 'funcOperation',
              label: 'sys.log.operation'
            },
            {
              prop: 'isException',
              label: 'table.status',
              isSlot: true,
              align: 'center',
              width: '80'
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
  }
}
</script>

