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
  name: 'inNotice',
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
            inBillNo: '',
            inDate: '',
            inDateStart: '',
            inDateEnd: '',
            warehouseCode: '',
            productCodeList: [],
            bizEmployeeCode: '',
            lotNo: '',
            supplierCode: '',
            deliverCode: ''
          },
          defaultSortString: 'inDate.desc, inBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.inNotice.form.inDate',
            props: ['inDateFrom', 'inDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inNotice.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.inNotice.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.inNotice.form.productCode',
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
          },
          {
            label: 'storage.inNotice.form.preBillNo',
            prop: 'preBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.inNotice.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'storage.inNotice.form.deliverCode',
            prop: 'deliverCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            },
            isShow: false
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warehouse/inBill/list',
          export: '/api/warehouse/inBill/export',
          doDelete: '/api/warehouse/inBill/remove',

          cancelAudit: '/api/warehouse/inBill/cancelAudit'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.inBillNo
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
                name: 'inNoticeAdd',
                params: {
                  type: 'add',
                  back: 'inNotice'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'inNoticeUpdate',
                params: {
                  type: 'update',
                  inBillNo: currentRow.inBillNo,
                  back: 'inNotice'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/inBill/validatedApi',
                data: row.inBillNo
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
                name: 'inNoticeComplete',
                params: {
                  type: 'complete',
                  inBillNo: currentRow.inBillNo,
                  back: 'inNotice'
                }
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.inBillNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'inNoticeView',
                params: {
                  type: 'view',
                  inBillNo: currentRow.inBillNo,
                  back: 'inNotice'
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
                  value: currentRow.inBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.inBillNo // 变量值
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
                uk: currentRow.inBillNo,
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
                uk: currentRow.inBillNo // 变量值
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
                billNum: currentRow.inBillNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                inBillNo: currentRow.inBillNo
              }
            }
          },
          {
            name: 'refresh'
          },
          {
            msg: this.$t('storage.inNotice.validateMsg.ihCheck'),
            name: 'next',
            permitName: ['inCheck'],
            type: 'route',
            i18n: 'storage.inNotice.btn.ihCheck',
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            routeInfo(currentRow) {
              return {
                name: 'inCheckAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.inBillNo,
                  preBillType: 'WH_IN_BILL',
                  back: 'inNotice'
                }
              }
            }
          }
        ],

        initSearch: true,
        isColset: true,
        table: {
          id: '',
          mergeProp: 'inProductList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.inNotice.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'inBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.inBillNo'
            },
            {
              prop: 'inDate',
              width: '90',
              label: 'storage.inNotice.list.inDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'preBillType',
              width: '120',
              align: 'center',
              label: 'storage.inNotice.list.preBillType',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              prop: 'preBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.preBillNo'
            },
            {
              prop: 'supplierName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.supplierName'
            },
            {
              prop: 'deliverName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.deliverName',
              isShow: false
            },
            {
              prop: 'warehouseName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inNotice.list.warehouseName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.inNotice.list.productName',
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
              label: 'storage.inNotice.list.rightFlag',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              label: 'storage.inNotice.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'inQuantity',
              width: '120',
              align: 'right',
              label: 'storage.inNotice.list.inQuantity',
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
              label: 'storage.inNotice.list.productUnitCode',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.inNotice.list.inMeasurementQuantity',
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
              label: 'storage.inNotice.list.measurementUnitCode',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            {
              prop: 'goodsFlag',
              width: '90',
              align: 'center',
              label: 'storage.inNotice.list.goodsFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              isSon: true
            },
            {
              prop: 'settlementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.inNotice.list.settlementQuantity',
              format: {
                func: 'thousands',
                dict: 3
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
