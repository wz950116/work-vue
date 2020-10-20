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
  name: 'stockTransitInfoReport',
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
            type: 'date',
            label: 'storage.stockTransitInfoReport.form.billDate',
            props: ['billDateFrom', 'billDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: this.$toolUtil.getLatestMonth()
          },
          {
            label: 'storage.stockTransitInfoReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.stockTransitInfoReport.form.productCode',
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
            label: 'storage.stockTransitInfoReport.form.supplierCode',
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
          search: '/api/warehouse/stockInfoReport/stockTransitInfoReport',
          export: '/api/warehouse/stockInfoReport/stockTransitInfoReport'
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
              label: 'storage.stockTransitInfoReport.list.contractNo',
              prop: 'contractNo',
              width: '180',
              align: 'left'
            },
            {
              label: 'storage.stockTransitInfoReport.list.lotNo',
              prop: 'lotNo',
              width: '180',
              align: 'left'
            },
            {
              prop: 'billNo',
              width: '180',
              align: 'left',
              label: 'storage.stockTransitInfoReport.list.billNo'
            },
            {
              prop: 'billDate',
              width: '100',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.stockTransitInfoReport.list.billDate'
            },
            {
              prop: 'billTypeName',
              width: '180',
              align: 'left',
              label: 'storage.stockTransitInfoReport.list.bilType'
            },
            {
              label: 'storage.stockTransitInfoReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'supplierName',
              width: '180',
              align: 'left',
              label: 'storage.stockTransitInfoReport.list.supplierName'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'storage.stockTransitInfoReport.list.productName'
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
              label: 'storage.stockTransitInfoReport.list.measurementQuantity'
            },
            {
              prop: 'quantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockTransitInfoReport.list.quantity'
            },
            {
              prop: 'lockMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockTransitInfoReport.list.lockMeasurementQuantity'
            },
            {
              prop: 'lockQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockTransitInfoReport.list.lockQuantity'
            },
            {
              prop: 'restMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockTransitInfoReport.list.restMeasurementQuantity'
            },
            {
              prop: 'measurementUnitCode',
              width: '85',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.stockTransitInfoReport.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'restQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.stockTransitInfoReport.list.restQuantity'
            },
            {
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.stockTransitInfoReport.list.productUnitName',
              isSon: true
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
