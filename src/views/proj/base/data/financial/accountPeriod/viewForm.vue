<template>
  <qm-edit ref='accountPeriodView' :edit='edit' @closeDialog='hanldeCloseDialog' :initFun='initFun'></qm-edit>
</template>

<script>
export default {
  name: 'accountPeriodView',
  data() {
    return {
      edit: {
        type: this.$route.query.type || this.opType,
        param: this.$route.query.id,
        mode: this.opMode,
        api: {
          view: '/api/data/accountPeriod/get'
        },
        topButtons: [],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.lbl.mainInfo',
            content: [{
              label: 'dataHq.accountPeriod.fiscalYear',
              prop: 'fiscalYear',
              element: 'el-input',
              attrs: {
                disabled: true
              }
            }, {
              label: 'dataHq.accountPeriod.periodNumber',
              prop: 'periodNumber',
              element: 'el-input',
              attrs: {
                disabled: true
              }
            }, {
              label: 'dataHq.accountPeriod.quarterlyNumber',
              prop: 'quarterlyNumber',
              element: 'el-input',
              attrs: {
                disabled: true
              }
            }, {
              label: 'dataHq.accountPeriod.startDate',
              prop: 'startDate',
              element: 'el-date-picker',
              type: 'data',
              attrs: {
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd',
                disabled: true
              }
            }, {
              label: 'dataHq.accountPeriod.endDate',
              prop: 'endDate',
              element: 'el-date-picker',
              type: 'data',
              attrs: {
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd',
                disabled: true
              }
            }, {
              label: 'biz.lbl.usingFlag',
              prop: 'usingFlag',
              element: 'base-select',
              list: this.$t('datadict.usingFlag'),
              default: '0',
              attrs: {
                disabled: true
              }
            }]
          }
        },
        tabs: [{
          name: 'viewForm_month',
          label: 'dataHq.accountMonth.accountMonth',
          component: () => import('./viewForm_month.vue')
        },
        {
          name: 'viewForm_quarter',
          label: 'dataHq.accountQuarter.accountQuarter',
          component: () => import('./viewForm_quarter.vue')
        }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'route'
    },
    param: {
      type: Object,
      default() {
        return null
      }
    }
  },
  methods: {
    initFun(formData) {
      formData.startDate = formData.startDate + 'ZZ'
    },
    hanldeCloseDialog(params) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', params)
      } else {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: 'indexDemo'
          })
        })
      }
    }
  }
}
</script>
