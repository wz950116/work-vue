<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'platformManagerAdd',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        $('.el-col[data-key=password] .is-required .el-form-item__content').attr('data-content', this.$t('login.pwdValidateMsg'))
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/platform/cfgManager/save'
        },

        formData: [
          {
            label: 'platform.manager.account',
            prop: 'account',
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
            label: 'platform.manager.name',
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
            label: 'platform.manager.password',
            prop: 'password',
            element: 'el-input',
            attrs: {
              showPassword: true,
              encript: true,
              clearable: true,
              type: 'password',
              placeholder: this.$t('biz.placeholder.passwordSet'),
              minlength: 8,
              maxlength: 20
            },
            validate: [
              {
                required: true,
                validatorFn: validatePassword,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            type: 'radio',
            list: this.$t('datadict.usingFlag'),
            default: '1',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
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
