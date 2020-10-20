<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'feeSettlement',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            settleNo: '',
            startDate: '',
            endDate: '',
            customerNo: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'id.desc'
        },
        formData: [
          {
            label: 'fee.feeSettle.form.settleNo',
            prop: 'settleNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'fee.feeSettle.form.settleDate',
            props: ['startDate', 'endDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeSettle.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/fee/feeSettle/page',
          export: '/api/fee/feeSettle/export',
          doDelete: '/api/fee/feeSettle/remove',
          cancelAudit: '/api/fee/feeSettle/cancelAudit'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param.settleNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'feeSettlementAdd',
                params: {
                  type: 'add',
                  back: 'feeSettlement'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeSettlementUpdate',
                params: {
                  type: 'update',
                  id: currentRow.settleNo,
                  back: 'feeSettlement'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/feeSettle/validated',
                data: row.settleNo
              }
            }
          },
          {
            name: 'remove',
            getParam(param) {
              return param.settleNo
            },
            validateApi(row) {
              return {
                url: '/api/fee/feeSettle/validated',
                data: row.settleNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeSettlementView',
                params: {
                  type: 'view',
                  id: currentRow.settleNo,
                  back: 'feeSettlement'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '单据号: ' + currentRow.settleNo
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.settleNo // 变量值
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
                uk: currentRow.settleNo,
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
                uk: currentRow.settleNo // 变量值
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
                billNum: currentRow.settleNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                settleNo: currentRow.settleNo
              }
            }
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          sortable: 'custom',
          mergeProp: 'feeSettleFeeDetailDtoList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'biz.lbl.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'fee.feeSettle.list.settleNo',
              width: '180',
              prop: 'settleNo'
            },
            {
              label: 'fee.feeSettle.list.settleDate',
              width: '90',
              prop: 'settleDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'fee.feeSettle.list.customerNo',
              width: '180',
              prop: 'customerName'
            },
            {
              label: 'fee.feeSettle.list.feeName',
              width: '120',
              prop: 'feeName',
              isSon: true
            },
            {
              label: 'fee.feeSettle.list.feeDirection',
              width: '80',
              prop: 'feeDirection',
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              },
              isSon: true
            },

            {
              label: 'fee.feeSettle.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              },
              isSon: true
            },
            {
              label: 'fee.feeSettle.list.taxAmount',
              prop: 'taxAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              },
              isSon: true
            },
            {
              label: 'fee.feeSettle.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              },
              isSon: true
            },
            {
              label: 'fee.feeSettle.list.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              },
              isSon: true
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
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
  },
  methods: {}
}
</script>
