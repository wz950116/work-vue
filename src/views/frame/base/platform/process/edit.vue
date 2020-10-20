<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'porcessEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgProcess/get',
          update: '/api/platform/cfgProcess/update',
          save: '/api/platform/cfgProcess/save'
        },

        formData: [
          {
            label: 'platform.process.code',
            prop: 'code',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 32
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'platform.process.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 32
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'platform.process.defaultValue',
            prop: 'defaultValue',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 32
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'platform.process.optionalValue',
            prop: 'optionalValue',
            element: 'el-input',
            attrs: {
              cols: 4,
              maxlength: 500,
              placeholder: '格式为(值:显示值),值与值之间用分号隔开,例如１:a; 2:b; 3:c',
              clearable: true
            }
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 4,
              maxlength: 500,
              clearable: true
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
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update'],
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
    attachment() {},
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
