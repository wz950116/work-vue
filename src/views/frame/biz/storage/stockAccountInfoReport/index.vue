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
  name: 'stockAccountInfoReport',
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
            type: 'date',
            label: 'storage.stockAccountInfoReport.form.billDate',
            props: ['billDateFrom', 'billDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: this.$toolUtil.getLatestMonth()
          },
          {
            label: 'storage.stockAccountInfoReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.stockAccountInfoReport.form.productCode',
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
            label: 'storage.stockAccountInfoReport.form.customerName',
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
          search: '/api/warehouse/stockInfoReport/stockAccountInfoReport',
          export: '/api/warehouse/stockInfoReport/stockAccountInfoReport'
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
              prop: 'billNo',
              width: '180',
              align: 'left',
              label: 'storage.stockAccountInfoReport.list.billNo'
            },
            {
              prop: 'billTypeName',
              width: '180',
              align: 'left',
              label: 'storage.stockAccountInfoReport.list.billType'
            },
            {
              prop: 'billDate',
              width: '120',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.stockAccountInfoReport.list.billDate'
            },
            {
              label: 'storage.stockAccountInfoReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'customerName',
              width: '180',
              align: 'left',
              label: 'storage.stockAccountInfoReport.list.customerName'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'storage.stockAccountInfoReport.list.productName'
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.measurementQuantity'
            },
            {
              prop: 'quantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.quantity'
            },
            {
              prop: 'lockMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.lockMeasurementQuantity'
            },
            {
              prop: 'lockQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.lockQuantity'
            },
            {
              prop: 'outMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.outMeasurementQuantity'
            },
            {
              prop: 'outQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.outQuantity'
            },
            {
              prop: 'restMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.restMeasurementQuantity'
            },
            {
              prop: 'measurementUnitCode',
              width: '85',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.stockAccountInfoReport.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'restQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              label: 'storage.stockAccountInfoReport.list.restQuantity'
            },
            {
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.stockAccountInfoReport.list.productUnitName',
              isSon: true
            },
            {
              prop: 'unitPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.unitPrice'
            },
            {
              prop: 'unitFee',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.unitFee'
            },
            {
              prop: 'billPrice',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.billPrice'
            },
            {
              prop: 'billFee',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.billFee'
            },
            {
              prop: 'outPrice',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.outPrice'
            },
            {
              prop: 'outFee',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              label: 'storage.stockAccountInfoReport.list.outFee'
            },
            {
              prop: 'taxRate',
              width: '120',
              align: 'right',
              format: {
                func: 'taxrate'
              },
              label: 'storage.stockAccountInfoReport.list.taxRate'
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
            show: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>
