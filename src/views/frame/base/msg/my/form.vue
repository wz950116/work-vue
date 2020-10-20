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
          view: '/api/msg/my/view'
        },

        formData: [
          {
            label: 'msg.record.senderName',
            prop: 'senderName',
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
            element: 'el-input',
            attrs: {
              cols: 3,
              type: 'textarea',
              rows: 6
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
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
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {},
  methods: {
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog() {
      this.$emit('closeHandler', true)
    }
  }
}
</script>
