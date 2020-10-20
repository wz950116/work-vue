<template>
  <div class="app-container calendar-list-container">
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'accountPeriod',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      },

      mainData: {
        api: {
          search: '/api/data/accountPeriod/list',
          doDelete: '/api/data/accountPeriod/remove',
          set: '/api/data/accountPeriod/update'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/accountPeriod/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/accountPeriod/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'accountPeriodView',
                path: '/data/accountPeriodView',
                params: this.$refs.qmTable.currentRow
              }
            }
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'fiscalYear',
              label: 'dataHq.accountPeriod.fiscalYear',
              align: 'center'
            },
            {
              prop: 'periodNumber',
              label: 'dataHq.accountPeriod.periodNumber',
              align: 'center'
            },
            {
              prop: 'quarterlyNumber',
              label: 'dataHq.accountPeriod.quarterlyNumber',
              align: 'center'
            },
            {
              prop: 'startDate',
              label: 'dataHq.accountPeriod.startDate',
              align: 'center',
              type: 'date',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM'
              }
            },
            {
              prop: 'endDate',
              label: 'dataHq.accountPeriod.endDate',
              align: 'center',
              type: 'date',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM'
              }
            },
            {
              prop: 'usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.accountPeriod.usingFlag'
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
