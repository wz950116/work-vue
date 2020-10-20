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
  name: 'conPcReportExcStatDtl',
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
            auditStatus: '',
            tradeType: '',
            headlineCode: '',
            supplierCode: '',
            dateFrom: '',
            dateTo: ''
          },
          defaultSortString: 'docMakeDt.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            label: 'spot.contractLot.form.signDate',
            props: ['dateFrom', 'dateTo'],
            type: 'date',
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
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.tradeType',
            prop: 'tradeType',
            element: 'base-select',
            list: this.$t('datadict.tradeType'),
            attrs: {
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
          },
          {
            label: 'spot.contractLot.form.headlineNames',
            prop: 'headlineCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.contractState',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.contractStat'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/contract/pcReport/listConExcDtl',
          export: '/api/contract/pcReport/listConExcDtl'
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
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.contractState',
              width: '80',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.contractStat')
              }
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
              label: 'spot.contractLot.form.tradeType',
              width: '80',
              prop: 'tradeType',
              align: 'center',
              format: {
                dict: this.$t('datadict.tradeType')
              }
            },
            {
              label: 'spot.contractLot.form.contractType',
              width: '80',
              align: 'center',
              prop: 'contractType',
              format: {
                dict: this.$t('datadict.contractType')
              }
            },
            {
              label: 'spot.contractLot.form.headlineNames',
              prop: 'headlineNames',
              width: '300'
            },
            {
              label: 'spot.contractLot.form.supplierNames',
              prop: 'supplierNames',
              width: '210'
            },
            {
              label: 'spot.contractLot.form.contractLifeStart',
              width: '90',
              prop: 'contractLifeStart',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.contractLifeEnd',
              width: '90',
              prop: 'contractLifeEnd',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
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
              label: 'spot.contractLot.form.deliveryMarketName',
              width: '100',
              prop: 'deliveryMarketName'
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '120'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'spot.contractLot.form.productQuantity',
              width: '120',
              prop: 'productQuantity',
              summary: true,
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.productUnitCode',
              width: '90',
              prop: 'productUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              width: '120',
              prop: 'measurementQuantity',
              summary: true,
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              width: '90',
              prop: 'measurementUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'biz.lbl.bizOrganName',
              prop: 'bizOrganName',
              width: '90'
            },
            {
              label: 'biz.lbl.bizDeptName',
              prop: 'bizDeptName',
              width: '90'
            },
            {
              label: 'spot.contractLot.form.bizEmployeeName',
              width: '90',
              prop: 'bizEmployeeName'
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
              label: 'spot.contractLot.report.fundConfirmAmount',
              prop: 'fundAmt',
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
