<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if='true||$route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)'>
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
// 销售利润明细表
export default {
  name: 'salesGrossInfoReport',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        moreShowFlg: true,
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            warehouseCode: '',
            inDate: '',
            bizEmployeeCode: '',
            supplierCode: '',
            productCodeList: []
          },
          defaultSortString: 'billDate.desc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            label: 'storage.stockSalesGrossInfoReport.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.stockSalesGrossInfoReport.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.stockSalesGrossInfoReport.form.billDate',
            props: ['billDateFrom', 'billDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: this.$toolUtil.getLatestMonth()
          },
          {
            label: 'storage.stockSalesGrossInfoReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.stockSalesGrossInfoReport.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.stockSalesGrossInfoReport.form.customerName',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
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
              filterable: true,
              data: 'FUNC_ORG',
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
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/warehouse/stockInfoReport/salesGrossInfoReport',
          export: '/api/warehouse/stockInfoReport/salesGrossInfoReport'
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
              prop: 'contractNo',
              width: '180',
              align: 'left',
              label: 'storage.stockSalesGrossInfoReport.list.contractNo'
            },
            {
              prop: 'billNo',
              width: '180',
              align: 'left',
              label: 'storage.stockSalesGrossInfoReport.list.billNo'
            },
            {
              prop: 'billTypeName',
              width: '180',
              align: 'left',
              label: 'storage.stockSalesGrossInfoReport.list.billType'
            },
            {
              prop: 'billDate',
              width: '120',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.stockSalesGrossInfoReport.list.billDate'
            },
            {
              label: 'storage.stockSalesGrossInfoReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'customerName',
              width: '180',
              align: 'left',
              label: 'storage.stockSalesGrossInfoReport.list.customerName'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'storage.stockSalesGrossInfoReport.list.productName'
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'outQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockSalesGrossInfoReport.list.outQuantity'
            },
            {
              prop: 'actualQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockSalesGrossInfoReport.list.actualQuantity'
            },
            {
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.stockSalesGrossInfoReport.list.productUnitName',
              isSon: true
            },
            {
              prop: 'outMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockSalesGrossInfoReport.list.outMeasurementQuantity'
            },
            {
              prop: 'actualMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockSalesGrossInfoReport.list.actualMeasurementQuantity'
            },
            {
              prop: 'settlementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockSalesGrossInfoReport.list.settlementQuantity'
            },
            {
              prop: 'measurementUnitCode',
              width: '85',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.stockSalesGrossInfoReport.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'unitPrice',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.unitPrice'
            },
            {
              prop: 'outPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.outPrice'
            },
            {
              prop: 'unitFee',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.unitFee'
            },
            {
              prop: 'outFee',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.outFee'
            },
            {
              prop: 'inUnitPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.inUnitPrice'
            },
            {
              prop: 'inPrice',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.inPrice'
            },
            {
              prop: 'inUnitFee',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.inUnitFee'
            },
            {
              prop: 'inFee',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.inFee'
            },
            {
              prop: 'unitDifference',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.unitDifference'
            },
            {
              prop: 'salesGross',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockSalesGrossInfoReport.list.salesGross'
            },
            {
              prop: 'goodsFlag',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'storage.stockSalesGrossInfoReport.list.goodsFlag'
            },
            {
              prop: 'settlementStatus',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.settlementStatus')
              },
              label: 'storage.stockSalesGrossInfoReport.list.settlementStatus'
            },
            {
              prop: 'bizOrganName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizDeptName'
            },
            {
              prop: 'bizEmployeeName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
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
