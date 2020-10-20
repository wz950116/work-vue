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
  name: 'interestRate',
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
            theDate: ''
          },
          defaultSortString: 'theDate.asc'
        },
        formData: [
          {
            label: 'dataHq.interestRate.currencyName',
            prop: 'currencyCode',
            element: 'currency',
            component: () => import('@/views/frame/base/data/components/Currency'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'dataHq.interestRate.theDate',
            prop: 'theDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/data/interestRate/list',
          doDelete: '/api/data/interestRate/remove'
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
            component: () => import('@/views/proj/base/data/financial/interestRate/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/interestRate/editForm.vue')
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
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/financial/interestRate/editForm.vue')
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
              prop: 'currencyName',
              label: 'dataHq.interestRate.currencyName'
            },
            {
              prop: 'theDate',
              label: 'dataHq.interestRate.theDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'interestRate',
              label: 'dataHq.interestRate.interestRate',
              align: 'right',
              format: {
                func: 'toPercent',
                dict: 2
              }
            },
            {
              prop: 'createUserName',
              label: 'dataHq.interestRate.createUserName',
              sortable:false
            },
            {
              prop: 'updateUserName',
              label: 'dataHq.interestRate.updateUserName',
              sortable:false
            },
            {
              prop: 'updateDateStr',
              label: 'dataHq.interestRate.updateDate'
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
