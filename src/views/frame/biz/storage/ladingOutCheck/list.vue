<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if='true||$route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)'>
      <qm-table-array ref='qmTable' :mainData='mainData'></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ladingOutCheck',
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
          defaultSortString: 'ladingOutConfirmNo.desc'
        },
        formData: [
          {
            label: 'storage.ladingOutCheck.form.ladingOutConfirmNo',
            prop: 'ladingOutConfirmNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.ladingOutCheck.form.ladingOutConfirmDate',
            props: ['ladingOutConfirmStartDate', 'ladingOutConfirmEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.ladingOutCheck.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true,
              filterable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.ladingOutCheck.form.lotNo',
            prop: 'lotNo',
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
          search: '/api/warehouse/whLadingOutCheck/list',
          doDelete: '/api/warehouse/whLadingOutCheck/remove',

          cancelAudit: '/api/warehouse/whLadingOutCheck/cancelAudit',
          export: '/api/warehouse/whLadingOutCheck/list'
        },
        apiData: {
          search(param) {
            return param.id
          },
          doDelete(param) {
            return param.id
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
                name: 'ladingOutCheckAdd',
                params: {
                  type: 'add',
                  back: 'ladingOutCheck'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingOutCheckUpdate',
                params: {
                  type: 'update',
                  id: currentRow.ladingOutConfirmNo,
                  back: 'ladingOutCheck'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whLadingOutCheck/validatedApi',
                data: row.ladingOutConfirmNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.ladingOutConfirmNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingOutCheckView',
                params: {
                  type: 'view',
                  id: currentRow.ladingOutConfirmNo,
                  back: 'ladingOutCheck'
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
                  value: currentRow.ladingOutConfirmNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.ladingOutConfirmNo // 变量值
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
                uk: currentRow.ladingOutConfirmNo,
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
                uk: currentRow.ladingOutConfirmNo // 变量值
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
                billNum: currentRow.ladingOutConfirmNo
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
                ladingOutConfirmNo: currentRow.ladingOutConfirmNo
              }
            }
          },
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        table: {
          id: '',
          mergeProp: 'whLadingOutCfmPickDtoList',
          cols: [
            {
              label: 'storage.ladingOutCheck.list.auditStatus',
              prop: 'auditStatus',
              width: '80',
              sortable: 'custom',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutConfirmNo',
              width: '200',
              align: 'left',
              sortable: 'custom',
              prop: 'ladingOutConfirmNo'
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutConfirmDate',
              prop: 'ladingOutConfirmDate',
              width: '120',
              sortable: 'custom',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'customerName',
              width: '230',
              align: 'left',
              sortable: 'custom',
              label: 'storage.ladingOut.list.customerName'
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutNo',
              width: '200',
              sortable: 'custom',
              prop: 'ladingOutNo',
              align: 'left',
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.productName',
              width: '120',
              sortable: 'custom',
              prop: 'productName',
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.brandName',
              width: '90',
              sortable: 'custom',
              prop: 'brand',
              isSon: true
            },
            {
              prop: 'spec',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingOutCheck.list.spec',
              isSon: true
            },
            {
              prop: 'origin',
              width: '120',
              sortable: 'custom',
              label: 'storage.ladingOutCheck.list.origin',
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.itemCount',
              prop: 'itemCount',
              width: '120',
              sortable: 'custom',
              attrs: {
                type: 'weight'
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              sortable: 'custom',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.checkMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              sortable: 'custom',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.measurementUnitName',
              width: '90',
              sortable: 'custom',
              prop: 'measurementUnitCode',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '120',
              sortable: 'custom',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.checkQuantity',
              prop: 'actualQuantity',
              width: '120',
              sortable: 'custom',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'storage.ladingOutCheck.list.productUnitName',
              width: '120',
              sortable: 'custom',
              prop: 'productUnitCode',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
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
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '90',
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
