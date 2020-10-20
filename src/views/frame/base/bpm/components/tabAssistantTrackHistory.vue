<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  name: 'component',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/bpm/backlog/listApproveAssist'
        },
        apiData: {
          search(param) {
            return { taskId: param.id }
          }
        },
        topBar: [],
        table: {
          cols: [
            {
              label: 'platform.component.list.updateDate',
              prop: 'updateDate',
              width: 150
            },
            {
              label: 'platform.component.list.assistantName',
              prop: 'accountName',
              width: 80
            },
            {
              label: 'platform.component.list.assistStatusFlg',
              prop: 'assistStatusFlg',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.assistStatusFlg')
              }
            },
            {
              label: 'platform.component.list.agreeFlg',
              prop: 'agreeFlg',
              align: 'center',
              width: 80,
              format: {
                dict: this.$t('datadict.agreeFlg')
              }
            },
            {
              label: 'platform.component.list.assistMsg',
              prop: 'assistMsg'
            },
            {
              label: 'platform.component.list.assistResult',
              prop: 'assistResult'
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
