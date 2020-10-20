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
  name: 'conPcReportWhInfo',
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
          defaultSortString: 'inDate.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'spot.contractLot.form.inDate',
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
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/contract/pcReport/listPcWhInfo',
          export: '/api/contract/pcReport/listPcWhInfo'
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
              label: 'spot.contractLot.form.contractNo',
              prop: 'contractNo',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.signDate',
              prop: 'signDate',
              width: '90',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.supplierName',
              prop: 'supplierName',
              width: '240'
            },
            {
              label: 'spot.contractLot.report.warehouseName',
              prop: 'warehouseName',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.inDate',
              prop: 'inDate',
              width: '90',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.inBillNo',
              prop: 'inBillNo',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '120'
            },
            ...this.$store.state.user.mainGoodColsTxt,
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
              prop: 'inQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.whInChkQty',
              prop: 'inChkQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.inChkAmt',
              prop: 'inChkAmt',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.report.whOutQty',
              prop: 'outQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.outChkQty',
              prop: 'outChkQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.outChkAmt',
              prop: 'outChkAmt',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.report.stkQty',
              prop: 'stkQty',
              summary: true,
              align: 'right',
              width: '120',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.report.stkAmt',
              prop: 'stkAmt',
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
