<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'>
        <!-- isException 此列特殊处理-->
        <template slot='isException' slot-scope='scope'>
          <el-tag size="mini" v-if="scope.row.isException==='1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
          <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
        </template>
      </qm-table>
    </template>

  </div>
</template>

<script>
export default {
  name: 'loginLog',
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
            createDateStart: '',
            createDateEnd: '',
            organ: null,
            isException: ''
          }
        },

        formData: [
          {
            type: 'date',
            label: 'sys.log.loginTime',
            props: ['createDateStart', 'createDateEnd'],
            default: this.$toolUtil.getLatestMonth(),
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
            label: 'sys.log.exception',
            prop: 'isException',
            element: 'el-checkbox',
            attrs: {
              'true-label': '1',
              'false-label': ''
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/sys/log/login'
        },
        isTopBar: true,
        topBar: [
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
          cols: [
            {
              prop: 'createDate',
              width: '150',
              label: 'sys.log.loginTime',
              align: 'center'
            },
            {
              prop: 'account',
              label: 'sys.log.account',
              width: '120'
            },
            {
              prop: 'loginType',
              width: '120',
              align: 'center',
              label: 'sys.log.loginType',
              format: {
                dict: this.$t('datadict.loginType')
              }
            },
            {
              prop: 'tenantName',
              width: '180',
              label: 'sys.log.tenantName'
            },
            {
              prop: 'isException',
              label: 'table.status',
              isSlot: true,
              width: '100',
              align: 'center'
            },
            {
              prop: 'ipAddress',
              width: '160',
              label: 'sys.log.ipAddress'
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

