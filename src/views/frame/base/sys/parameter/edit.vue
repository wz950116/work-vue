<template>
  <qm-dialog :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/parameter/get',
          save: '/api/sys/parameter/save',
          update: '/api/sys/parameter/update'
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'sys.parameter.parameterCode',
            prop: 'parameterCode',
            element: 'input-validate',
            validate: [
              {
                required: true
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.parameter.parameterName',
            prop: 'parameterName',
            element: 'input-validate',
            validate: [
              {
                required: true
              }
            ],
            attrs: {
              clearable: true
            }
          }, {
            label: 'sys.parameter.parameterAttr',
            prop: 'parameterAttr',
            element: 'base-select',
            list: this.$t('datadict.sysParamAttr'),
            validate: [{
              required: true
            }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.parameter.parameterType',
            prop: 'parameterType',
            element: 'base-select',
            list: this.$t('datadict.sysParamType'),
            validate: [{
              required: true
            }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.parameter.parameterValue',
            prop: 'parameterValue',
            element: 'input-validate',
            validate: [{
              required: true
            }
            ],
            attrs: {
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
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
