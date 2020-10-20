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
  name: 'registBill',
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
          defaultSortString: 'registDate.desc, registNo.desc'
        },
        formData: [
          {
            label: 'storage.registBill.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'storage.registBill.form.registNo',
            prop: 'registNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.registBill.form.registDate',
            props: ['registDateStart', 'registDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.registBill.form.futuresExchangeCode',
            prop: 'futuresExchangeCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.registBill.form.warehouseCode',
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
          search: '/api/warehouse/whRegistBill/list',
          export: '/api/warehouse/whRegistBill/export',
          doDelete: '/api/warehouse/whRegistBill/remove',

          cancelAudit: '/api/warehouse/whRegistBill/cancelAudit'
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
                name: 'registBillAdd',
                params: {
                  type: 'add',
                  back: 'registBill'
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
                name: 'registBillEdit',
                params: {
                  type: 'update',
                  id: currentRow.registNo,
                  back: 'registBill'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whRegistBill/validated',
                data: row.registNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.registNo
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whRegistBill/validated',
                data: row.registNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'registBillView',
                params: {
                  type: 'view',
                  id: currentRow.registNo,
                  back: 'registBill'
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
                  value: currentRow.registNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.registNo // 变量值
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
                uk: currentRow.registNo,
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
                uk: currentRow.registNo // 变量值
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
              return currentRow.registNo
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
                registNo: currentRow.registNo
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
              label: 'storage.registBill.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'registNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.registBill.list.registNo'
            },
            {
              prop: 'registDate',
              width: '120',
              label: 'storage.registBill.list.registDate',
              align: 'center',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'futuresExchangeName',
              width: '180',
              sortable: 'custom',
              label: 'storage.registBill.list.futuresExchangeName'
            },
            {
              prop: 'warehouseName',
              width: '180',
              label: 'storage.registBill.list.warehouseName',
              sortable: 'custom'
            },
            {
              prop: 'inBillNo',
              width: '180',
              label: 'storage.registBill.list.inBillNo',
              isSon: true
            },
            {
              prop: 'lotNo',
              width: '180',
              label: 'storage.registBill.list.lotNo',
              isSon: true
            },
            {
              prop: 'supplierName',
              width: '180',
              label: 'storage.registBill.list.supplierName',
              isSon: true
            },
            {
              prop: 'productName',
              width: '120',
              label: 'storage.registBill.list.productName',
              isSon: true
            },
            {
              prop: 'brand',
              width: '120',
              label: 'storage.registBill.list.brand',
              isSon: true
            },
            {
              prop: 'spec',
              width: '120',
              label: 'storage.registBill.list.spec',
              isSon: true
            },
            {
              prop: 'origin',
              width: '120',
              label: 'storage.registBill.list.origin',
              isSon: true
            },
            {
              prop: 'productKeyAttr01',
              width: '120',
              label: 'storage.registBill.list.productKeyAttr01',
              isSon: true
            },
            {
              prop: 'productKeyAttr02',
              width: '120',
              label: 'storage.registBill.list.productKeyAttr02',
              isSon: true
            },
            {
              prop: 'productKeyAttr03',
              width: '120',
              label: 'storage.registBill.list.productKeyAttr03',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '100',
              align: 'right',
              label: 'storage.registBill.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'registQuantity',
              width: '100',
              align: 'right',
              label: 'storage.registBill.list.registQuantity',
              format: {
                func: 'thousands',
                dict: 6
              },
              isSon: true
            },
            {
              prop: 'productUnitCode',
              width: '80',
              label: 'storage.registBill.list.productUnitCode',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'registMeasurementQuantity',
              width: '100',
              align: 'right',
              label: 'storage.registBill.list.registMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 6
              },
              isSon: true
            },
            {
              prop: 'measurementUnitCode',
              width: '80',
              label: 'storage.registBill.list.measurementUnitCode',
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
