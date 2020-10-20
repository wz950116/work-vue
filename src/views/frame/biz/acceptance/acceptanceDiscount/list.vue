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
  name: 'acceptanceDiscount',
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
            acceptanceNo: '',
            discountDateStart: '',
            discountDateEnd: '',
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
            label: 'acceptance.acceptanceDiscount.form.discountDate',
            props: ['discountDateStart', 'discountDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.acceptanceDiscount.form.discountNo',
            prop: 'discountNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceDiscount.form.acceptanceNo',
            prop: 'acceptanceNo',
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
          cancelAudit: '/api/acceptance/discount/cancelAudit',
          search: '/api/acceptance/discount/list',
          doDelete: '/api/acceptance/discount/remove'
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
                name: 'acceptanceDiscountAdd',
                params: {
                  type: 'add',
                  back: 'acceptanceDiscount'
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
                url: '/api/acceptance/discount/validatedApi',
                data: row.discountNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'acceptanceDiscountUpdate',
                params: {
                  type: 'update',
                  back: 'acceptanceDiscount',
                  id: currentRow.discountNo
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
                name: 'acceptanceDiscountView',
                params: {
                  type: 'view',
                  back: 'acceptanceDiscount',
                  id: currentRow.discountNo
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
          //撤回审批
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
          // 审批历史
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
            // 单据号
            {
              prop: 'discountNo',
              label: 'acceptance.acceptanceDiscount.list.discountNo',
              width: 200,
              align: 'left'
            },
            // 贴现日期
            {
              prop: 'discountDate',
              label: 'acceptance.acceptanceDiscount.list.discountDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 承兑汇票单据号
            {
              prop: 'acceptanceBillNo',
              label: 'acceptance.acceptanceDiscount.list.acceptanceBillNo',
              width: 200,
              align: 'left'
            },
            // 承兑票据号
            {
              prop: 'acceptanceNo',
              label: 'acceptance.acceptanceDiscount.list.acceptanceNo',
              width: 200,
              align: 'left'
            },
            // 票面金额
            {
              prop: 'acceptanceAmount',
              label: 'acceptance.acceptanceDiscount.list.acceptanceAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'acceptance.acceptanceDiscount.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 贴现行
            {
              prop: 'discountBank',
              label: 'acceptance.acceptanceDiscount.list.discountBank',
              width: 120,
              align: 'left'
            },
            // 贴现天数
            {
              prop: 'discountDays',
              label: 'acceptance.acceptanceDiscount.list.discountDays',
              width: 100,
              align: 'right'
            },
            // 贴现利率
            {
              prop: 'discountRate',
              label: 'acceptance.acceptanceDiscount.list.discountRate',
              format: {
                func: 'taxrate'
              },
              width: 80,
              align: 'right'
            },
            // 贴现利息
            {
              prop: 'discountInterest',
              label: 'acceptance.acceptanceDiscount.list.discountInterest',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 贴现手续费
            {
              prop: 'discountServiceFee',
              label: 'acceptance.acceptanceDiscount.list.discountServiceFee',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 实际贴现金额
            {
              prop: 'discountAmount',
              label: 'acceptance.acceptanceDiscount.list.discountAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 币种
            {
              prop: 'currency',
              label: 'acceptance.acceptanceDiscount.list.currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center'
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
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
