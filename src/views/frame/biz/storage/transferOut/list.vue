<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref='qmTable' :mainData='mainData'></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'transferOut',
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
            transferOutBillNo: '',
            transferOutDateStart: '',
            transferOutDateEnd: '',
            outWarehouseCode: '',
            inWarehouseCode: '',
            outDeptCode: '',
            inDeptCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'transferOutDate.desc, transferOutBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.transferOut.form.transferOutDate',
            props: ['transferOutDateStart', 'transferOutDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.transferOut.form.transferOutBillNo',
            prop: 'transferOutBillNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {},
          {
            label: 'storage.transferOut.form.outWarehouseCode',
            prop: 'outWarehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.inWarehouseCode',
            prop: 'inWarehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.outDeptCode',
            prop: 'outDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.inDeptCode',
            prop: 'inDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
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
              disabled: false,
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
              disabled: false,
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
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          cancelAudit: '/api/warehouse/whTransferOutBill/cancelAudit',
          search: '/api/warehouse/whTransferOutBill/list',
          export: '/api/warehouse/whTransferOutBill/export',
          doDelete: '/api/warehouse/whTransferOutBill/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 新增
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'transferOutAdd',
                params: {
                  type: 'add',
                  back: 'transferOut'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'transferOutUpdate',
                params: {
                  type: 'update',
                  id: currentRow.transferOutBillNo,
                  back: 'transferOut'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whTransferOutBill/validatedApi',
                data: row.transferOutBillNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.transferOutBillNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'transferOutView',
                params: {
                  type: 'view',
                  id: currentRow.transferOutBillNo,
                  back: 'transferOut'
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
                  value: currentRow.transferOutBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.transferOutBillNo // 变量值
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
                uk: currentRow.transferOutBillNo,
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
                uk: currentRow.transferOutBillNo // 变量值
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
                billNum: currentRow.transferOutBillNo
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
                transferOutBillNo: currentRow.transferOutBillNo
              }
            }
          },
          // 刷新
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        table: {
          id: '',
          mergeProp: 'whTransferOutProductDtoList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'biz.lbl.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              },
              sortable: 'custom'
            },
            // 调出单号
            {
              prop: 'transferOutBillNo',
              width: 200,
              align: 'left',
              label: 'storage.transferOut.list.transferOutBillNo',
              sortable: 'custom'
            },
            // 调出日期
            {
              prop: 'transferOutDate',
              width: 100,
              align: 'center',
              label: 'storage.transferOut.list.transferOutDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              sortable: 'custom'
            },
            // 调出仓库
            {
              prop: 'outWarehouseName',
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.outWarehouseName',
              sortable: 'custom'
            },
            // 调入仓库
            {
              prop: 'inWarehouseName',
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.inWarehouseName',
              sortable: 'custom'
            },
            // 调出部门
            {
              prop: 'outDeptName',
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.outDeptName',
              sortable: 'custom'
            },
            // 调入部门
            {
              prop: 'inDeptName',
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.inDeptName',
              sortable: 'custom'
            },
            {
              prop: 'contractNo',
              width: 180,
              align: 'left',
              label: 'storage.transferOut.list.contractNo',
              isSon: true
            },
            {
              prop: 'lotNo',
              width: 180,
              align: 'left',
              label: 'storage.transferOut.list.lotNo',
              isSon: true
            },
            // 库存商品明细编号
            {
              prop: 'stockDetailNo',
              width: 180,
              align: 'left',
              label: 'storage.transferOut.list.stockDetailNo',
              isSon: true
            },
            // 供应商
            {
              prop: 'supplierName',
              width: 200,
              align: 'left',
              label: 'storage.transferOut.list.supplierName',
              isSon: true
            },
            // 商品
            {
              prop: 'productName',
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.productName',
              isSon: true
            },
            // 商品属性
            ...this.$store.state.user.mainGoodColsTxtSon,
            // 调拨件数
            {
              prop: 'itemCount',
              width: 80,
              format: {
                func: 'num'
              },
              align: 'right',
              label: 'storage.transferOut.list.itemCount',
              isSon: true
            },
            // 调拨出库数量
            {
              prop: 'transferOutQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.transferOut.list.transferOutQuantity',
              isSon: true
            },
            // 商品单位
            {
              prop: 'productUnitCode',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.transferOut.list.productUnitCode',
              isSon: true
            },
            // 调拨出库计量数量
            {
              prop: 'transferOutMeasurementQty',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.transferOut.list.transferOutMeasurementQty',
              isSon: true
            },
            // 计量单位
            {
              prop: 'measurementUnitCode',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.transferOut.list.measurementUnitCode',
              isSon: true
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
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
