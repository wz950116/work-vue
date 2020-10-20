<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  name: 'broker',
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/cust/credit/listBr'
        },
        apiData: {
          search(param) {
            return { custCode: param.uk || param.id }
          }
        },
        topBar: [],
        table: {
          height: 200,
          cols: [
            {
              label: 'cst.broker.list.customerName',
              prop: 'custName'
            },
            {
              label: 'cst.broker.list.type',
              prop: 'typeCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.custType')
              }
            },
            {
              label: 'cst.broker.list.productName',
              prop: 'productName'
            },
            {
              label: 'cst.broker.list.positionValue',
              prop: 'positionValue'
            },
            {
              label: 'cst.broker.list.warningValue',
              prop: 'warningValue'
            },
            {
              label: 'cst.broker.list.currency',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'cst.broker.list.positionNum',
              prop: 'positionNum'
            },
            {
              label: 'cst.broker.list.warningNum',
              prop: 'warnVal'
            },
            {
              label: 'cst.broker.list.direction',
              prop: 'direction',
              align: 'center',
              format: {
                dict: this.$t('datadict.dvtPosiDirection')
              }
            },
            {
              label: 'cst.broker.list.remark',
              prop: 'remark'
            },
            {
              label: 'cst.broker.list.startDate',
              prop: 'startDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.broker.list.endDate',
              prop: 'endDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.broker.list.creditDays',
              prop: 'creditDays'
            },
            {
              label: 'cst.broker.list.applyDepart',
              prop: 'applyDepart'
            },
            {
              label: 'cst.broker.list.applicant',
              prop: 'optEmployeeName'
            },
            {
              label: 'cst.broker.list.applicantTime',
              prop: 'applyDt',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
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
