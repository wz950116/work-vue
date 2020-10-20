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
  name: 'acceptanceReceive',
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
            receiveNo: '',
            acceptanceNo: '',
            acceptanceDateStart: '',
            acceptanceDateEnd: '',
            customerNo: '',
            dueDateStart: '',
            dueDateEnd: '',
            acceptanceBank: '',
            useFlag: '',
            acceptanceStatus: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'acceptanceDate.desc, receiveNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'acceptance.acceptanceReceive.form.acceptanceDate',
            props: ['acceptanceDateStart', 'acceptanceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.acceptanceNo',
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
            label: 'acceptance.acceptanceReceive.form.customerNo',
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
            type: 'date',
            label: 'acceptance.acceptanceReceive.form.dueDate',
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
            label: 'acceptance.acceptanceReceive.form.acceptanceBank',
            prop: 'acceptanceBank',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.useFlag',
            prop: 'useFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.acceptanceStatus',
            prop: 'acceptanceStatus',
            element: 'base-select',
            list: this.$t('datadict.acceptanceStatus'),
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
          cancelAudit: '/api/acceptance/receive/cancelAudit',
          search: '/api/acceptance/receive/list',
          doDelete: '/api/acceptance/receive/remove'
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
          // // 新增
          // {
          //   name: 'add',
          //   type: 'route',
          //   routeInfo() {
          //     return {
          //       name: 'acceptanceReceiveAdd',
          //       params: {
          //         type: 'add',
          //         back: 'acceptanceReceive'
          //       }
          //     }
          //   }
          // },
          // // 修改
          // {
          //   name: 'update',
          //   type: 'route',
          //   validateApi(currentRow) {
          //     return {
          //       url: '/api/acceptance/receive/validatedApi',
          //       data: currentRow.receiveNo
          //     }
          //   },
          //   routeInfo(currentRow) {
          //     return {
          //       name: 'acceptanceReceiveUpdate',
          //       params: {
          //         type: 'update',
          //         back: 'acceptanceReceive',
          //         id: currentRow.receiveNo
          //       }
          //     }
          //   }
          // },
          // // 删除
          // {
          //   name: 'remove',
          //   getParam(param) {
          //     return param.receiveNo
          //   }
          // },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'acceptanceReceiveView',
                params: {
                  type: 'view',
                  back: 'acceptanceReceive',
                  id: currentRow.receiveNo
                }
              }
            }
          },
          // // 提交审批
          // {
          //   name: 'submitAudit',
          //   type: 'dialog',
          //   title: this.$t('route.' + this.$route.meta.title),
          //   getParam(currentRow) {
          //     return {
          //       row: currentRow,
          //       type: 'audit',
          //       uk: {
          //         name: 'UK',
          //         value: currentRow.receiveNo // 变量值
          //       },
          //       todotext: {
          //         name: 'CURR_BIZ_TODO_TEXT',
          //         value: this.title + '单据号: ' + currentRow.receiveNo // 变量值
          //       }
          //     }
          //   },
          //   component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          // },
          // // 审批历史
          // {
          //   name: 'auditHistory',
          //   type: 'dialog',
          //   moduleCode: this.$route.meta.bpmModule,
          //   getParam(currentRow) {
          //     return {
          //       row: currentRow,
          //       moduleCode: this.moduleCode,
          //       uk: currentRow.receiveNo // 变量值
          //     }
          //   }
          // },
          // // 弃审
          // {
          //   name: 'cancelAudit',
          //   msg: this.$t('biz.msg.disableCancelAudit'),
          //   validate(currentRow) {
          //     return currentRow.auditStatus === '3'
          //   },
          //   getParam(currentRow) {
          //     return {
          //       billNum: currentRow.receiveNo
          //     }
          //   }
          // },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.receiveNo
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
          // 生成下游单据
          {
            name: 'more',
            i18n: 'biz.btn.generateBill',
            list: [
              // 承兑汇票贴现
              {
                msg: this.$t('acceptance.acceptanceReceive.msg.acceptanceDiscount'),
                name: 'next',
                permitName: ['acceptanceDiscount'],
                type: 'route',
                i18n: 'acceptance.acceptanceReceive.btn.acceptanceDiscount',
                validate(currentRow) {
                  return currentRow.auditStatus === '3' && currentRow.useFlag === '0'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'acceptanceDiscountAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.receiveNo,
                      preBillType: 'ACCEPTANCE_RECEIVE',
                      back: 'acceptanceReceive'
                    }
                  }
                }
              }
            ]
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
              prop: 'receiveNo',
              label: 'acceptance.acceptanceReceive.list.receiveNo',
              width: 200,
              align: 'left'
            },
            // 票据号
            {
              prop: 'acceptanceNo',
              label: 'acceptance.acceptanceReceive.list.acceptanceNo',
              width: 200,
              align: 'left'
            },
            // 出票日期
            {
              prop: 'acceptanceDate',
              label: 'acceptance.acceptanceReceive.list.acceptanceDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 客户
            {
              prop: 'customerName',
              label: 'acceptance.acceptanceReceive.list.customerName',
              width: 300,
              align: 'left'
            },
            // 票面金额
            {
              prop: 'acceptanceAmount',
              label: 'acceptance.acceptanceReceive.list.acceptanceAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 币种
            {
              prop: 'currency',
              label: 'acceptance.acceptanceReceive.list.currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'acceptance.acceptanceReceive.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 承兑银行
            {
              prop: 'acceptanceBank',
              label: 'acceptance.acceptanceReceive.list.acceptanceBank',
              width: 150,
              align: 'left'
            },
            // 是否使用
            {
              label: 'acceptance.acceptanceReceive.list.useFlag',
              prop: 'useFlag',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            // 承兑汇票状态
            {
              label: 'acceptance.acceptanceReceive.list.acceptanceStatus',
              prop: 'acceptanceStatus',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.acceptanceStatus')
              }
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
