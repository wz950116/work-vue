<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'organCalendar',
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
            calendar: ''
          },
          defaultSortString: 'organCode.asc'
        },
        formData: [
          {
            label: 'data.organCalendar.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              clearable: true,
              data: 'TREE_ORGAN'
            }
          },
          {
            type: 'date',
            label: 'data.organCalendar.form.calendar',
            props: ['startDate', 'endDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/dd/organ/calendar/list',
          doDelete: '/api/dd/organ/calendar/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/organCalendar/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/data/organCalendar/editForm.vue')
          },
          {
            name: 'remove',
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/organCalendar/editForm.vue')
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
          id: '',
          cols: [
            {
              prop: 'organName',
              width: '160',
              label: 'data.organCalendar.list.organName'
            },
            {
              prop: 'dateYm',
              width: '160',
              label: 'data.organCalendar.list.yearMonth'
            },
            {
              prop: 'sumDay',
              width: '100',
              label: 'data.organCalendar.list.dayCount'
            },
            {
              prop: 'workDay',
              width: '100',
              label: 'data.organCalendar.list.tradingDayCnt'
            },
            {
              prop: 'noWorkDay',
              width: '100',
              label: 'data.organCalendar.list.nonTradingDayCnt'
            },
            {
              prop: 'notMaintainDay',
              width: '100',
              label: 'data.organCalendar.list.otherDayCnt'
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
