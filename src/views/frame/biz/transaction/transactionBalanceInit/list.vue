<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo, confirmTip } from '@/utils/frame/base/notifyParams'
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'transactionBalanceInit',
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
            balanceInitNo: '',
            balanceInitDateStart: '',
            balanceInitDateEnd: '',
            customerNo: '',
            transactionType: '',
            transactionDetailType: '',
            generateFlag: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'balanceInitDate.desc, balanceInitNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'transaction.transactionBalanceInit.form.balanceInitDate',
            props: ['balanceInitDateStart', 'balanceInitDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'transaction.transactionBalanceInit.form.balanceInitNo',
            prop: 'balanceInitNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionBalanceInit.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '12',
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
            label: 'transaction.transactionBalanceInit.form.transactionType',
            prop: 'transactionType',
            element: 'base-select',
            list: this.$t('datadict.transactionType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionBalanceInit.form.transactionDetailType',
            prop: 'transactionDetailType',
            element: 'base-select',
            list: this.$t('datadict.transactionDetailType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionBalanceInit.form.generateFlag',
            prop: 'generateFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
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
          cancelAudit: '/api/transaction/balanceInit/cancelAudit',
          search: '/api/transaction/balanceInit/list',
          doDelete: '/api/transaction/balanceInit/remove'
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
                name: 'transactionBalanceInitAdd',
                params: {
                  type: 'add',
                  back: 'transactionBalanceInit'
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
                url: '/api/transaction/balanceInit/validatedApi',
                data: row.balanceInitNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'transactionBalanceInitUpdate',
                params: {
                  type: 'update',
                  id: currentRow.balanceInitNo,
                  back: 'transactionBalanceInit'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.balanceInitNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'transactionBalanceInitView',
                params: {
                  type: 'view',
                  id: currentRow.balanceInitNo,
                  back: 'transactionBalanceInit'
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
                  value: currentRow.balanceInitNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.balanceInitNo // 变量值
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
                uk: currentRow.balanceInitNo,
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
                uk: currentRow.balanceInitNo // 变量值
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
                billNum: currentRow.balanceInitNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.balanceInitNo
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
          // 生成往来
          {
            name: 'generateTransactionInfo',
            iconName: '线性-生成',
            i18n: 'biz.btn.generateTransactionInfo',
            event: this.generateTransactionInfo
          },
          // 删除往来
          {
            name: 'removeTransactionInfo',
            iconName: '线性-删除',
            i18n: 'biz.btn.removeTransactionInfo',
            event: this.removeTransactionInfo
          },
          // 下载模板
          {
            name: 'downloadTemplate',
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '往来余额初始化')
          },
          // 上传
          {
            name: 'upload',
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '往来余额初始化', '/api/transaction/balanceInit/uploadExcel')
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
              label: 'transaction.transactionBalanceInit.list.balanceInitNo',
              prop: 'balanceInitNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 初始化日期
            {
              label: 'transaction.transactionBalanceInit.list.balanceInitDate',
              prop: 'balanceInitDate',
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
              label: 'transaction.transactionBalanceInit.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 往来类型
            {
              label: 'transaction.transactionBalanceInit.list.transactionType',
              prop: 'transactionType',
              format: {
                dict: this.$t('datadict.transactionType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 往来明细类型
            {
              label: 'transaction.transactionBalanceInit.list.transactionDetailType',
              prop: 'transactionDetailType',
              format: {
                dict: this.$t('datadict.transactionDetailType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 初始化金额
            {
              label: 'transaction.transactionBalanceInit.list.balanceInitAmount',
              prop: 'balanceInitAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'transaction.transactionBalanceInit.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 是否生成标志
            {
              label: 'transaction.transactionBalanceInit.list.generateFlag',
              prop: 'generateFlag',
              format: {
                dict: this.$t('datadict.yesNo')
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
  },
  methods: {
    generateTransactionInfo() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      confirmTip(this, 'confirmGenerateTransactionInfo').then(() => {
        request({
          url: '/api/transaction/balanceInit/generateTransactionInfo',
          method: 'POST',
          data: {
            data: row.balanceInitNo,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.generateTransactionInfo')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
            this.$refs.qmTable.getList()
          })
          .catch(() => {})
      })
    },
    removeTransactionInfo() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      confirmTip(this, 'confirmRemoveTransactionInfo').then(() => {
        request({
          url: '/api/transaction/balanceInit/removeTransactionInfo',
          method: 'POST',
          data: {
            data: row.balanceInitNo,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.removeTransactionInfo')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
            this.$refs.qmTable.getList()
          })
          .catch(() => {})
      })
    }
  }
}
</script>
