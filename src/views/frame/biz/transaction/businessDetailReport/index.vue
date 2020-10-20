<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData' @initCallback='handleInitCallback'></qm-table>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
export default {
  name: 'businessDetailReport',
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
            transactionDateStart: '',
            transactionDateEnd: '',
            transactionDetailType: '',
            transactionAccountType: '',
            customerNo: '',
            currency: '',
            contractNo: '',
            lotNo: '',
            productCode: '',
            billNo: '',
            billType: '',
            parentBillNo: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'currency.asc, transactionDate.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'transaction.transactionDetail.form.transactionDate',
            props: ['transactionDateStart', 'transactionDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'transaction.transactionDetail.form.transactionDetailType',
            prop: 'transactionDetailType',
            element: 'base-select',
            list: this.$t('datadict.transactionDetailType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.transactionAccountType',
            prop: 'transactionAccountType',
            element: 'base-select',
            list: this.$t('datadict.transactionAccountType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              params: {},
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.billType',
            prop: 'billType',
            element: 'base-select',
            list: this.$t('datadict.businessBillType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'transaction.transactionDetail.form.parentBillNo',
            prop: 'parentBillNo',
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
          search: '/api/transaction/business/detailReport',
          export: '/api/transaction/business/detailReport'
        },
        apiData: {
          search(param) {
            return param
          },
          export(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 导出
          {
            name: 'export',
            getParam() {
              return {
                autoWidth: true
              }
            }
          },
          // 刷新
          {
            name: 'refresh'
          }
        ],

        isColset: false,
        table: {
          id: '',
          sortable: false,
          showSummary: false,
          summaryData: [],
          defineSummaryFun: this.getSummaries,
          cols: [
            // 往来日期
            {
              label: 'transaction.transactionDetail.list.transactionDate',
              prop: 'transactionDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center'
            },
            // 往来明细类型
            {
              label: 'transaction.transactionDetail.list.transactionDetailType',
              prop: 'transactionDetailType',
              format: {
                dict: this.$t('datadict.transactionDetailType')
              },
              width: 120,
              align: 'center'
            },
            // 单据号
            {
              label: 'transaction.transactionDetail.list.billNo',
              prop: 'billNo',
              width: 180,
              align: 'left'
            },
            // 单据类型
            {
              label: 'transaction.transactionDetail.list.billType',
              prop: 'billType',
              format: {
                dict: this.$t('datadict.businessBillType')
              },
              width: 100,
              align: 'center'
            },
            // 客户
            {
              label: 'transaction.transactionDetail.list.customerName',
              prop: 'customerName',
              width: 200,
              align: 'left'
            },
            // 应付金额
            {
              label: 'transaction.transactionDetail.list.payableAmount',
              prop: 'payableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 实付金额
            {
              label: 'transaction.transactionDetail.list.paymentAmount',
              prop: 'paymentAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 应收金额
            {
              label: 'transaction.transactionDetail.list.receivableAmount',
              prop: 'receivableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 实收金额
            {
              label: 'transaction.transactionDetail.list.receiveAmount',
              prop: 'receiveAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 累计应付金额
            {
              label: 'transaction.transactionDetail.list.totalPayableAmount',
              prop: 'totalPayableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 币种
            {
              label: 'transaction.transactionDetail.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center'
            },
            // 结算方式
            {
              label: 'transaction.transactionDetail.list.settlementType',
              prop: 'settlementType',
              format: {
                dict: this.$t('datadict.settlementType')
              },
              width: 100,
              align: 'center'
            },
            // 合同号
            {
              label: 'transaction.transactionDetail.list.contractNo',
              prop: 'contractNo',
              width: 180,
              align: 'left'
            },
            // 批次号
            {
              label: 'transaction.transactionDetail.list.lotNo',
              prop: 'lotNo',
              width: 180,
              align: 'left'
            },
            // 商品
            {
              label: 'transaction.transactionDetail.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 商品属性
            ...this.$store.state.user.mainGoodColsTxtSon,
            // 数量
            {
              label: 'transaction.transactionDetail.list.transactionQuantity',
              prop: 'transactionQuantity',
              format: {
                func: 'weight'
              },
              width: 100,
              align: 'right'
            },
            // 单价
            {
              label: 'transaction.transactionDetail.list.transactionPrice',
              prop: 'transactionPrice',
              format: {
                func: 'price'
              },
              width: 100,
              align: 'right'
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
  },
  methods: {
    // 列表getList之后获取合计信息
    handleInitCallback() {
      var currency = this.$refs.qmForm.form.listQuery.data['currency']
      if (currency) {
        request({
          url: '/api/transaction/business/detailSumInfo',
          method: 'POST',
          data: this.$refs.qmForm.form.listQuery
        })
          .then(response => {
            this.mainData.table.summaryData = response.data
            this.mainData.table.showSummary = true
          })
          .catch(() => {})
      } else {
        this.mainData.table.showSummary = false
      }
    },
    // 表格合计行
    getSummaries(param) {
      const columns = param.columns
      const data = this.mainData.table.summaryData
      const sums = []
      sums[0] = '合计'
      const sumColumns = ['payableAmount', 'paymentAmount', 'receivableAmount', 'receiveAmount', 'totalPayableAmount']
      columns.forEach((column, index) => {
        if (sumColumns.indexOf(column.property) != -1) {
          const filterCol = this.mainData.table.cols.filter(col => col.prop === column.property)[0]
          if (filterCol && filterCol.format) {
            if (filterCol.format.func) {
              sums[index] = Vue.filter(filterCol.format.func)(data[column.property])
            } else {
              sums[index] = data[column.property]
            }
          }
        }
      })
      return sums
    }
  }
}
</script>
