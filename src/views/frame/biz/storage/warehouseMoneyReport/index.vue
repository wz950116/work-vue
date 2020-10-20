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
  name: 'warehouseMoneyReport',
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
            warehouseCompany: []
          },
          defaultSortString: 'custName.asc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            label: 'storage.warehouseMoneyReport.form.warehouseCompany',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '3',
                auditStatus: '3'
              },
              filterable: true,
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/cust/creditWhReport/warehouseMoneyReport',
          export: '/api/cust/creditWhReport/warehouseMoneyReport'
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
              label: 'storage.warehouseMoneyReport.list.warehouseCompany',
              prop: 'custName',
              width: '200',
              align: 'left'
            },
            {
              label: 'storage.warehouseMoneyReport.list.goodsValueLimit',
              prop: 'limitAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'storage.warehouseMoneyReport.list.warehouseCompanyValue',
              prop: 'nowAmount',
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
