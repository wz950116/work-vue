<template>
  <div class="app-container calendar-list-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if='$route.name === $options.name'>
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'exchangeRate',
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
            exchangeRateCode: '',
            exchangeRateName: ''
          },
          defaultSortString: 'exchangeRateName.asc'
        },
        formData: [
          {
            label: 'dataHq.exchangeRate.form.exchangeRateCode',
            prop: 'exchangeRateCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchangeRate.form.exchangeRateName',
            prop: 'exchangeRateName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/data/exchangeRate/list',
          doDelete: '/api/data/exchangeRate/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/editForm.vue')
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
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/editForm.vue')
          },
          {
            name: 'refresh'
          },
          {
            name: 'update',
            iconName: '线性-新增',
            i18n: this.$t('dataHq.exchangeRate.form.conversionTitle'),
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/conversionMode.vue')
          },
          {
            name: 'update',
            iconName: '线性-新增',
            i18n: this.$t('dataHq.everyDayRate.title'),
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/everyDayRate.vue')
          },
          {
            name: 'update',
            iconName: '线性-新增',
            i18n: this.$t('dataHq.periodRate.title'),
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/proj/base/data/financial/exchangeRate/periodExchangeRate.vue')
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'exchangeRateCode',
              label: 'dataHq.exchangeRate.form.exchangeRateCode'
            },
            {
              prop: 'exchangeRateName',
              label: 'dataHq.exchangeRate.form.exchangeRateName'
            },
            {
              prop: 'remark',
              label: 'dataHq.exchangeRate.form.remark'
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
