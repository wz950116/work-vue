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
  name: 'custCreditBr',
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
            optEmployeeName: ''
          },
          defaultSortString: 'dateStart.desc,dateEnd.desc,custCode.asc,id.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'cst.creditBr.form.date',
            props: ['dateStart', 'dateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'cst.creditBr.form.custName',
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
            label: 'cst.creditBr.form.optEmployeeName',
            prop: 'optEmployeeName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/cust/credit/listBr',
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
                name: 'custCreditBrAdd',
                params: {
                  type: 'add',
                  back: 'custCreditBr'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'custCreditBrUpdate',
                params: {
                  type: 'update',
                  custCreditNo: currentRow.custCreditNo,
                  back: 'custCreditBr'
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
            $refs: this.$refs,
            getParam(currentRow) {
              return currentRow.custCreditNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'custCreditBrView',
                params: {
                  type: 'view',
                  custCreditNo: currentRow.custCreditNo,
                  back: 'custCreditBr'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.custCreditNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '经纪商: ' + currentRow.custName // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          //撤回审批
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
              label: 'cst.creditBr.list.custName',
              width: '220',
              prop: 'custName'
            },
            {
              label: 'cst.creditBr.list.dateStart',
              prop: 'dateStart',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditBr.list.dateEnd',
              prop: 'dateEnd',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditBr.list.creditDays',
              prop: 'creditDays',
              width: '100',
              align: 'right'
            },
            {
              label: 'cst.creditBr.list.warnAmount',
              prop: 'warnAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditBr.list.limitAmount',
              prop: 'limitAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditBr.list.usedAmount',
              prop: 'usedAmount',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditBr.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '100',
              align: 'center'
            },
            {
              label: 'cst.creditBr.list.applyDt',
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
