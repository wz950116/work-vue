<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-lazy-table ref="qmTable" :mainData="mainData"></qm-lazy-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'conPcReportExcStat',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            bizOrganCode: '',
            bizDeptCode: '',
            dateFrom: '',
            dateTo: ''
          },
          defaultSortString: 'customerCode.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'spot.contractLot.form.signDate',
            props: ['dateFrom', 'dateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
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
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/contract/pcReport/listReportExcStat',
          export: '/api/contract/pcReport/listReportExcStat'
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
          showSummary: true,
          cols: [
            {
              label: 'biz.lbl.bizOrganName',
              prop: 'bizOrganName',
              width: '180'
            },
            {
              label: 'biz.lbl.bizDeptName',
              prop: 'bizDeptName',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.supplierName',
              prop: 'supplierName',
              width: '240'
            },
            {
              label: 'spot.contractLot.report.contractCnt',
              prop: 'contractCnt',
              width: '90',
              align: 'right'
            },
            {
              label: 'spot.contractLot.form.currency',
              prop: 'currency',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '120'
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              prop: 'measurementUnitCode',
              align: 'center',
              width: '90',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.contractLot.report.whInQty',
              prop: 'whInQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.whInChkQty',
              prop: 'whChkQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.whOutQty',
              prop: 'whOutQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.fundConfirmAmount',
              prop: 'fundConfirmAmount',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.report.invoiceQty',
              prop: 'invoiceQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.invoiceAmt',
              prop: 'invoiceAmt',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.report.settlementQty',
              prop: 'settlementQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.settlementAmt',
              prop: 'settlementAmt',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
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
