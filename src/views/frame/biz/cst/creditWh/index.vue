<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'custCreditWh',
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
            custName: '',
            dateStart: '',
            dateEnd: '',
            auditStatus: '',
            warehouseName: ''
          },
          defaultSortString: 'dateStart.desc,dateEnd.desc,custCode.asc,id.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'cst.creditWh.form.date',
            props: ['dateStart', 'dateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'cst.creditWh.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditWh.form.warehouseName',
            prop: 'warehouseName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/cust/credit/listWh',
          doDelete: '/api/cust/credit/remove',
          cancelAudit: '/api/cust/credit/cancelAudit'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.custCreditNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'custCreditWhAdd',
                params: {
                  type: 'add',
                  back: 'custCreditWh'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'custCreditWhUpdate',
                params: {
                  type: 'update',
                  custCreditNo: currentRow.custCreditNo,
                  back: 'custCreditWh'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/cust/credit/validatedApi',
                data: row.custCreditNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.custCreditNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              const row = currentRow
              return {
                name: 'custCreditWhView',
                params: {
                  type: 'view',
                  custCreditNo: row.custCreditNo,
                  back: 'custCreditWh'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '仓储公司: ' + currentRow.custName
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.custCreditNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: textValue // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.custCreditNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.custCreditNo // 变量值
              }
            }
          },
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.custCreditNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          cols: [
            {
              label: 'biz.lbl.auditStatus',
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'cst.creditWh.list.custName',
              width: '220',
              prop: 'custName'
            },
            {
              label: 'cst.creditWh.list.dateStart',
              prop: 'dateStart',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditWh.list.dateEnd',
              prop: 'dateEnd',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditWh.list.creditDays',
              width: '100',
              align: 'right',
              prop: 'creditDays',
              sortable: false,
              format: {
                func: 'num'
              }
            },
            {
              label: 'cst.creditWh.list.warnAmount',
              prop: 'warnAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditWh.list.limitAmount',
              prop: 'limitAmount',
              width: '100',
              sortable: false,
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditWh.list.usedAmount',
              prop: 'usedAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditWh.list.useableAmount',
              prop: 'useableAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditWh.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '100',
              align: 'center'
            },
            {
              label: 'cst.creditWh.list.applyDt',
              prop: 'applyDt',
              width: '160',
              align: 'center'
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
