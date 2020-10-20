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
  name: 'warehouse',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            warehouseName: '',
            storeCompanyCode: '',
            warehouseType: '',
            usingFlag: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'data.warehouse.form.warehouseName',
            prop: 'warehouseName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.warehouse.form.storeCompanyCode',
            prop: 'storeCompanyCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              filterable: true,
              params: {
                typeCode: '3',
                usingFlag: '1',
                auditStatus: '3'
              }
            }
          },
          {
            label: 'data.warehouse.form.warehouseType',
            prop: 'warehouseType',
            element: 'base-select',
            list: this.$t('datadict.warehouseType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.warehouse.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/dd/warehouse/list',
          doDelete: '/api/dd/warehouse/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/warehouse/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.warehouseCode
            },
            component: () => import('@/views/frame/biz/data/warehouse/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.warehouseCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.warehouseCode
            },
            component: () => import('@/views/frame/biz/data/warehouse/editForm.vue')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'warehouseCode',
              width: '180',
              label: 'data.warehouse.list.warehouseCode'
            },
            {
              prop: 'warehouseName',
              width: '160',
              label: 'data.warehouse.list.warehouseName'
            },
            {
              prop: 'companyName',
              width: '160',
              label: 'data.warehouse.list.storeCompanyName'
            },
            {
              prop: 'warehouseType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.warehouseType')
              },
              label: 'data.warehouse.list.warehouseType'
            },
            {
              prop: 'warehouseLevel',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.warehouseLevel')
              },
              label: 'data.warehouse.list.warehouseLevel'
            },
            {
              prop: 'areaName',
              width: '120',
              label: 'data.warehouse.list.areaName'
            },
            {
              prop: 'address',
              minWidth: '200',
              label: 'data.warehouse.list.address'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.warehouse.list.usingFlag'
            },
            {
              prop: 'allocationType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.allocationType')
              },
              label: 'data.warehouse.list.allocationType'
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
