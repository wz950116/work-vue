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
  name: 'custCreditUsedReport',
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
            custCode: '',
            contractNo: '',
            optEmployeeCode: '',
            createDateStart: '',
            createDateEnd: ''
          },
          defaultSortString: 'createDate.desc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'cst.custCreditUsedReport.form.createDate',
            props: ['createDateStart', 'createDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'cst.custCreditUsedReport.form.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '12',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'cst.custCreditUsedReport.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.custCreditUsedReport.form.optEmployeeCode',
            prop: 'optEmployeeCode',
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
          search: '/api/cust/creditUsedCs/list',
          export: '/api/cust/creditUsedCs/list'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'export',
            getParam() {
              return {
                autoWidth: true
              }
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + '_index',
          sortable: 'custom',
          cols: [
            {
              label: 'cst.custCreditUsedReport.list.custName',
              prop: 'custName',
              width: '200',
              align: 'left'
            },
            {
              label: 'cst.custCreditUsedReport.list.contractNo',
              prop: 'contractNo',
              width: '150',
              align: 'left'
            },
            {
              label: 'cst.custCreditUsedReport.list.creditQuotaType',
              prop: 'creditQuotaType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditQuotaType')
              }
            },
            {
              label: 'cst.custCreditUsedReport.list.docType',
              prop: 'docType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              label: 'cst.custCreditUsedReport.list.docNo',
              prop: 'docNo',
              width: '180',
              align: 'left'
            },
            {
              label: 'cst.custCreditUsedReport.list.usedType',
              prop: 'usedType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditUsedType')
              }
            },
            {
              label: 'cst.custCreditUsedReport.list.usedAmount',
              prop: 'usedAmount',
              width: '120',
              align: 'right'
            },
            {
              label: 'cst.custCreditUsedReport.list.creditQuota',
              prop: 'creditQuota',
              width: '120',
              align: 'right'
            },
            {
              label: 'cst.custCreditUsedReport.list.currency',
              prop: 'currency',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'cst.custCreditUsedReport.list.creditType',
              prop: 'creditType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditType')
              }
            },
            {
              label: 'cst.custCreditUsedReport.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '85',
              align: 'center'
            },
            {
              label: 'cst.custCreditUsedReport.list.createDate',
              prop: 'createDate',
              width: '135',
              align: 'right'
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
