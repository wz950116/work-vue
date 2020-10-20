<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/cust/credit/listCs'
        },
        apiData: {
          search(param) {
            return { custCode: param.uk || param.id }
          }
        },
        table: {
          height: 355,
          cols: [
            {
              label: 'cst.customerSupplier.list.status',
              prop: 'auditStatus',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'cst.customerSupplier.list.custName',
              prop: 'custName',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.type',
              prop: 'typeCode',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.custType2')
              }
            },
            {
              label: 'cst.customerSupplier.list.creditType',
              prop: 'creditType',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditType')
              }
            },
            {
              label: 'cst.customerSupplier.list.creditline',
              prop: 'creditQuota',
              attrs: {
                min: 0,
                type: 'money'
              },
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.currency',
              prop: 'currency',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'cst.customerSupplier.list.startDate',
              prop: 'dateStart',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              align: 'center',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.endDate',
              prop: 'dateEnd',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              align: 'center',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.creditDays',
              prop: 'creditDays',
              attrs: {
                min: 0,
                type: 'num'
              },
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.deadline',
              prop: 'netDays',
              attrs: {
                min: 0,
                type: 'num'
              },
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.receiptsNo',
              prop: 'docNo',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.payWay',
              prop: 'payWay',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.payWay')
              }
            },
            {
              label: 'cst.customerSupplier.list.applyDepart',
              prop: 'optDeptName',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.applicant',
              prop: 'optEmployeeName',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.applicantTime',
              prop: 'applyDt',
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.creditOccupation',
              prop: 'usedAmount',
              attrs: {
                min: 0,
                type: 'money'
              },
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.tradingLimit_lone',
              prop: 'limitByContract',
              attrs: {
                min: 0,
                type: 'money'
              },
              width: '140'
            },
            {
              label: 'cst.customerSupplier.list.tradingLimit_annual',
              prop: 'limitByYear',
              attrs: {
                min: 0,
                type: 'money'
              },
              width: '140'
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  }
}
</script>
