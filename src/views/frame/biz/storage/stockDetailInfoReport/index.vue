<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if='true||$route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)'>
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'stockDetailInfoReport',
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
          defaultSortString: 'warehouseName.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'storage.stockDetailInfoReport.form.inDate',
            props: ['inDateFrom', 'inDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: this.$toolUtil.getLatestMonth()
          },
          {
            label: 'storage.stockDetailInfoReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.stockDetailInfoReport.form.productCode',
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
            label: 'goods.spec',
            prop: 'spec',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.stockDetailInfoReport.form.supplierCode',
            prop: 'supplierCode',
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
          search: '/api/warehouse/stockInfoReport/stockDetailInfoReport',
          export: '/api/warehouse/stockInfoReport/stockDetailInfoReport'
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
              label: 'storage.stockDetailInfoReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'supplierName',
              width: '180',
              align: 'left',
              label: 'storage.stockDetailInfoReport.list.supplierName'
            },
            {
              prop: 'inBillNo',
              width: '180',
              align: 'left',
              label: 'storage.stockDetailInfoReport.list.inBillNo'
            },
            {
              prop: 'inDate',
              width: '120',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.stockDetailInfoReport.list.inDate'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'storage.stockDetailInfoReport.list.productName'
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.measurementQuantity'
            },
            {
              prop: 'quantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.quantity'
            },
            {
              prop: 'outMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.outMeasurementQuantity'
            },
            {
              prop: 'outQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.outQuantity'
            },
            {
              prop: 'lockMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.lockMeasurementQuantity'
            },
            {
              prop: 'lockQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.lockQuantity'
            },
            {
              prop: 'restMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.restMeasurementQuantity'
            },
            {
              prop: 'measurementUnitCode',
              width: '85',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.stockDetailInfoReport.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'restQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockDetailInfoReport.list.restQuantity'
            },
            {
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.stockDetailInfoReport.list.productUnitName',
              isSon: true
            },
            {
              prop: 'billAllPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'storage.stockDetailInfoReport.list.billAllPrice'
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
