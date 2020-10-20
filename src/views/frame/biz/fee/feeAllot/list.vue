<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'feeAllot',
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
            allotNo: '',
            invoiceNo: '',
            customerNo: '',
            allotDateStart: '',
            allotDateEnd: '',
            feeType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'allotDate.desc, allotNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fee.feeAllot.form.allotDate',
            props: ['allotDateStart', 'allotDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeAllot.form.allotNo',
            prop: 'allotNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeAllot.form.settleNo',
            prop: 'settleNo',
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
          // 服务商
          {
            label: 'fee.feeAllot.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'fee.feeAllot.form.feeType',
            prop: 'feeType',
            element: 'base-select',
            attrs: {
              data: 'DD_FEE_TYPE',
              params: {},
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
          search: '/api/fee/feeAllot/page',
          doDelete: '/api/fee/feeAllot/remove',

          cancelAudit: '/api/fee/feeAllot/cancelAudit'
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
                name: 'feeAllotAdd',
                params: {
                  type: 'add',
                  back: 'feeAllot'
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
                name: 'feeAllotUpdate',
                params: {
                  type: 'update',
                  id: currentRow.allotNo,
                  back: 'feeAllot'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/feeAllot/validated',
                data: row.allotNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.allotNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeAllotView',
                params: {
                  type: 'view',
                  id: currentRow.allotNo,
                  back: 'feeAllot'
                }
              }
            }
          },
          // 提交审批
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
                  value: currentRow.allotNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.allotNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          // 审批历史
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.allotNo,
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
                uk: currentRow.allotNo // 变量值
              }
            }
          },
          // 弃审
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.allotNo
              }
            }
          },
          // 导出
          {
            name: 'export'
          },
          // 刷新
          {
            name: 'refresh'
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                allotNo: currentRow.allotNo
              }
            }
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'biz.lbl.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            // 单据号
            {
              label: 'fee.feeAllot.list.allotNo',
              prop: 'allotNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 结算单号
            {
              label: 'fee.feeAllot.list.settleNo',
              prop: 'settleNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 结算明细单号
            {
              label: 'fee.feeAllot.list.settleDetailNo',
              prop: 'settleDetailNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 分摊日期
            {
              label: 'fee.feeAllot.list.allotDate',
              prop: 'allotDate',
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            // 服务商
            {
              label: 'fee.feeAllot.list.customerNo',
              prop: 'customerName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用类型
            {
              label: 'fee.feeAllot.list.feeType',
              prop: 'feeName',
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 发票价格(不含税)
            {
              label: 'fee.feeAllot.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              format: {
                func: 'exprice'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票金额(不含税)
            {
              label: 'fee.feeAllot.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'fee.feeAllot.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 税率
            {
              label: 'fee.feeAllot.list.taxRate',
              prop: 'taxRate',
              format: {
                func: 'taxrate'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票价格(含税)
            {
              label: 'fee.feeAllot.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票金额(含税)
            {
              label: 'fee.feeAllot.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },

            // 分摊数量
            {
              label: 'fee.feeAllot.list.allotQuantity',
              prop: 'allotQuantity',
              format: {
                func: 'num'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fee.feeAllot.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
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
