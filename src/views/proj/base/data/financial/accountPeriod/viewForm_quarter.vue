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
          search: '/api/data/accountPeriod/getQuarterList'
        },
        apiData: {
          search(params) {
            return params
          }
        },
        table: {
          cols: [{
            label: 'dataHq.accountQuarter.accountQuarter',
            prop: 'accountQuarter',
            align: 'center'
          }, {
            label: 'dataHq.accountQuarter.startMonth',
            prop: 'startMonth',
            align: 'center',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM'
            }
          }, {
            label: 'dataHq.accountQuarter.endMonth',
            prop: 'endMonth',
            align: 'center',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM'
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
