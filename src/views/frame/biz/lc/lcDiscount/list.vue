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
  name: 'lcDiscount',
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
            discountNo: '',
            letterCreditNo: '',
            discountDateStart: '',
            discountDateEnd: '',
            dueDateStart: '',
            dueDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'discountDate.desc, discountNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'lc.lcDiscount.form.discountDate',
            props: ['discountDateStart', 'discountDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcDiscount.form.discountNo',
            prop: 'discountNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcDiscount.form.letterCreditNo',
            prop: 'letterCreditNo',
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
            type: 'date',
            label: 'lc.lcDiscount.form.dueDate',
            props: ['dueDateStart', 'dueDateEnd'],
            attrs: {
              pickStart: 'dateStartBeforeLv2',
              pickEnd: 'dateEndBeforeLv2',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
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
          cancelAudit: '/api/lc/discount/cancelAudit',
          search: '/api/lc/discount/list',
          doDelete: '/api/lc/discount/remove'
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
                name: 'lcDiscountAdd',
                params: {
                  type: 'add',
                  back: 'lcDiscount'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/lc/discount/validatedApi',
                data: row.discountNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'lcDiscountUpdate',
                params: {
                  type: 'update',
                  id: currentRow.discountNo,
                  back: 'lcDiscount'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.discountNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'lcDiscountView',
                params: {
                  type: 'view',
                  id: currentRow.discountNo,
                  back: 'lcDiscount'
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
                  value: currentRow.discountNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.discountNo // 变量值
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
                uk: currentRow.discountNo,
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
                uk: currentRow.discountNo // 变量值
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
                billNum: currentRow.discountNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.discountNo
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
            // 贴现单号
            {
              prop: 'discountNo',
              label: 'lc.lcDiscount.list.discountNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证号
            {
              prop: 'letterCreditNo',
              label: 'lc.lcDiscount.list.letterCreditNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 贴现日期
            {
              prop: 'discountDate',
              label: 'lc.lcDiscount.list.discountDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 信用证金额
            {
              prop: 'letterCreditAmount',
              label: 'lc.lcDiscount.list.letterCreditAmount',
              width: 120,
              align: 'right',
              sortable: 'custom',
              format: {
                func: 'money'
              }
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'lc.lcDiscount.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 贴现行
            {
              prop: 'discountBank',
              label: 'lc.lcDiscount.list.discountBank',
              width: 120,
              align: 'left',
              sortable: 'custom'
            },
            // 贴现利率
            {
              prop: 'discountRate',
              label: 'lc.lcDiscount.list.discountRate',
              format: {
                func: 'taxrate'
              },
              width: 80,
              align: 'right',
              sortable: 'custom'
            },
            // 贴现天数
            {
              prop: 'discountDays',
              label: 'lc.lcDiscount.list.discountDays',
              width: 80,
              align: 'right',
              sortable: 'custom'
            },
            // 贴现利息
            {
              prop: 'discountInterest',
              label: 'lc.lcDiscount.list.discountInterest',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 贴现手续费
            {
              prop: 'discountServiceFee',
              label: 'lc.lcDiscount.list.discountServiceFee',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 实付贴现金额
            {
              prop: 'discountAmount',
              label: 'lc.lcDiscount.list.discountAmount',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'lc.lcDiscount.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 账号编码
            {
              label: 'lc.lcDiscount.list.bankAccountCode',
              prop: 'bankAccountCode',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 银行名称
            {
              label: 'lc.lcDiscount.list.bankName',
              prop: 'bankName',
              width: 120,
              align: 'left',
              sortable: 'custom'
            },
            // 备注
            {
              label: 'lc.lcDiscount.list.remark',
              prop: 'remark',
              width: 120,
              align: 'left',
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
