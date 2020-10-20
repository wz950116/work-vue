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
  name: 'profitAndLoss',
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
            pnlNo: '',
            pnlDateStart: '',
            pnlDateEnd: '',
            warehouseCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'pnlDate.desc, pnlNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.profitAndLoss.form.pnlDate',
            props: ['pnlDateStart', 'pnlDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.profitAndLoss.form.pnlNo',
            prop: 'pnlNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.profitAndLoss.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
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
          cancelAudit: '/api/warehouse/whPnl/cancelAudit',
          search: '/api/warehouse/whPnl/list',
          export: '/api/warehouse/whPnl/export',
          doDelete: '/api/warehouse/whPnl/remove'
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
                name: 'profitAndLossAdd',
                params: {
                  type: 'add',
                  back: 'profitAndLoss'
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
                name: 'profitAndLossUpdate',
                params: {
                  type: 'update',
                  id: currentRow.pnlNo,
                  back: 'profitAndLoss'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whPnl/validatedApi',
                data: row.pnlNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.pnlNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'profitAndLossView',
                params: {
                  type: 'view',
                  id: currentRow.pnlNo,
                  back: 'profitAndLoss'
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
                  value: currentRow.pnlNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.pnlNo // 变量值
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
                uk: currentRow.pnlNo,
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
                uk: currentRow.pnlNo // 变量值
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
                billNum: currentRow.pnlNo
              }
            }
          },
          // 导出
          {
            name: 'export'
          },
          //list 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                pnlNo: currentRow.pnlNo
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
          mergeProp: 'whPnlProductDtoList',
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
            // 盘盈亏单号
            {
              prop: 'pnlNo',
              width: 200,
              align: 'left',
              label: 'storage.profitAndLoss.list.pnlNo',
              sortable: 'custom'
            },
            // 盘盈亏日期
            {
              prop: 'pnlDate',
              width: 100,
              align: 'center',
              label: 'storage.profitAndLoss.list.pnlDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              sortable: 'custom'
            },
            // 仓库
            {
              prop: 'warehouseName',
              width: 100,
              align: 'left',
              label: 'storage.profitAndLoss.list.warehouseName',
              sortable: 'custom'
            },
            // 库存商品明细编号
            {
              prop: 'stockDetailNo',
              width: 200,
              align: 'left',
              label: 'storage.profitAndLoss.list.stockDetailNo',
              isSon: true
            },
            // 盘盈亏类型
            {
              prop: 'pnlType',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.pnlType')
              },
              label: 'storage.profitAndLoss.list.pnlType',
              isSon: true
            },
            // 供应商
            {
              prop: 'supplierName',
              width: 200,
              align: 'left',
              label: 'storage.profitAndLoss.list.supplierName',
              isSon: true
            },
            // 发货单位
            {
              prop: 'deliverName',
              width: 200,
              align: 'left',
              label: 'storage.profitAndLoss.list.deliverName',
              isSon: true
            },
            // 商品
            {
              prop: 'productName',
              width: 100,
              align: 'left',
              label: 'storage.profitAndLoss.list.productName',
              isSon: true
            },
            // 商品属性
            ...this.$store.state.user.mainGoodColsTxtSon,
            // 盘货件数
            {
              prop: 'itemCount',
              width: 80,
              format: {
                func: 'num'
              },
              align: 'right',
              label: 'storage.profitAndLoss.list.itemCount',
              isSon: true
            },
            // 盘货数量
            {
              prop: 'pnlQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.profitAndLoss.list.pnlQuantity',
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
              label: 'storage.profitAndLoss.list.productUnitCode',
              isSon: true
            },
            // 盘货计量数量
            {
              prop: 'measurementQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.profitAndLoss.list.measurementQuantity',
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
              label: 'storage.profitAndLoss.list.measurementUnitCode',
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
