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
  name: 'inCheck',
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
            inBillNo: '',
            inDateFrom: '',
            inDateTo: '',
            checkDateFrom: '',
            checkDateTo: '',
            warehouseCode: '',
            productCode: '',
            bizEmployeeCode: '',
            lotNo: '',
            supplierCode: '',
            deliverCode: '',
            checkFlag: '1'
          },
          defaultSortString: 'inDate.desc, inBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.inCheck.form.inCheckDate',
            props: ['inCheckDateFrom', 'inCheckDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inCheck.form.inCheckNo',
            prop: 'inCheckNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.inCheck.form.inDate',
            props: ['inDateFrom', 'inDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inCheck.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.inCheck.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.inCheck.form.productCode',
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
            label: 'storage.inCheck.form.supplierCode',
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
            label: 'storage.inCheck.form.deliverCode',
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
          search: '/api/warehouse/inCheckBill/list',
          export: '/api/warehouse/inCheckBill/export',
          doDelete: '/api/warehouse/inCheckBill/remove',

          cancelAudit: '/api/warehouse/inCheckBill/cancelAudit'
        },
        apiData: {
          search(param) {
            return param.code
          },
          doDelete(param) {
            return param.inCheckNo
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
                name: 'inCheckAdd',
                params: {
                  type: 'add',
                  back: 'inCheck'
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
                name: 'inCheckUpdate',
                params: {
                  type: 'update',
                  inCheckNo: currentRow.inCheckNo,
                  back: 'inCheck'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/inCheckBill/validatedApi',
                data: row.inCheckNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.inCheckNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'inCheckView',
                params: {
                  type: 'view',
                  inCheckNo: currentRow.inCheckNo,
                  back: 'inCheck'
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
                  value: currentRow.inCheckNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.inCheckNo // 变量值
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
                uk: currentRow.inCheckNo,
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
                uk: currentRow.inCheckNo // 变量值
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
                billNum: currentRow.inCheckNo
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
                inCheckNo: currentRow.inCheckNo
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
          mergeProp: 'inCheckProductList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'storage.inCheck.list.auditStatus',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'inCheckNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.inCheck.list.inCheckNo'
            },
            {
              prop: 'inCheckDate',
              width: '120',
              label: 'storage.inCheck.list.inCheckDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'inBillNo',
              width: '180',
              sortable: 'custom',
              label: 'storage.inCheck.list.inBillNo'
            },
            {
              prop: 'inDate',
              width: '90',
              label: 'storage.inCheck.list.inDate',
              sortable: 'custom',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            // {
            //   prop: 'preBillType',
            //   width: '120',
            //   align: 'center',
            //   label: 'storage.inCheck.list.preBillType',
            //   sortable: 'custom',
            //   format: {
            //     dict: this.$t('datadict.bizCode')
            //   }
            // },
            // {
            //   prop: 'preBillNo',
            //   width: '180',
            //   sortable: 'custom',
            //   label: 'storage.inCheck.list.preBillNo'
            // },
            {
              prop: 'supplierName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inCheck.list.supplierName'
            },
            {
              prop: 'deliverName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inCheck.list.deliverName',
              isShow: false
            },
            {
              prop: 'warehouseName',
              width: '180',
              sortable: 'custom',
              label: 'storage.inCheck.list.warehouseName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.inCheck.list.productName',
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
              label: 'storage.inCheck.list.rightFlag',
              isSon: true
            },
            {
              prop: 'actualCount',
              width: '120',
              align: 'right',
              label: 'storage.inCheck.list.actualCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'actualQuantity',
              width: '120',
              align: 'right',
              label: 'storage.inCheck.list.actualQuantity',
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
              label: 'storage.inCheck.list.productUnitCode',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              prop: 'actualMeasurementQuantity',
              width: '120',
              align: 'right',
              label: 'storage.inCheck.list.actualMeasurementQuantity',
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
              label: 'storage.inCheck.list.measurementUnitCode',
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
