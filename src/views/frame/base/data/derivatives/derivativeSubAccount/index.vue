<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'derivativeSubAccount',
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
            customerId: '',
            derivativeAccountCode: '',
            derivativeSubAccount: '',
            projectCode: '',
            organId: null,
            onlineStat: ''
          },
          defaultSortString: 'derivativeSubAccount.asc'
        },
        formData: [
          {
            label: 'dataHq.derivativeSubAccount.derivativeSubAccount',
            prop: 'derivativeSubAccount',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.derivativeSubAccount.projectId',
            prop: 'projectCode',
            element: 'base-select',
            attrs: {
              data: 'PROJECT',
              params: {
                usingFlag: '1', // 启用状态
                projectStat: '3' // 项目状态
              },
              clearable: true
            }
          },
          {
            label: 'dataHq.derivativeSubAccount.usingFlag',
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
          search: '/api/dd/subAccount/list',
          doDelete: '/api/dd/subAccount/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/derivatives/derivativeSubAccount/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/derivativeSubAccount/edit.vue')
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
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/derivativeSubAccount/edit.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'derivativeSubAccount',
              label: 'dataHq.derivativeSubAccount.derivativeSubAccount'
            },
            {
              prop: 'derivativeAccount',
              label: 'dataHq.derivativeSubAccount.derivativeAccount'
            },
            {
              prop: 'projectName',
              label: 'dataHq.derivativeSubAccount.projectName'
            },
            {
              prop: 'organName',
              label: 'dataHq.derivativeSubAccount.organCode'
            },
            {
              prop: 'deptName',
              label: 'dataHq.derivativeSubAccount.deptCode'
            },
            {
              prop: 'usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.bankAccount.list.usingFlag'
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
