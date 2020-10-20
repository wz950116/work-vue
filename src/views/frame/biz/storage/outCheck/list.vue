<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'outCheck',
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
            outBillNo: '',
            outDateStart: '',
            outDateEnd: '',
            checkDateStart: '',
            checkDateEnd: '',
            warehouseCode: '',
            productCodeList: [],
            bizEmployeeCode: '',
            lotNo: '',
            customerCode: '',
            settlementCode: ''
          },
          defaultSortString: 'outCheckDate.desc, outCheckNo.desc'
        },
        formData: [
          {
            label: 'storage.outCheck.form.outCheckNo',
            prop: 'outCheckNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.outCheck.form.outCheckDate',
            props: ['outCheckDateStart', 'outCheckDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outCheck.form.outBillNo',
            prop: 'outBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.outCheck.form.outDate',
            props: ['outDateStart', 'outDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outCheck.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.outCheck.form.productCode',
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
            label: 'storage.outCheck.form.customerCode',
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
            label: 'storage.outCheck.form.settlementCode',
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
          search: '/api/warehouse/whOutCheckBill/list',
          export: '/api/warehouse/whOutCheckBill/export',
          doDelete: '/api/warehouse/whOutCheckBill/remove',

          cancelAudit: '/api/warehouse/whOutCheckBill/cancelAudit'
        },
        apiData: {
          search(param) {
            return param.code
          },
          doDelete(param) {
            return param.outCheckNo
          },
          submit(param) {
            return param
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            i18n: 'biz.btn.add',
            type: 'route',
            routeInfo() {
              return {
                name: 'outCheckAdd',
                params: {
                  type: 'add',
                  back: 'outCheck'
                }
              }
            }
          },
          {
            name: 'update',
            i18n: 'biz.btn.update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'outCheckUpdate',
                params: {
                  type: 'update',
                  id: currentRow.outCheckNo,
                  back: 'outCheck'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whOutCheckBill/validatedApi',
                data: row.outCheckNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.outCheckNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'outCheckView',
                params: {
                  type: 'view',
                  id: currentRow.outCheckNo,
                  back: 'outCheck'
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
                  value: currentRow.outCheckNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.outCheckNo // 变量值
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
                uk: currentRow.outCheckNo,
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
                uk: currentRow.outCheckNo // 变量值
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
                billNum: currentRow.outCheckNo
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
                outCheckNo: currentRow.outCheckNo
              }
            }
          },
          {
            name: 'refresh'
          }
        ],

        initSearch: true,
        isColset: true,
        table: {
          id: '',
          mergeProp: 'outCheckProductList',
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
              prop: 'outCheckNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.outCheck.list.outCheckNo'
            },
            {
              prop: 'outCheckDate',
              width: '120',
              align: 'center',
              label: 'storage.outCheck.list.outCheckDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'outBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.outCheck.list.outBillNo'
            },
            {
              prop: 'outDate',
              width: '90',
              align: 'center',
              label: 'storage.outCheck.list.outDate',
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
              label: 'storage.outCheck.list.outType',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.outType')
              }
            },
            // {
            //   prop: 'preBillType',
            //   width: '120',
            //   align: 'center',
            //   label: 'storage.outNotice.list.preBillType',
            //   sortable: 'custom',
            //   format: {
            //     dict: this.$t('datadict.billType')
            //   }
            // },
            // {
            //   prop: 'preBillNo',
            //   width: '180',
            //   sortable: 'custom',
            //   label: 'storage.outNotice.list.preBillNo'
            // },
            {
              prop: 'customerName',
              width: '180',
              sortable: 'custom',
              label: 'storage.outCheck.list.customerName'
            },
            {
              prop: 'settlementName',
              width: '180',
              sortable: 'custom',
              label: 'storage.outCheck.list.settlementName',
              isShow: false
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.outCheck.list.productName',
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
              label: 'storage.outCheck.list.rightFlag',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '100',
              label: 'storage.outCheck.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'outQuantity',
              width: '100',
              label: 'storage.outCheck.list.outQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'actualQuantity',
              width: '100',
              label: 'storage.outCheck.list.actualQuantity',
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
              label: 'storage.outCheck.list.productUnitName',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              label: 'storage.outCheck.list.outMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'actualMeasurementQuantity',
              width: '120',
              label: 'storage.outCheck.list.actualMeasurementQuantity',
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
              label: 'storage.outCheck.list.measurementUnitName',
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
