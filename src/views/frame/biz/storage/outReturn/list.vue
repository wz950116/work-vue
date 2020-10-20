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
  name: 'outReturn',
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
            outReturnNo: '',
            outReturnDateStart: '',
            outReturnDateEnd: '',
            customerCode: '',
            warehouseCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            returnTypeList: []
          },
          defaultSortString: 'outReturnDate.desc, outReturnNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'storage.outReturn.form.outReturnDate',
            props: ['outReturnDateStart', 'outReturnDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outReturn.form.outReturnNo',
            prop: 'outReturnNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.outReturn.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
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
            label: 'storage.outReturn.form.warehouseCode',
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
            type: 'checkbox',
            label: 'storage.outReturn.form.returnType',
            prop: 'returnTypeList',
            list: [
              {
                label: '退货',
                value: 'RETURN'
              },
              {
                label: '换货',
                value: 'EXCHANGE'
              }
            ]
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
          cancelAudit: '/api/warehouse/whOutReturnBill/cancelAudit',
          search: '/api/warehouse/whOutReturnBill/list',
          export: '/api/warehouse/whOutReturnBill/export',
          doDelete: '/api/warehouse/whOutReturnBill/remove'
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
                name: 'outReturnAdd',
                params: {
                  type: 'add',
                  back: 'outReturn'
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
                name: 'outReturnUpdate',
                params: {
                  type: 'update',
                  id: currentRow.outReturnNo,
                  back: 'outReturn'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whOutReturnBill/validatedApi',
                data: row.outReturnNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.outReturnNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'outReturnView',
                params: {
                  type: 'view',
                  id: currentRow.outReturnNo,
                  back: 'outReturn'
                }
              }
            }
          },
          // 审核
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
                  value: currentRow.outReturnNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.outReturnNo // 变量值
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
                uk: currentRow.outReturnNo,
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
                uk: currentRow.outReturnNo // 变量值
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
                billNum: currentRow.outReturnNo
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
                outReturnNo: currentRow.outReturnNo
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
          mergeProp: 'whOutReturnProductDtoList',
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
            // 销售退货单号
            {
              prop: 'outReturnNo',
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.outReturnNo',
              sortable: 'custom'
            },
            // 销售退货日期
            {
              prop: 'outReturnDate',
              width: 100,
              align: 'center',
              label: 'storage.outReturn.list.outReturnDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              sortable: 'custom'
            },
            // 客户
            {
              prop: 'customerName',
              width: 300,
              align: 'left',
              label: 'storage.outReturn.list.customerName',
              sortable: 'custom'
            },
            // 退换货类型
            {
              prop: 'returnType',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.returnType')
              },
              label: 'storage.outReturn.list.returnType',
              sortable: 'custom'
            },
            // 仓库
            {
              prop: 'warehouseName',
              width: 100,
              align: 'left',
              label: 'storage.outReturn.list.warehouseName',
              sortable: 'custom'
            },
            // 原出库单号
            {
              prop: 'outBillNo',
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.outBillNo',
              isSon: true
            },
            // 商品
            {
              prop: 'productName',
              width: 100,
              align: 'left',
              label: 'storage.outReturn.list.productName',
              isSon: true
            },
            // 商品属性
            ...this.$store.state.user.mainGoodColsTxtSon,
            // 退货件数
            {
              prop: 'itemCount',
              width: 80,
              format: {
                func: 'num'
              },
              align: 'right',
              label: 'storage.outReturn.list.itemCount',
              isSon: true
            },
            // 退换货数量
            {
              prop: 'inQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.outReturn.list.inQuantity',
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
              label: 'storage.outReturn.list.productUnitCode',
              isSon: true
            },
            // 计量数量
            {
              prop: 'measurementQuantity',
              width: 100,
              format: {
                func: 'weight'
              },
              align: 'right',
              label: 'storage.outReturn.list.measurementQuantity',
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
              label: 'storage.outReturn.list.measurementUnitCode',
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
