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
  name: 'revision',
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
            revisionNo: '',
            revisionDate: '',
            revisionDateStart: '',
            revisionDateEnd: '',
            warehouseCode: '',
            productCodeList: [],
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'revisionDate.desc, revisionNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.revision.form.revisionDate',
            props: ['revisionDateStart', 'revisionDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'storage.revision.form.revisionNo',
            prop: 'revisionNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.revision.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.revision.form.productCode',
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
          search: '/api/warehouse/whRevisionBill/list',
          export: '/api/warehouse/whRevisionBill/export',
          doDelete: '/api/warehouse/whRevisionBill/remove',

          cancelAudit: '/api/warehouse/whRevisionBill/cancelAudit'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.revisionNo
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
                name: 'revisionAdd',
                params: {
                  type: 'add',
                  back: 'revision'
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
                name: 'revisionUpdate',
                params: {
                  type: 'update',
                  revisionNo: currentRow.revisionNo,
                  back: 'revision'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whRevisionBill/validatedApi',
                data: row.revisionNo
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.revisionNo
            },
            msg: this.$t('storage.revision.validateMsg.remove'),
            validate(currentRow) {
              return true
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'revisionView',
                params: {
                  type: 'view',
                  revisionNo: currentRow.revisionNo,
                  back: 'revision'
                }
              }
            },
            $refs: this.$refs
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
                  value: this.$refs.qmTable.currentRow.revisionNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '库存调整单号: ' + this.$refs.qmTable.currentRow.revisionNo // 变量值
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
                uk: currentRow.revisionNo,
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
                uk: currentRow.revisionNo // 变量值
              }
            }
          },
          // {
          //   name: 'cancelAudit',
          //   msg: this.$t('biz.msg.disableCancelAudit'),
          //   validate(currentRow) {
          //     return currentRow.auditStatus === '3'
          //   },
          //   getParam(currentRow) {
          //     return {
          //       billNum: currentRow.revisionNo
          //     }
          //   }
          // },
          //list 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                revisionNo: currentRow.revisionNo
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
          mergeProp: 'revisionProductList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.revision.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'revisionNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.revision.list.revisionNo'
            },
            {
              prop: 'revisionDate',
              width: '90',
              label: 'storage.revision.list.revisionDate',
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
              prop: 'inBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.revision.list.inBillNo',
              isSon: true
            },
            {
              prop: 'inProductNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.revision.list.inProductNo',
              isSon: true
            },
            {
              prop: 'inDetailNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.revision.list.inDetailNo',
              isSon: true
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.revision.list.productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              label: 'storage.revision.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'revisionCount',
              width: '120',
              align: 'right',
              label: 'storage.revision.list.revisionCount',
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
              label: 'storage.revision.list.quantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'revisionQuantity',
              width: '120',
              align: 'right',
              label: 'storage.revision.list.revisionQuantity',
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
              label: 'storage.revision.list.productUnitCode',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.revision.list.measurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'revisionMeasurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.revision.list.revisionMeasurementQuantity',
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
              label: 'storage.revision.list.measurementUnitCode',
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
