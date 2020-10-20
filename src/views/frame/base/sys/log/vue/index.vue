<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!-- <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'>
    </qm-table>
    <!-- </template> -->
  </div>
</template>
<script>
export default {
  name: 'vueLog',
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
            prop: 'vueUrl',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/log/vue/page'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'view',
            allowDblClick: true,
            i18n: 'sys.log.exception',
            getParam: currentRow => {
              return currentRow.errStack
            },
            type: 'dialog',
            component: () => import('@/views/frame/base/sys/log/vue/exception.vue')
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
              label: 'sys.log.errorDate',
              width: '150'
            },
            {
              prop: 'vueUrl',
              label: 'sys.log.vueUrl',
              width: 200
            },
            {
              prop: 'errMessage',
              label: 'sys.log.vueErrMessage'
            },
            {
              prop: 'vmNode',
              label: 'sys.log.vmNode'
            },
            {
              prop: 'info',
              label: 'sys.log.vueInfo'
            },
            {
              prop: 'tenantCode',
              label: 'sys.log.tenantCode'
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

