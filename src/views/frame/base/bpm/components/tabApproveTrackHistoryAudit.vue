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
          search: '/api/bpm/bpmApproveTrack/listAllBusinessTrack'
        },
        apiData: {
          search(param) {
            return param.id
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
              label: 'platform.component.list.accountName',
              prop: 'accountName',
              width: 80
            },
            {
              label: 'platform.component.list.trackType',
              prop: 'trackType',
              format: {
                dict: this.$t('datadict.trackType')
              },
              align: 'center',
              width: 80
            },
            {
              label: 'platform.component.list.agreeFlg',
              prop: 'agreeFlg',
              format: {
                dict: this.$t('datadict.agreeFlg')
              },
              align: 'center',
              width: 80
            },
            {
              label: 'platform.component.list.approveUser',
              prop: 'approveUser',
              width: 120
            },
            {
              label: 'platform.component.list.approveResult',
              prop: 'approveResult'
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
