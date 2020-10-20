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
  name: 'acceptanceAccept',
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
            acceptNo: '',
            acceptanceNo: '',
            acceptDateStart: '',
            acceptDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'acceptDate.desc, acceptNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'acceptance.acceptanceAccept.form.acceptDate',
            props: ['acceptDateStart', 'acceptDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.acceptanceAccept.form.acceptNo',
            prop: 'acceptNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceAccept.form.acceptanceNo',
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
          cancelAudit: '/api/acceptance/accept/cancelAudit',
          search: '/api/acceptance/accept/list',
          doDelete: '/api/acceptance/accept/remove'
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
                name: 'acceptanceAcceptAdd',
                params: {
                  type: 'add',
                  back: 'acceptanceAccept'
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
                url: '/api/acceptance/accept/validatedApi',
                data: row.acceptNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'acceptanceAcceptUpdate',
                params: {
                  type: 'update',
                  back: 'acceptanceAccept',
                  id: currentRow.acceptNo
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.acceptNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'acceptanceAcceptView',
                params: {
                  type: 'view',
                  back: 'acceptanceAccept',
                  id: currentRow.acceptNo
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
                  value: currentRow.acceptNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.acceptNo // 变量值
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
                uk: currentRow.acceptNo,
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
                uk: currentRow.acceptNo // 变量值
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
                billNum: currentRow.acceptNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.acceptNo
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
              prop: 'acceptNo',
              label: 'acceptance.acceptanceAccept.list.acceptNo',
              width: 200,
              align: 'left'
            },
            // 承兑日期
            {
              prop: 'acceptDate',
              label: 'acceptance.acceptanceAccept.list.acceptDate',
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
              label: 'acceptance.acceptanceAccept.list.acceptanceBillNo',
              width: 200,
              align: 'left'
            },
            // 承兑票据号
            {
              prop: 'acceptanceNo',
              label: 'acceptance.acceptanceAccept.list.acceptanceNo',
              width: 200,
              align: 'left'
            },
            // 承兑行
            {
              prop: 'acceptanceBank',
              label: 'acceptance.acceptanceAccept.list.acceptanceBank',
              width: 120,
              align: 'left'
            },
            // 票面金额
            {
              prop: 'acceptanceAmount',
              label: 'acceptance.acceptanceAccept.list.acceptanceAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 承兑利息
            {
              prop: 'acceptInterest',
              label: 'acceptance.acceptanceAccept.list.acceptInterest',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 承兑手续费
            {
              prop: 'acceptServiceFee',
              label: 'acceptance.acceptanceAccept.list.acceptServiceFee',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 实际承兑金额
            {
              prop: 'acceptAmount',
              label: 'acceptance.acceptanceAccept.list.acceptAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 币种
            {
              prop: 'currency',
              label: 'acceptance.acceptanceAccept.list.currency',
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
