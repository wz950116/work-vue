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
  name: 'salesSettlement',
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
            settlementNo: '',
            settlementDateFrom: '',
            settlementDateTo: '',
            supplierCode: '',
            contractNo: '',
            lotNo: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'docMakeDt.desc'
        },
        formData: [
          {
            label: 'spot.contractLot.form.settlementNo',
            prop: 'settlementNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'spot.contractLot.form.settlementDate',
            props: ['settlementDateFrom', 'settlementDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'spot.contractLot.form.supplierCode',
            prop: 'supplierCode',
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
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/contract/ssInfo/list',
          export: '/api/contract/ssInfo/export',
          doDelete: '/api/contract/ssInfo/remove',
          cancelAudit: '/api/contract/ssInfo/cancelAudit'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param.settlementNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'salesSettlementAdd',
                params: {
                  type: 'add',
                  back: 'salesSettlement'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'salesSettlementUpdate',
                params: {
                  type: 'update',
                  settlementNo: currentRow.settlementNo,
                  back: 'salesSettlement'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/contract/ssInfo/validatedApi',
                data: row.settlementNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.settlementNo
            },
            validateApi(row) {
              return {
                url: '/api/contract/ssInfo/validatedApi',
                data: row.settlementNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'salesSettlementView',
                params: {
                  type: 'view',
                  settlementNo: currentRow.settlementNo,
                  back: 'salesSettlement'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '单据号: ' + currentRow.settlementNo
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.settlementNo // 变量值
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
                uk: currentRow.settlementNo,
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
                uk: currentRow.settlementNo // 变量值
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
                billNum: currentRow.settlementNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                settlementNo: currentRow.settlementNo
              }
            }
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          mergeProp: 'productDetailList',
          cols: [
            {
              label: 'spot.contractLot.form.settlementState',
              width: '80',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.contractStat')
              }
            },
            {
              label: 'spot.contractLot.form.settlementNo',
              width: '180',
              prop: 'settlementNo'
            },
            {
              label: 'spot.contractLot.form.settlementDate',
              width: '90',
              prop: 'settlementDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.settlementType',
              width: '80',
              prop: 'settlementType',
              align: 'center',
              format: {
                dict: this.$t('datadict.settlementReceiptType')
              }
            },
            {
              label: 'spot.contractLot.form.headlineName',
              prop: 'headlineName',
              width: '300'
            },
            {
              label: 'spot.contractLot.form.customerName',
              prop: 'customerName',
              width: '210'
            },
            {
              label: 'spot.contractLot.form.amount',
              prop: 'amount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.taxAmount',
              prop: 'taxAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.lotNo',
              width: '180',
              prop: 'lotNo'
            },
            {
              label: 'spot.contractLot.form.settlementBillNo',
              width: '180',
              prop: 'settlementBillNo'
            },
            {
              label: 'spot.contractLot.form.tradeType',
              width: '80',
              prop: 'tradeType',
              align: 'center',
              format: {
                dict: this.$t('datadict.tradeType')
              }
            },
            {
              label: 'spot.contractLot.form.bizDeptName',
              width: '150',
              prop: 'bizDeptName'
            },
            {
              label: 'spot.contractLot.form.bizEmployeeName',
              width: '90',
              prop: 'bizEmployeeName',
              isSon: true
            },
            {
              label: 'spot.contractLot.form.optEmployeeName',
              width: '90',
              prop: 'optEmployeeName'
            },
            {
              label: 'spot.contractLot.form.docMakeDt',
              prop: 'docMakeDt',
              width: '150',
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
  },
  methods: {}
}
</script>
