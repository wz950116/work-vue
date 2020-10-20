<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'tenantManageAdd',

  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgTenant/get',
          save: '/api/platform/cfgTenant/update',
          update: '/api/platform/cfgTenant/update'
        },
        apiData: {
          code: this.param,
          view() {
            return this.code
          }
        },
        formData: [
          {
            label: 'platform.tenant.name',
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
            label: 'platform.tenant.account',
            prop: 'account',
            element: 'input-validate',
            attrs: {
              disabled: true,
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
            label: 'platform.tenant.contactor',
            prop: 'contactor',
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
            label: 'platform.tenant.tel',
            prop: 'tel',
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
            label: 'platform.tenant.address',
            prop: 'address',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 4,
              clearable: true
            }
          },
          {
            label: 'platform.tenant.failnum',
            prop: 'failnum',
            element: 'el-input',
            isShow: this.opType === 'view' ? true : false,
            attrs: {
              align: 'right',
              disabled: true
            }
          },
          {
            label: 'platform.tenant.loginTime',
            prop: 'loginTime',
            element: 'el-date-picker',
            isShow: this.opType === 'view' ? true : false,
            attrs: {
              cols: 2,
              type: 'datetime',
              align: 'right',
              disabled: true
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
  created() {},
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
