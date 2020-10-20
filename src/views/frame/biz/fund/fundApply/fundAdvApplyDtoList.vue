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
        editForm: this.editForm,
        api: {
          search: '/api/fund/apply/listAdvApplyByApplyNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          height: 150,
          cols: [
            // 单据号
            {
              label: 'fund.fundApply.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left'
            },
            // 申请日期
            {
              label: 'fund.fundApply.list.applyDate',
              prop: 'applyDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center'
            },
            // 申请金额
            {
              label: 'fund.fundApply.list.applyAmount',
              prop: 'applyAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 币种
            {
              label: 'fund.fundApply.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center'
            },
            // 确认状态
            {
              label: 'fund.fundApply.list.confirmStatus',
              prop: 'confirmStatus',
              format: {
                dict: this.$t('datadict.confirmStatus')
              },
              width: 100,
              align: 'center'
            },
            // 确认金额
            {
              label: 'fund.fundApply.list.confirmAmount',
              prop: 'confirmAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 使用状态
            {
              label: 'fund.fundApply.list.useStatus',
              prop: 'useStatus',
              format: {
                dict: this.$t('datadict.useStatus')
              },
              width: 100,
              align: 'center'
            },
            // 使用金额
            {
              label: 'fund.fundApply.list.usedAmount',
              prop: 'usedAmount',
              format: {
                func: 'money'
              },
              width: 120,
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
            },
            // 备注
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              'min-width': 200,
              align: 'left'
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
      type: [String, Object],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
  }
}
</script>
