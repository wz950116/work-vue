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
  name: 'ladingOut',
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
            ladingOutNo: '',
            ladingOutDate: '',
            productCode: '',
            bizEmployeeCode: '',
            preBillNo: ''
          },
          defaultSortString: 'ladingOutNo.desc'
        },
        formData: [
          {
            label: 'storage.ladingOut.form.ladingOutNo',
            prop: 'ladingOutNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.ladingOut.form.ladingOutDate',
            props: ['ladingOutStartDate', 'ladingOutEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.ladingOut.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.ladingOut.form.preBillNo',
            prop: 'preBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              filterable: true,
              data: 'FUNC_ORG',
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
          search: '/api/warehouse/whLadingOut/list',
          doDelete: '/api/warehouse/whLadingOut/remove',

          cancelAudit: '/api/warehouse/whLadingOut/cancelAudit',
          export: '/api/warehouse/whLadingOut/list'
        },
        apiData: {
          search(param) {
            return param.code
          },
          doDelete(param) {
            return param.code
          },
          submit(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'ladingOutAdd',
                params: {
                  type: 'add',
                  back: 'ladingOut'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingOutUpdate',
                params: {
                  type: 'update',
                  id: currentRow.ladingOutNo,
                  back: 'ladingOut'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whLadingOut/validatedApi',
                data: row.ladingOutNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.ladingOutNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingOutView',
                params: {
                  type: 'view',
                  id: currentRow.ladingOutNo,
                  back: 'ladingOut'
                }
              }
            },
            $refs: this.$refs
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.ladingOutNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '提单直发号: ' + currentRow.ladingOutNo // 变量值
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
                uk: currentRow.ladingOutNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            $refs: this.$refs,
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.ladingOutNo // 变量值
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
                billNum: currentRow.ladingOutNo
              }
            }
          },
          {
            name: 'update',
            i18n: 'biz.btn.goodsTogether',
            iconName: '线性-齐货',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingOutComplete',
                params: {
                  type: 'complete',
                  id: currentRow.ladingOutNo,
                  back: 'ladingOut'
                }
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
                ladingOutNo: currentRow.ladingOutNo
              }
            }
          },
          {
            name: 'refresh'
          },
          {
            msg: this.$t('storage.ladingOut.msg.ladingOutCheck'),
            name: 'next',
            permitName: ['ladingOutCheck'],
            type: 'route',
            i18n: 'storage.ladingOut.btn.ladingOutCheck',
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            routeInfo(currentRow) {
              return {
                name: 'ladingOutCheckAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.ladingOutNo,
                  preBillType: 'WH_LADING_BILL_OUT',
                  back: 'ladingOut'
                }
              }
            }
          }
        ],

        isColset: true,
        table: {
          id: '',
          mergeProp: 'whLadingOutProductDtoList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              label: 'storage.ladingOut.list.auditStatus',
              align: 'center',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'ladingOutNo',
              width: '200',
              align: 'left',
              sortable: 'custom',
              label: 'storage.ladingOut.list.ladingOutNo'
            },
            {
              prop: 'ladingOutDate',
              width: '90',
              align: 'center',
              sortable: 'custom',
              label: 'storage.ladingOut.list.ladingOutDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'ladingOutType',
              align: 'center',
              width: '120',
              format: {
                dict: this.$t('datadict.ladingOutType')
              },
              label: 'storage.ladingOut.form.ladingOutType'
            },
            {
              prop: 'customerName',
              width: '230',
              align: 'left',
              sortable: 'custom',
              label: 'storage.ladingOut.list.customerName'
            },
            {
              prop: 'preBillType',
              align: 'center',
              width: '120',
              format: {
                dict: this.$t('datadict.bizCode')
              },
              label: 'storage.ladingOut.list.preBIllType'
            },
            {
              prop: 'preBillNo',
              width: '150',
              align: 'left',
              sortable: 'custom',
              label: 'storage.ladingOut.list.preBillNo'
            },
            {
              prop: 'productName',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingOut.list.productName',
              isSon: true
            },
            {
              prop: 'brand',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingBill.list.brand',
              isSon: true
            },
            {
              prop: 'spec',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingBill.list.spec',
              isSon: true
            },
            {
              prop: 'origin',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingBill.list.origin',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.ladingOut.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              },
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              sortable: 'custom',
              label: 'storage.ladingOut.list.ladingOutMeasurementQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'measurementUnitCode',
              width: '120',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.ladingOut.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'outQuantity',
              width: '120',
              sortable: 'custom',
              align: 'right',
              label: 'storage.ladingOut.list.ladingOutQuantity',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              prop: 'productUnitCode',
              width: '120',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.ladingOut.list.productUnitName',
              isSon: true
            },
            {
              prop: 'goodsFlag',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'storage.ladingOut.list.goodsFlag',
              default: '1',
              isSon: true
            },
            {
              prop: 'settlementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.ladingOut.list.settlementQuantity',
              isSon: true
            },
            {
              prop: 'bizOrganName',
              width: '90',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '90',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            {
              prop: 'bizEmployeeName',
              width: '90',
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '90',
              align: 'center',
              sortable: 'custom',
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
