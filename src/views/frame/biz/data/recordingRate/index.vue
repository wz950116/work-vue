<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'recordingRate',
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
            currencyCode: '',
            currencyDate: ''
          },
          defaultSortString: 'currencySrc.asc,startDate.asc'
        },
        formData: [
          {
            label: 'data.recordingRate.form.currencyCode',
            prop: 'currencySrc',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
              params: {
                standardFlag: '0'
              },
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'data.recordingRate.form.currencyDate',
            props: ['dateFrom', 'dateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/recording/rate/list',
          doDelete: '/api/recording/rate/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/recordingRate/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/recordingRate/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.id
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/recordingRate/editForm.vue')
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
              prop: 'currencySrcName',
              width: '80',
              align: 'center',
              label: 'data.recordingRate.list.currencyCode'
            },
            {
              prop: 'startDate',
              label: 'data.recordingRate.list.startDate',
              width: '120',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              label: 'data.recordingRate.list.endDate',
              width: '120',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'exchangeRate',
              width: '150',
              align: 'right',
              label: 'data.recordingRate.list.exchangeRate',
              format: {
                func: 'thousands',
                dict: 6
              }
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
