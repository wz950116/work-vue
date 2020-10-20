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
  name: 'domesticInvoiceClaim',
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
            claimNo: '',
            claimDateStart: '',
            claimDateEnd: '',
            customerNo: '',
            productCode: '',
            receiveNo: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'claimDate.desc, claimNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.domesticInvoiceClaim.form.claimDate',
            props: ['claimDateStart', 'claimDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.domesticInvoiceClaim.form.claimNo',
            prop: 'claimNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
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
            label: 'invoice.domesticInvoiceClaim.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceClaim.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
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
          cancelAudit: '/api/invoice/domesticClaim/cancelAudit',
          search: '/api/invoice/domesticClaim/list',
          doDelete: '/api/invoice/domesticClaim/remove'
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
                name: 'domesticInvoiceClaimAdd',
                params: {
                  type: 'add',
                  back: 'domesticInvoiceClaim'
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
                name: 'domesticInvoiceClaimUpdate',
                params: {
                  type: 'update',
                  id: currentRow.claimNo,
                  back: 'domesticInvoiceClaim'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/invoice/domesticClaim/validatedApi',
                data: row.claimNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.claimNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'domesticInvoiceClaimView',
                params: {
                  type: 'view',
                  id: currentRow.claimNo,
                  back: 'domesticInvoiceClaim'
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
                  value: currentRow.claimNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.claimNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          // 撤回审批
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.claimNo,
                moduleCode: this.moduleCode
              }
            }
          },
          // 审批历史
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.claimNo // 变量值
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
                billNum: currentRow.claimNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam: currentRow => {
              return {
                claimNo: currentRow.claimNo,
                userEmployeeCode: this.$store.getters.userEmployeeCode,
                moduleCode: this.$route.meta.bpmModule
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
              label: 'invoice.domesticInvoiceClaim.list.claimNo',
              prop: 'claimNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 认领日期
            {
              label: 'invoice.domesticInvoiceClaim.list.claimDate',
              prop: 'claimDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 客户
            {
              label: 'invoice.domesticInvoiceClaim.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 商品
            {
              label: 'invoice.domesticInvoiceClaim.list.productName',
              prop: 'productName',
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 登记单号
            {
              label: 'invoice.domesticInvoiceClaim.list.receiveNo',
              prop: 'receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 认领数量
            {
              label: 'invoice.domesticInvoiceClaim.list.claimQuantity',
              prop: 'claimQuantity',
              attrs: {
                type: 'weight'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票价格（不含税）
            {
              label: 'invoice.domesticInvoiceClaim.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              format: {
                func: 'exprice'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 不含税金额
            {
              label: 'invoice.domesticInvoiceClaim.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 税率
            {
              label: 'invoice.domesticInvoiceClaim.list.taxRate',
              prop: 'taxRate',
              format: {
                func: 'taxrate'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'invoice.domesticInvoiceClaim.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票价格（含税）
            {
              label: 'invoice.domesticInvoiceClaim.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 含税金额
            {
              label: 'invoice.domesticInvoiceClaim.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'invoice.domesticInvoiceClaim.list.currency',
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
