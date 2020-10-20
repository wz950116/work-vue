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
  name: 'negotiate',
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
            contractNo: '',
            negotiateDate: '',
            bizEmployeeCode: '',
            customerCode: ''
          },
          defaultSortString: 'negotiateDate.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.negotiate.form.negotiateDate',
            props: ['startDate', 'endDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.negotiate.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.negotiate.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/warehouse/whNegotiate/page',
          doDelete: '/api/warehouse/whNegotiate/remove',

          cancelAudit: '/api/warehouse/whNegotiate/cancelAudit'
        },
        apiData: {
          search(param) {
            return param.code
          },
          doDelete(param) {
            return param.code
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'negotiateAdd',
                params: {
                  type: 'add',
                  back: 'negotiate'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'negotiateUpdate',
                params: {
                  type: 'update',
                  id: currentRow.negotiateNo,
                  back: 'negotiate'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whNegotiate/validatedApi',
                data: row.negotiateNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.negotiateNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'negotiateView',
                params: {
                  type: 'view',
                  id: currentRow.negotiateNo,
                  back: 'negotiate'
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
                  value: currentRow.negotiateNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.negotiateNo // 变量值
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
                uk: currentRow.negotiateNo,
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
                uk: currentRow.negotiateNo // 变量值
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
                billNum: currentRow.negotiateNo
              }
            }
          },
          {
            name: 'export'
          },
          //list 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                negotiateNo: currentRow.negotiateNo
              }
            }
          },
          {
            name: 'refresh'
          }
        ],

        initSearch: true,
        isColset: true,
        table: {
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.negotiate.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'negotiateNo',
              width: '180',
              label: 'storage.negotiate.list.negotiateNo'
            },
            {
              prop: 'negotiateDate',
              label: 'storage.negotiate.form.negotiateDate',
              width: '120',
              align: 'center',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },

            {
              prop: 'contractNo',
              width: '180',
              label: 'storage.negotiate.list.contractNo'
            },
            {
              prop: 'customerName',
              width: '180',
              label: 'storage.negotiate.list.customerName'
            },
            {
              prop: 'bankName',
              width: '180',
              label: 'storage.negotiate.list.negotiateBankName'
            },
            {
              prop: 'currencyCode',
              width: '80',
              align: 'center',
              label: 'storage.negotiate.list.currencyCode',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              prop: 'originalCurrencyAmt',
              width: '120',
              label: 'storage.negotiate.list.amount',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              prop: 'lcNo',
              width: '180',
              label: 'storage.negotiate.list.lcNo'
            },
            {
              prop: 'bizOrganName',
              width: '120',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '120',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            {
              prop: 'bizEmployeeName',
              width: '120',
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '120',
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.optName'
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
