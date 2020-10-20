<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'sysFlowEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/flow/get',
          save: '/api/sys/flow/save',
          update: '/api/sys/flow/update'
        },
        apiData: {
          view(param) {
            return param
          }
        },
        formData: [
          {
            label: 'sys.flow.name',
            prop: 'name',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              maxlength: 80,
              clearable: true
            }
          },
          {
            label: 'sys.flow.code',
            prop: 'code',
            element: 'input-validate',
            attrs: {
              disabled: true,
              maxlength: 80,
              clearable: true
            }
          },
          {
            label: 'sys.flow.flowType',
            prop: 'flowType',
            element: 'base-select',
            list: this.$t('datadict.sysFlowType'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.flow.startBillType',
            prop: 'startBillType',
            element: 'base-select',
            list: this.$t('datadict.bizCode'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              filterable: true
            }
          },
          {
            label: 'sys.flow.psType',
            prop: 'psType',
            element: 'base-select',
            list: this.$t('datadict.purchaseOrSale'),
            attrs: {
              clearable: true
            }
          },

          {
            label: 'sys.flow.contractType',
            prop: 'contractType',
            element: 'base-select',
            list: this.$t('datadict.contractType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.flow.tradeType',
            prop: 'tradeType',
            element: 'base-select',
            list: this.$t('datadict.dfTradeType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.flow.settleStyle',
            prop: 'settleStyle',
            element: 'base-select',
            list: this.$t('datadict.tradeWay'),
            attrs: {
              clearable: true
            }
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
              cols: 3,
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
