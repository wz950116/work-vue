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
  name: 'transferIn',
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
            transferInBillNo: '',
            transferInDateStart: '',
            transferInDateEnd: '',
            transferOutBillNo: '',
            outWarehouseCode: '',
            inWarehouseCode: '',
            outDeptCode: '',
            inDeptCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'transferInDate.desc, transferInBillNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.transferIn.form.transferInDate',
            props: ['transferInDateStart', 'transferInDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.transferIn.form.transferInBillNo',
            prop: 'transferInBillNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferIn.form.transferOutBillNo',
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
          {
            label: 'storage.transferIn.form.inWarehouseCode',
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
            label: 'storage.transferIn.form.outWarehouseCode',
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
            label: 'storage.transferIn.form.inDeptCode',
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
            label: 'storage.transferIn.form.outDeptCode',
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
          cancelAudit: '/api/warehouse/whTransferInBill/cancelAudit',
          search: '/api/warehouse/whTransferInBill/list',
          export: '/api/warehouse/whTransferInBill/export',
          doDelete: '/api/warehouse/whTransferInBill/remove'
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
                name: 'transferInAdd',
                params: {
                  type: 'add',
                  back: 'transferIn'
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
                name: 'transferInUpdate',
                params: {
                  type: 'update',
                  id: currentRow.transferInBillNo,
                  back: 'transferIn'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whTransferInBill/validatedApi',
                data: row.transferInBillNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.transferInBillNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'transferInView',
                params: {
                  type: 'view',
                  id: currentRow.transferInBillNo,
                  back: 'transferIn'
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
                  value: currentRow.transferInBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.transferInBillNo // 变量值
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
                uk: currentRow.transferInBillNo,
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
                uk: currentRow.transferInBillNo // 变量值
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
                billNum: currentRow.transferInBillNo
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
                transferInBillNo: currentRow.transferInBillNo
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
          mergeProp: 'whTransferInProductDtoList',
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
            // 调入单号
            {
              prop: 'transferInBillNo',
              width: 200,
              align: 'left',
              label: 'storage.transferIn.list.transferInBillNo',
              sortable: 'custom'
            },
            // 调入日期
            {
              prop: 'transferInDate',
              width: 100,
              align: 'center',
              label: 'storage.transferIn.list.transferInDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              sortable: 'custom'
            },
            // 调出单号
            {
              prop: 'transferOutBillNo',
              width: 200,
              align: 'left',
              label: 'storage.transferIn.list.transferOutBillNo',
              sortable: 'custom'
            },
            // 调入仓库
            {
              prop: 'inWarehouseName',
              width: 100,
              align: 'left',
              label: 'storage.transferIn.list.inWarehouseName',
              sortable: 'custom'
            },
            // 调出仓库
            {
              prop: 'outWarehouseName',
              width: 100,
              align: 'left',
              label: 'storage.transferIn.list.outWarehouseName',
              sortable: 'custom'
            },
            // 调入部门
            {
              prop: 'inDeptName',
              width: 100,
              align: 'left',
              label: 'storage.transferIn.list.inDeptName',
              sortable: 'custom'
            },
            // 调出部门
            {
              prop: 'outDeptName',
              width: 100,
              align: 'left',
              label: 'storage.transferIn.list.outDeptName',
              sortable: 'custom'
            },
            {
              prop: 'contractNo',
              width: 180,
              align: 'left',
              label: 'storage.transferIn.list.contractNo',
              isSon: true
            },
            {
              prop: 'lotNo',
              width: 180,
              align: 'left',
              label: 'storage.transferIn.list.lotNo',
              isSon: true
            },
            // 库存商品明细编号
            {
              prop: 'stockDetailNo',
              width: 180,
              align: 'left',
              label: 'storage.transferIn.list.stockDetailNo',
              isSon: true
            },
            // 供应商
            {
              prop: 'supplierName',
              width: 200,
              align: 'left',
              label: 'storage.transferIn.list.supplierName',
              isSon: true
            },
            // 商品
            {
              prop: 'productName',
              width: 100,
              align: 'left',
              label: 'storage.transferIn.list.productName',
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
              label: 'storage.transferIn.list.itemCount',
              isSon: true
            },
            // 调拨入库数量
            {
              prop: 'transferInQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.transferIn.list.transferInQuantity',
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
              label: 'storage.transferIn.list.productUnitCode',
              isSon: true
            },
            // 调拨入库计量数量
            {
              prop: 'transferInMeasurementQty',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.transferIn.list.transferInMeasurementQty',
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
              label: 'storage.transferIn.list.measurementUnitCode',
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
