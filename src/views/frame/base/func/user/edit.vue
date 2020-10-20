<template>
  <qm-dialog ref='qmDialog' :initFun='initFun' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
import request from '@/utils/frame/base/request'
import session from '@/utils/frame/base/sessionStorage'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import { encriptPwd } from '@/utils/frame/base/encript.js'
import { getRandom, aesEncrypt } from '@/utils/frame/base/crypto'
export default {
  name: 'userEdit',
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
        styleType: 'max',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/user/get',
          save: '/api/func/user/save',
          update: '/api/func/user/save'
        },

        formData: [
          {
            label: 'func.user.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.user.account',
            prop: 'account',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.user.password',
            prop: 'password',
            element: 'input-validate',
            isShow: ['add'],
            attrs: {
              showPassword: true,
              type: 'password',
              placeholder: this.$t('biz.placeholder.passwordSet'),
              minlength: 6,
              maxlength: 20,
              encript: true,
              cols: 2,
              clearable: true
            },
            validate: [
              {
                validatorFn: validatePassword,
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            prop: 'zhan01',
            isShow: ['view', 'update'],
            attrs: { cols: 2 }
          },
          {
            label: 'func.user.userValidPeriodFlag',
            prop: 'userValidPeriodFlag',
            element: 'el-checkbox',
            default: true,
            event: {
              change: this.userValidPeriodFlgChange
            }
          },
          {
            label: 'func.user.userValidPeriodDate',
            prop: 'userValidPeriodDate',
            type: 'date',
            default: this.getDefaultValue(),
            attrs: {
              clearable: false,
              disabled: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd',
              align: 'right',
              pickerOptions: this.getPickerOptions()
            }
          },
          {
            label: 'func.user.passwdValidPeriodFlag',
            prop: 'passwdValidPeriodFlag',
            element: 'el-checkbox',
            default: true,
            event: {
              change: this.passwdValidPeriodFlgChange
            }
          },
          {
            label: 'func.user.passwdValidPeriodDay',
            prop: 'passwdValidPeriodDay',
            element: 'el-input-number',
            default: 90,
            attrs: {
              clearable: false,
              disabled: true,
              min: 1,
              size: 'mini'
            }
          },

          {
            prop: 'passwordO',
            default: '',
            isShow: false
          },
          {
            prop: 'random',
            default: '',
            isShow: false
          },
          {
            label: 'func.user.employeeName',
            prop: 'employeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE', // 统一基础档案组件，传值data区分
              clearable: false,
              cols: 2,
              showMoreList: true,
              component: () => import('@/views/frame/base/organ/employee/components/employeeSelect.vue')
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: {
              changeAll: this.onChangeAll
            }
          },
          {
            label: 'func.user.identity',
            prop: 'identity',
            element: 'base-select',
            list: this.$t('datadict.optIdentity'),
            default: '4',
            attrs: {
              disabled: this.getIdentityDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
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
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'func.user.failnum',
            prop: 'failnum',
            element: 'el-input',
            isShow: this.opType === 'view' ? true : false,
            attrs: {
              align: 'right',
              disabled: true
            }
          },
          {
            label: 'func.user.loginTime',
            prop: 'loginTime',
            element: 'el-date-picker',
            isShow: this.opType === 'view' ? true : false,
            attrs: {
              cols: 2,
              type: 'datetime',
              align: 'right',
              disabled: true
            }
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 4,
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
            event: this.save,
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
    getDefaultValue() {
      return toolUtil.getDayAfter(90)
    },
    getPickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      }
    },
    initFun(formData) {
      if (formData) {
        this.passwdValidPeriodFlgChange(formData.passwdValidPeriodFlag)
        this.userValidPeriodFlgChange(formData.userValidPeriodFlag)
      }
    },
    passwdValidPeriodFlgChange(value) {
      if (value) {
        toolUtil.getDefDialogItemByProp(this, 'passwdValidPeriodDay').attrs.disabled = true
      } else {
        toolUtil.getDefDialogItemByProp(this, 'passwdValidPeriodDay').attrs.disabled = false
      }
    },
    userValidPeriodFlgChange(value) {
      if (value) {
        toolUtil.getDefDialogItemByProp(this, 'userValidPeriodDate').attrs.disabled = true
      } else {
        toolUtil.getDefDialogItemByProp(this, 'userValidPeriodDate').attrs.disabled = false
      }
    },
    // 保存通用事件
    save() {
      this.$refs.qmDialog.$refs.refForm.validate(valid => {
        if (valid) {
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              if (this.opType === 'add') {
                // 加密的处理
                const random = getRandom(8)
                this.$refs.qmDialog.formData['random'] = random
                this.$refs.qmDialog.formData['passwordO'] = aesEncrypt(this.$refs.qmDialog.formData['password'], random)
                this.$refs.qmDialog.formData['password'] = encriptPwd(this.$refs.qmDialog.formData['password'])
              }
              request({
                url: this.$refs.qmDialog.dialog.type === 'add' ? this.$refs.qmDialog.dialog.api.save : this.$refs.qmDialog.dialog.api.update,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.$refs.qmDialog.formData
                }
              })
                .then(response => {
                  this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))
                  this.$emit('closeHandler', true)
                })
                .catch(() => {})
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    getIdentityDisabled() {
      const loginType = session.get('loginType')
      if (loginType && loginType === 'user') {
        if (this.$store.getters.identity && (this.$store.getters.identity === '3' || this.$store.getters.identity === '4')) {
          return true
        }
      }
      return false
    },
    getDisabled() {
      return !(this.opType === 'add')
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    onChangeAll(param) {}
  }
}
</script>
