<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'msgTempEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/msg/templet/get',
          save: '/api/msg/templet/save',
          update: '/api/msg/templet/update'
        },

        formData: [{
          label: 'msg.templet.templetName',
          prop: 'msgTempletName',
          element: 'input-validate',
          attrs: {
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          label: 'msg.templet.msgFuncId',
          prop: 'msgFuncCode',
          element: 'base-select',
          attrs: {
            data: 'MSG_FUNC',
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          label: 'msg.templet.msgChannelId',
          prop: 'msgChannelCode',
          element: 'base-select',
          attrs: {
            data: 'MSG_CHANNEL',
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          label: 'msg.templet.extTempletCode',
          prop: 'extTempletCode',
          element: 'input-validate',
          attrs: {
            clearable: true,
            maxlength: 80
          }
        }, {
          label: 'msg.templet.mailFormatType',
          prop: 'mailFormatType',
          element: 'base-select',
          list: this.$t('datadict.mailFormatType'),
          attrs: {
            clearable: false
          }
        }, {
          label: 'biz.lbl.usingFlag',
          prop: 'usingFlag',
          element: 'base-select',
          list: this.$t('datadict.usingFlag'),
          default: '1',
          attrs: {
            clearable: false
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        }, {
          label: 'msg.templet.templetTitle',
          prop: 'msgTempletTitle',
          element: 'el-input',
          attrs: {
            cols: 4,
            clearable: true
          }
        }, {
          label: 'msg.templet.templetContent',
          prop: 'msgTempletContent',
          element: 'el-input',
          attrs: {
            type: 'textarea',
            cols: 4,
            clearable: true
          }
        }, {
          label: 'msg.templet.templetExtend',
          prop: 'msgTempletExtend',
          element: 'el-input',
          attrs: {
            type: 'textarea',
            cols: 4,
            clearable: true
          }
        }, {
          label: 'biz.lbl.remark',
          prop: 'remark',
          element: 'el-input',
          attrs: {
            cols: 4,
            clearable: true
          }
        }],
        bottomButtons: [{
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }, {
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.save',
          event: 'save',
          showLoading: true,
          isShow: ['add', 'update'],
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
  methods: {
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
