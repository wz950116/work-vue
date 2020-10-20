<template>
  <div class="app-container calendar-list-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'fiscalPeriod',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            organCode: '',
            fiscalYear: '',
            date: ''
          },
          defaultSortString: 'organName.asc,fiscalYear.asc,fiscalSDate.asc'
        },
        formData: [
          {
            label: 'data.fiscalPeriod.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              clickParent: true
            }
          },
          {
            label: 'data.fiscalPeriod.form.fiscalYear',
            prop: 'fiscalYear',
            element: 'base-select',
            attrs: {
              data: 'DATE',
              clearable: true,
              filterable: true
            }
          },
          {
            type: 'date',
            label: 'data.fiscalPeriod.form.date',
            props: ['fiscalSDate', 'fiscalEDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/fiscal/period/list',
          doDelete: '/api/fiscal/period/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/fiscalPeriod/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/fiscalPeriod/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/fiscalPeriod/editForm.vue')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'organName',
              width: '100',
              align: 'center',
              label: 'data.fiscalPeriod.list.organName'
            },
            {
              prop: 'fiscalYear',
              width: '100',
              label: 'data.fiscalPeriod.list.fiscalYear'
            },
            {
              prop: 'fiscalPeriodCode',
              width: '220',
              label: 'data.fiscalPeriod.list.fiscalPeriodCode'
            },
            {
              prop: 'fiscalSDate',
              align: 'center',
              width: '150',
              label: 'data.fiscalPeriod.list.startDate',
              format: {
                func: 'dateFormat'
              }
            },
            {
              prop: 'fiscalEDate',
              align: 'center',
              width: '150',
              label: 'data.fiscalPeriod.list.endDate',
              format: {
                func: 'dateFormat'
              }
            },
            {
              prop: 'businessCloseFlag',
              width: '120',
              format: {
                dict: this.$t('datadict.fiscalCloseFlag')
              },
              label: 'data.fiscalPeriod.list.businessCloseFlag'
            },
            {
              prop: 'financeCloseFlag',
              width: '120',
              format: {
                dict: this.$t('datadict.fiscalCloseFlag')
              },
              label: 'data.fiscalPeriod.list.financeCloseFlag'
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
