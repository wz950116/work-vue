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
  name: 'bank',
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
            bankName: '',
            areaName: '',
            usingFlag: ''
          },
          defaultSortString: 'bankCode.desc'
        },
        formData: [
          {
            label: 'data.bank.form.bankName',
            prop: 'bankName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.areaName',
            prop: 'areaCode',
            element: 'tree-area',
            component: () => import('@/views/frame/biz/data/area/TreeArea.vue'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/dd/bank/list',
          doDelete: '/api/dd/bank/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/bank/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/bank/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.bankCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/bank/editForm.vue')
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
              prop: 'bankCode',
              width: '160',
              label: 'data.bank.list.bankCode'
            },
            {
              prop: 'bankName',
              width: '160',
              label: 'data.bank.list.bankName'
            },
            {
              prop: 'areaName',
              width: '160',
              label: 'data.bank.list.areaName'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.bank.list.usingFlag'
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
