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
  name: 'unregistBill',
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
            productCode: '',
            inBillNo: '',
            inDate: '',
            futuresExchangeCode: '',
            warehouseCode: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'unregistDate.desc, unregistNo.desc'
        },
        formData: [
          {
            label: 'storage.unregistBill.form.unregistNo',
            prop: 'unregistNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.unregistBill.form.unregistDate',
            props: ['unregistDateStart', 'unregistDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.unregistBill.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'storage.unregistBill.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
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
          search: '/api/warehouse/whUnregistBill/page',
          export: '/api/warehouse/whUnregistBill/export',
          doDelete: '/api/warehouse/whUnregistBill/remove',

          cancelAudit: '/api/warehouse/whUnregistBill/cancelAudit'
        },
        apiData: {
          doDelete(param) {
            return param.registNo
          },
          submit(param) {
            return param
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            permitName: ['acceptance'],
            i18n: 'biz.btn.add',
            type: 'route',
            routeInfo() {
              return {
                name: 'unregistBillAdd',
                params: {
                  type: 'add',
                  back: 'unregistBill'
                }
              }
            }
          },
          {
            name: 'update',
            permitName: ['acceptance'],
            i18n: 'biz.btn.update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'unregistBillEdit',
                params: {
                  type: 'update',
                  id: currentRow.unregistNo,
                  back: 'unregistBill'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whUnregistBill/validated',
                data: row.unregistNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.unregistNo
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whUnregistBill/validated',
                data: row.unregistNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'unregistBillView',
                params: {
                  type: 'view',
                  id: currentRow.unregistNo,
                  back: 'unregistBill'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.unregistNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.unregistNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.unregistNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.unregistNo // 变量值
              }
            }
          },
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return currentRow.unregistNo
            }
          },
          {
            name: 'export'
          },
          //list 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                unregistNo: currentRow.unregistNo
              }
            }
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],

        initSearch: true,
        isColset: true,
        table: {
          id: '',
          mergeProp: 'detailList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.unregistBill.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'unregistNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.unregistBill.list.unregistNo'
            },
            {
              prop: 'unregistDate',
              width: '120',
              label: 'storage.unregistBill.list.unregistDate',
              align: 'center',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'supplierName',
              width: '180',
              label: 'storage.unregistBill.list.supplierName',
              sortable: 'custom',
              isSon: true
            },
            {
              prop: 'warehouseName',
              width: '180',
              label: 'storage.unregistBill.list.warehouseName',
              isSon: true
            },
            {
              prop: 'productName',
              width: '120',
              label: 'storage.unregistBill.list.productName',
              isSon: true
            },
            {
              prop: 'brand',
              width: '120',
              label: 'storage.unregistBill.list.brand',
              isSon: true
            },
            {
              prop: 'spec',
              width: '120',
              label: 'storage.unregistBill.list.spec',
              isSon: true
            },
            {
              prop: 'origin',
              width: '120',
              label: 'storage.unregistBill.list.origin',
              isSon: true
            },
            {
              prop: 'productKeyAttr01',
              width: '120',
              label: 'storage.unregistBill.list.productKeyAttr01',
              isSon: true
            },
            {
              prop: 'productKeyAttr02',
              width: '120',
              label: 'storage.unregistBill.list.productKeyAttr02',
              isSon: true
            },
            {
              prop: 'productKeyAttr03',
              width: '120',
              label: 'storage.unregistBill.list.productKeyAttr03',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '100',
              align: 'right',
              label: 'storage.unregistBill.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'unregistQuantity',
              width: '100',
              align: 'right',
              label: 'storage.unregistBill.list.unregistQuantity',
              format: {
                func: 'thousands',
                dict: 6
              },
              isSon: true
            },
            {
              prop: 'productUnitCode',
              width: '80',
              label: 'storage.unregistBill.list.productUnitCode',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'unregistMeasurementQuantity',
              width: '100',
              align: 'right',
              label: 'storage.unregistBill.list.unregistMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 6
              },
              isSon: true
            },
            {
              prop: 'measurementUnitCode',
              width: '80',
              label: 'storage.unregistBill.list.measurementUnitCode',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'bizEmployeeName',
              width: '120',
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '120',
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.optName'
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
