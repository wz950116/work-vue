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
  name: 'feeInfo',
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
            customerNo: '',
            feeDate: '',
            feeNo: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optOrganCode: '',
            optDeptCode: '',
            optEmployeeCode: '',
            auditStatus: ''
          },
          defaultSortString: 'feeDate.desc,feeNo.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'fee.feeInfo.form.feeDate',
            props: ['startDate', 'endDate'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeInfo.form.feeNo',
            prop: 'feeNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },

          {
            label: 'fee.feeInfo.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
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
          cancelAudit: '/api/fee/feeInfo/cancelAudit',
          search: '/api/fee/feeInfo/page',
          export: '/api/fee/feeInfo/export',
          doDelete: '/api/fee/feeInfo/remove'
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
                name: 'feeInfoAdd',
                params: {
                  type: 'add',
                  back: 'feeInfo'
                }
              }
            }
          },
          // 修改
          {
            msg: this.$t('此单据不能被修改'),
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeInfoUpdate',
                params: {
                  type: 'update',
                  id: currentRow,
                  back: 'feeInfo'
                }
              }
            },
            validate(currentRow) {
              return currentRow.typeCode === 'FEE_INFO'
            },
            validateApi(row) {
              return {
                url: '/api/fee/feeInfo/validated',
                data: row
              }
            }
          },
          // 删除
          {
            msg: this.$t('此单据不能被删除'),
            name: 'remove',
            validate(currentRow) {
              return currentRow.typeCode === 'FEE_INFO'
            },
            getParam(param) {
              return param
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeInfoView',
                params: {
                  type: 'view',
                  id: currentRow,
                  back: 'feeInfo'
                }
              }
            }
          },
          // 提交审批
          {
            msg: this.$t('此单据不能被提交'),
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            validate(currentRow) {
              return currentRow.typeCode === 'FEE_INFO'
            },
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.feeNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.feeNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },

          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.typeCode === 'FEE_INFO' && currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.feeNo,
                moduleCode: this.moduleCode
              }
            }
          },
          // 审批历史
          {
            msg: this.$t('此单据不能查看审批历史'),
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            validate(currentRow) {
              return currentRow.typeCode === 'FEE_INFO'
            },
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.feeNo // 变量值
              }
            }
          },
          // 弃审
          {
            msg: this.$t('此单据不能被弃审'),
            name: 'cancelAudit',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.typeCode === 'FEE_INFO'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.feeNo
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
                feeNo: currentRow.feeNo
              }
            }
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          mergeProp: 'feeDetailInfoDtoList',
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
              label: 'fee.feeInfo.list.feeNo',
              prop: 'feeNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用日期
            {
              label: 'fee.feeInfo.list.feeDate',
              prop: 'feeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 结算单位
            {
              label: 'fee.feeInfo.list.custName',
              prop: 'customerName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            //费用来源
            {
              label: 'fee.feeInfo.list.feeSource',
              prop: 'typeCode',
              format: {
                dict: this.$t('datadict.feeSource')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 业务单据号
            {
              label: 'fee.feeInfo.list.billNo',
              prop: 'billNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用方向
            {
              label: 'fee.feeInfo.list.feeDirection',
              prop: 'feeDirection',
              format: {
                dict: this.$t('datadict.feeDirection')
              },
              width: 80,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            //费用名称
            {
              label: 'fee.feeInfo.list.feeName',
              prop: 'feeName',
              width: 80,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            // 费用合同号
            {
              label: 'fee.feeInfo.list.feeContractNo',
              prop: 'feeContractNo',
              width: 300,
              align: 'left',
              sortable: 'custom',
              isSon: true
            },
            //含税单价
            {
              label: 'fee.feeInfo.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            //数量
            {
              label: 'fee.feeInfo.list.quantity',
              prop: 'feeQuantity',
              format: {
                func: 'num'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            //结算数量
            {
              label: 'fee.feeInfo.list.settleQuantity',
              prop: 'settleQuantity',
              format: {
                func: 'num'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 含税金额
            {
              label: 'fee.feeInfo.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 币种
            {
              label: 'fee.feeInfo.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            // 税率
            {
              label: 'fee.feeInfo.list.taxRate',
              prop: 'taxRate',
              format: {
                func: 'taxrate'
              },
              width: 120,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 不含税金额
            {
              label: 'fee.feeInfo.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 税额
            {
              label: 'fee.feeInfo.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 进成本
            {
              label: 'fee.feeInfo.list.costFlag',
              prop: 'costFlag',
              align: 'center',
              width: '90',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              isSon: true
            },
            // 进往来
            {
              label: 'fee.feeInfo.list.intercourseFlag',
              prop: 'transactionFlag',
              align: 'center',
              width: '90',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              isSon: true
            },
            //商品名称
            {
              label: 'fee.feeInfo.list.productName',
              prop: 'productName',
              width: 80,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
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
