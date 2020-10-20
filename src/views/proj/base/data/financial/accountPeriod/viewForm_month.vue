<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>
<script>
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          search: '/api/data/accountPeriod/getMonthList'
        },
        apiData: {
          search(params) {
            return params.id
          }
        },
        table: {
          cols: [{
            label: 'dataHq.accountMonth.accountMonth',
            prop: 'accountMonth',
            align: 'center'
          }, {
            label: 'dataHq.accountMonth.startDate',
            prop: 'startDate',
            align: 'center',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM-DD'
            }
          }, {
            label: 'dataHq.accountMonth.endDate',
            prop: 'endDate',
            align: 'center',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM-DD'
            }
          }]
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
      type: String,
      default: ''
    }
  }
}
</script>
