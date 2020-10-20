<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'channelEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'max',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/msg/channel/get',
          save: '/api/msg/channel/save',
          update: '/api/msg/channel/update'
        },

        formData: [
          {
            label: 'msg.channel.msgChannelName',
            prop: 'msgChannelName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 80
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'msg.channel.msgSupplierId',
            prop: 'msgSupplierCode',
            element: 'base-select',
            attrs: {
              data: 'MSG_SUPPLIER',
              clearable: true,
              maxlength: 80
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
            label: 'msg.channel.msgPri',
            prop: 'msgPri',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              max: 999999999999.99,
              min: 0,
              precision: 2,
              controls: false,
              type: 'price'
            }
          },
          {
            label: 'msg.channel.msgAccound',
            prop: 'msgAccound',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },
          {
            label: 'msg.channel.msgPassword',
            prop: 'msgPassword',
            element: 'input-validate',
            attrs: {
              showPassword: true,
              clearable: true,
              maxlength: 120
            }
          },

          {
            label: 'msg.channel.mailSendProtocol',
            prop: 'mailSendProtocol',
            element: 'base-select',
            list: this.$t('datadict.sendMailProtocol'),
            attrs: {
              clearable: false
            }
          },
          {
            label: 'msg.channel.mailServerHost',
            prop: 'mailServerHost',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },

          {
            label: 'msg.channel.mailServerPort',
            prop: 'mailServerPort',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              max: 999999999999.99,
              min: 0,
              precision: 0,
              controls: false,
              type: 'num'
            }
          },
          {
            label: 'msg.channel.mailFromName',
            prop: 'mailFromName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 80
            }
          },
          {
            label: 'msg.channel.mailFromAddress',
            prop: 'mailFromAddress',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },
          {
            label: 'msg.channel.serviceAddrChk',
            prop: 'serviceAddrChk',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },
          {
            label: 'msg.channel.corpId',
            prop: 'corpId',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },

          {
            label: 'msg.channel.corpSecret',
            prop: 'corpSecret',
            element: 'input-validate',
            attrs: {
              showPassword: true,
              clearable: true,
              maxlength: 120
            }
          },
          {
            label: 'msg.channel.appid',
            prop: 'appid',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 120
            }
          },
          {
            label: 'msg.channel.appsecret',
            prop: 'appsecret',
            element: 'input-validate',
            attrs: {
              showPassword: true,
              clearable: true,
              maxlength: 120
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
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
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
