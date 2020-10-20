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
  name: 'frozenBill',
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
            frozenBillNo: '',
            expireDate: '',
            expireDateStart: '',
            expireDateEnd: '',
            warehouseCode: '',
            productCodeList: [],
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'expireDate.desc, frozenBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.frozenBill.form.expireDate',
            props: ['expireDateStart', 'expireDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'storage.frozenBill.form.frozenBillNo',
            prop: 'frozenBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.frozenBill.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.frozenBill.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
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
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
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
          search: '/api/warehouse/whFrozenBill/list',
          export: '/api/warehouse/whFrozenBill/export',
          doDelete: '/api/warehouse/whFrozenBill/remove',

          cancelAudit: '/api/warehouse/whFrozenBill/cancelAudit'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.frozenBillNo
          },
          submit(param) {
            return param
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'frozenBillAdd',
                params: {
                  type: 'add',
                  back: 'frozenBill'
                }
              }
            },
            $refs: this.$refs
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'frozenBillUpdate',
                params: {
                  type: 'update',
                  frozenBillNo: currentRow.frozenBillNo,
                  back: 'frozenBill'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whFrozenBill/validatedApi',
                data: row.frozenBillNo
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.frozenBillNo
            },
            msg: this.$t('storage.frozenBill.validateMsg.remove'),
            validate(currentRow) {
              return true
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'frozenBillView',
                params: {
                  type: 'view',
                  frozenBillNo: currentRow.frozenBillNo,
                  back: 'frozenBill'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return {
                row: this.$refs.qmTable.currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: this.$refs.qmTable.currentRow.frozenBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '库存冻结单号: ' + this.$refs.qmTable.currentRow.frozenBillNo // 变量值
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
                uk: currentRow.frozenBillNo,
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
                uk: currentRow.frozenBillNo // 变量值
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
              return {
                billNum: currentRow.frozenBillNo
              }
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
                frozenBillNo: currentRow.frozenBillNo
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
          mergeProp: 'frozenProductList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.frozenBill.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'frozenBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.frozenBill.list.frozenBillNo'
            },
            {
              prop: 'expireDate',
              width: '100',
              label: 'storage.frozenBill.list.expireDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'warehouseName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.warehouseName'
            },
            {
              prop: 'stockDetailNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.frozenBill.list.stockDetailNo',
              isSon: true
            },
            {
              prop: 'inBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.frozenBill.list.inBillNo',
              isSon: true
            },
            {
              prop: 'inProductNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.frozenBill.list.inProductNo',
              isSon: true
            },
            {
              prop: 'inDetailNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.frozenBill.list.inDetailNo',
              isSon: true
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.frozenBill.list.productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'frozenCount',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.frozenCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'quantity',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.quantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'frozenQuantity',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.frozenQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              label: 'storage.frozenBill.list.productUnitCode',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.measurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'frozenMeasurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.frozenBill.list.frozenMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              label: 'storage.frozenBill.list.measurementUnitCode',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            {
              prop: 'bizOrganName',
              width: '120',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '120',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
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
