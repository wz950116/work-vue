<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'warehouseWeightReport',
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
            warehouseCode: '',
            productCode: ''
          },
          defaultSortString: 'custName.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            label: 'storage.warehouseWeightReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.warehouseWeightReport.form.variety',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/cust/creditWhReport/goodsWightReport',
          export: '/api/cust/creditWhReport/goodsWightReport'
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
              label: 'storage.warehouseWeightReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              label: 'storage.warehouseWeightReport.list.variety',
              prop: 'productName',
              width: '120',
              align: 'left'
            },
            {
              label: 'storage.warehouseWeightReport.list.goodsAmountLimit',
              prop: 'limitQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'storage.warehouseWeightReport.list.warehouseCompanyAmount',
              prop: 'nowQuantity',
              width: '120',
              align: 'right',
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
