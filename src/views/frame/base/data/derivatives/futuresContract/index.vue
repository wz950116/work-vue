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
  name: 'futuresContract',
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
            futuresVarietiesId: '',
            futuresContract: '',
            futuresContractCode: '',
            futuresContractName: '',
            customerId: '',
            yesNoOverdue: ''
          },
          defaultSortString: 'id.desc'
        },
        formData: [
          {
            label: 'dataHq.futuresContract.futuresVarietiesCode',
            prop: 'futuresVarietiesId',
            element: 'futures-varieties',
            component: () => import('@/views/frame/base/data/components/FuturesVarieties'),
            attrs: {
              showType: 'code',
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresContract.futuresContractCode',
            prop: 'futuresContractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresContract.futuresContractName',
            prop: 'futuresContractName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresContract.yesNoOverdue',
            prop: 'yesNoOverdue',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresContract.usingFlag',
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
          search: '/api/dd/futuresContract/list',
          doDelete: '/api/dd/futuresContract/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/derivatives/futuresContract/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/futuresContract/edit.vue')
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
            component: () => import('@/views/frame/base/data/derivatives/futuresContract/edit.vue')
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
              prop: 'futuresVarietiesCode',
              label: 'dataHq.futuresContract.futuresVarietiesCode'
            },
            {
              prop: 'futuresVarietiesName',
              label: 'dataHq.futuresContract.futuresVarietiesName'
            },
            {
              prop: 'exchangeName',
              label: 'dataHq.futuresContract.exchangeName'
            },
            {
              prop: 'contractMultiplier',
              align: 'right',
              label: 'dataHq.futuresContract.contractMultiplier',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              prop: 'futuresContractCode',
              label: 'dataHq.futuresContract.futuresContractCode'
            },
            {
              prop: 'futuresContractName',
              label: 'dataHq.futuresContract.futuresContractName'
            },
            {
              prop: 'startDate',
              align: 'center',
              label: 'dataHq.futuresContract.startDate',
              format: {
                func: 'dateFormat',
                dict: 'yyyy-MM-dd'
              }
            },
            {
              prop: 'endDate',
              align: 'center',
              label: 'dataHq.futuresContract.endDate',
              format: {
                func: 'dateFormat',
                dict: 'yyyy-MM-dd'
              }
            },
            {
              prop: 'currencyName',
              align: 'center',
              label: 'dataHq.futuresContract.currencyId'
            },
            {
              prop: 'yesNoOverdue',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'dataHq.futuresContract.yesNoOverdue'
            },
            {
              prop: 'dataAttr',
              align: 'center',
              format: {
                dict: this.$t('datadict.dataAttr')
              },
              label: 'dataHq.futuresContract.dataAttr'
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
