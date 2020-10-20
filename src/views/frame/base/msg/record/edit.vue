<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'funcEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/msg/record/get'
        },

        formData: [
          {
            label: 'msg.record.msgRecordNo',
            prop: 'msgRecordNo',
            element: 'input-validate'
          },
          {
            label: 'msg.record.senderName',
            prop: 'senderName',
            element: 'input-validate'
          },
          {
            label: 'msg.record.recipientName',
            prop: 'recipientName',
            element: 'input-validate'
          },
          {
            label: 'msg.record.msgFuncCode',
            prop: 'msgFuncCode',
            element: 'input-validate'
          },
          {
            label: 'msg.record.msgChannelName',
            prop: 'msgChannelName',
            element: 'input-validate'
          },
          {
            label: 'msg.record.msgTempletName',
            prop: 'msgTempletName',
            element: 'input-validate'
          },
          {
            label: 'msg.record.userSendDt',
            prop: 'userSendDt',
            element: 'input-validate',
            attrs: {
              cols: 2
            }
          },
          {
            label: 'msg.record.msgSendStat',
            prop: 'msgSendStat',
            element: 'base-select',
            list: this.$t('datadict.msgSendStat')
          },
          {
            label: 'msg.record.msgTitle',
            prop: 'msgTitle',
            element: 'input-validate',
            attrs: {
              cols: 3
            }
          },
          {
            label: 'msg.record.msgContent',
            prop: 'msgContent',
            element: 'input-validate',
            attrs: {
              cols: 3
            }
          },
          {
            label: 'msg.record.msgExtend',
            prop: 'msgExtend',
            element: 'input-validate',
            attrs: {
              cols: 3
            }
          }
        ],
        bottomButtons: [{
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {

  },
  methods: {
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
    attachment() {

    },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
