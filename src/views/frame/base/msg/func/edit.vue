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
          view: '/api/msg/func/get',
          save: '/api/msg/func/save',
          update: '/api/msg/func/update'
        },

        formData: [{
          label: 'msg.func.msgFuncCode',
          prop: 'msgFuncCode',
          element: 'input-validate',
          attrs: {
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },
        {
          label: 'msg.func.msgFuncName',
          prop: 'msgFuncName',
          element: 'input-validate',
          attrs: {
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },

        {
          label: 'msg.func.msgClassType',
          prop: 'msgClassType',
          element: 'base-select',
          list: this.$t('datadict.msgClassType'),
          attrs: {
            clearable: false
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        },
        {
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
        },
        {
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
