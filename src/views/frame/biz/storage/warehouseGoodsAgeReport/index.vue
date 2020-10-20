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
  name: 'warehouseGoodsAgeReport',
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
            goodsDay: '',
            supplierCode: '',
            productCodeList: []
          },
          defaultSortString: 'warehouseName.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'storage.warehouseGoodsAgeReport.form.inDate',
            props: ['inStartDate', 'inEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.warehouseGoodsAgeReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.warehouseGoodsAgeReport.form.productCode',
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
            label: 'storage.warehouseGoodsAgeReport.form.supplierCode',
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
            label: 'storage.warehouseGoodsAgeReport.form.goodsDay',
            prop: 'goodsDay',
            element: 'input-validate',
            attrs: {
              type: 'num',
              clearable: true
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
          search: '/api/warehouse/whReport/goodsAgeReport',
          export: '/api/warehouse/whReport/goodsAgeReport'
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
              label: 'storage.warehouseGoodsAgeReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'supplierName',
              width: '180',
              align: 'left',
              label: 'storage.warehouseGoodsAgeReport.list.supplierName'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'storage.warehouseGoodsAgeReport.list.productName'
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'inBillNo',
              width: '180',
              align: 'left',
              label: 'storage.warehouseGoodsAgeReport.list.inBillNo'
            },
            {
              prop: 'inDate',
              width: '120',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.warehouseGoodsAgeReport.list.inDate'
            },
            {
              prop: 'restMeasurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.warehouseGoodsAgeReport.list.restMeasurementQuantity'
            },
            {
              prop: 'goodsDay',
              width: '120',
              align: 'right',
              format: {
                func: 'num'
              },
              label: 'storage.warehouseGoodsAgeReport.list.goodsDay'
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
