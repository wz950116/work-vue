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
  name: 'outNotice',
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
            outBillNo: '',
            outDateStart: '',
            outDateEnd: '',
            warehouseCode: '',
            productCodeList: [],
            bizEmployeeCode: '',
            lotNo: '',
            customerCode: '',
            settlementCode: ''
          },
          defaultSortString: 'outDate.desc, outBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.outNotice.form.outDate',
            props: ['outDateStart', 'outDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outNotice.form.outBillNo',
            prop: 'outBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.outNotice.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.outNotice.form.productCode',
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
            label: 'storage.outNotice.form.preBillNo',
            prop: 'preBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.outNotice.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'storage.outNotice.form.settlementCode',
            prop: 'settlementCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            },
            isShow: false
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
          search: '/api/warehouse/whOutBill/list',
          export: '/api/warehouse/whOutBill/export',
          doDelete: '/api/warehouse/whOutBill/remove',

          cancelAudit: '/api/warehouse/whOutBill/cancelAudit'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.outBillNo
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
                name: 'outNoticeAdd',
                params: {
                  type: 'add',
                  back: 'outNotice'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'outNoticeUpdate',
                params: {
                  type: 'update',
                  id: currentRow.outBillNo,
                  back: 'outNotice'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whOutBill/validatedApi',
                data: row.outBillNo
              }
            }
          },
          {
            name: 'update',
            i18n: 'biz.btn.goodsTogether',
            iconName: '线性-齐货',
            type: 'route',
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            routeInfo(currentRow) {
              return {
                name: 'outNoticeComplete',
                params: {
                  type: 'complete',
                  id: currentRow.outBillNo,
                  back: 'outNotice'
                }
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.outBillNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'outNoticeView',
                params: {
                  type: 'view',
                  id: currentRow.outBillNo,
                  back: 'outNotice'
                }
              }
            }
          },
          {
            name: 'add',
            type: 'dialog',
            iconName: '线性-打印',
            i18n: 'biz.btn.print',
            component: () => import('./temp/edit.vue')
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
                uk: currentRow.outBillNo,
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
                uk: currentRow.outBillNo // 变量值
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
                billNum: currentRow.outBillNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
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
                  value: currentRow.outBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.outBillNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            msg: this.$t('storage.outNotice.validateMsg.outCheck'),
            name: 'next',
            permitName: ['outCheck'],
            type: 'route',
            i18n: 'storage.outNotice.btn.outCheck',
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            routeInfo(currentRow) {
              return {
                name: 'outCheckAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.outBillNo,
                  preBillType: 'WH_OUT_BILL',
                  back: 'outNotice'
                }
              }
            }
          }
        ],

        initSearch: true,
        isColset: true,
        table: {
          id: '',
          mergeProp: 'outProductList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.outNotice.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'outBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.outNotice.list.outBillNo'
            },
            {
              prop: 'outDate',
              width: '90',
              align: 'center',
              label: 'storage.outNotice.list.outDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'outType',
              width: '90',
              align: 'center',
              label: 'storage.outNotice.list.outType',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.outType')
              }
            },
            {
              prop: 'preBillType',
              width: '120',
              align: 'center',
              label: 'storage.outNotice.list.preBillType',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              prop: 'preBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.outNotice.list.preBillNo'
            },
            {
              prop: 'customerName',
              width: '180',
              sortable: 'custom',
              label: 'storage.outNotice.list.customerName'
            },
            {
              prop: 'settlementName',
              width: '180',
              sortable: 'custom',
              label: 'storage.outNotice.list.settlementName',
              isShow: false
            },
            {
              prop: 'warehouseName',
              width: '180',
              sortable: 'custom',
              label: 'storage.outNotice.list.warehouseName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.outNotice.list.productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            ...this.$store.state.user.reserveGoodColsTxtSon,
            {
              prop: 'rightFlag',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'storage.outNotice.list.rightFlag',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              label: 'storage.outNotice.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'outQuantity',
              width: '120',
              align: 'right',
              label: 'storage.outNotice.list.outQuantity',
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
              label: 'storage.outNotice.list.productUnitName',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.outNotice.list.outMeasurementQuantity',
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
              label: 'storage.outNotice.list.measurementUnitName',
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
