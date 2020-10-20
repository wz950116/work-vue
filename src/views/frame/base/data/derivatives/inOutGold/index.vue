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
  name: 'inOutGold',
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
            derivativeAccount: '',
            deptCode: '',
            strategyCode: ''
          },
          defaultSortString: 'id.desc'
        },
        formData: [
          {
            label: 'dataHq.inOutGold.form.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.deptName',
            prop: 'deptCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_DEPT',
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.strategyName',
            prop: 'strategyCode',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true,
              params: {
                auditStatus: '3'
              }
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/data/ddInOutGold/page',
          doDelete: '/api/data/ddInOutGold/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/derivatives/inOutGold/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/inOutGold/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam(currentRow) {
              return currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/inOutGold/editForm.vue')
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
              prop: 'derivativeAccount',
              width: '120',
              label: 'dataHq.inOutGold.list.derivativeAccount'
            },
            {
              prop: 'derivativeSubAccount',
              width: '120',
              label: 'dataHq.inOutGold.list.derivativeSubAccount'
            },
            {
              prop: 'deptName',
              width: '120',
              label: 'dataHq.inOutGold.list.deptName'
            },
            {
              prop: 'strategyName',
              width: '120',
              label: 'dataHq.inOutGold.list.strategyName'
            },
            {
              prop: 'outGold',
              width: '120',
              label: 'dataHq.inOutGold.list.outGold',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'inGold',
              width: '120',
              label: 'dataHq.inOutGold.list.inGold',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'currencyName',
              width: '100',
              label: 'dataHq.inOutGold.list.currencyCode'
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
