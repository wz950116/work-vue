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
  name: 'financeBalanceReport',
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
            transactionDateStart: '',
            transactionDateEnd: '',
            currency: '',
            bizOrganCode: ''
          },
          defaultSortString: 'customerNo.desc, bizOrganCode.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'transaction.transactionBalance.form.transactionDate',
            props: ['transactionDateStart', 'transactionDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'transaction.transactionBalance.form.customerNo',
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
            label: 'transaction.transactionBalance.form.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
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
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/transaction/finance/balanceReport',
          export: '/api/transaction/finance/balanceReport'
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
          sortable: 'custom',
          showSummary: false,
          summaryData: [],
          defineSummaryFun: this.getSummaries,
          cols: [
            // 客户
            {
              label: 'transaction.transactionBalance.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left'
            },
            // 期初应付金额
            {
              label: 'transaction.transactionBalance.list.beginPayableAmount',
              prop: 'beginPayableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 应付金额
            {
              label: 'transaction.transactionBalance.list.payableAmount',
              prop: 'payableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 实付金额
            {
              label: 'transaction.transactionBalance.list.paymentAmount',
              prop: 'paymentAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 应收金额
            {
              label: 'transaction.transactionBalance.list.receivableAmount',
              prop: 'receivableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 实收金额
            {
              label: 'transaction.transactionBalance.list.receiveAmount',
              prop: 'receiveAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 累计应付金额
            {
              label: 'transaction.transactionBalance.list.totalPayableAmount',
              prop: 'totalPayableAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right'
            },
            // 币种
            {
              label: 'transaction.transactionBalance.list.currency',
              prop: 'currency',
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
          url: '/api/transaction/finance/balanceSumInfo',
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
      const sumColumns = ['beginPayableAmount', 'payableAmount', 'paymentAmount', 'receivableAmount', 'receiveAmount', 'totalPayableAmount']
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
