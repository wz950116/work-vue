<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'cfgComponentEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgComponent/get',
          save: '/api/platform/cfgComponent/save',
          update: '/api/platform/cfgComponent/update'
        },
        apiData: {
          view(param) {
            return param
          }
        },
        formData: [
          {
            label: 'platform.cfgComponent.code',
            prop: 'code',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: '2'
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'platform.cfgComponent.name',
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
            label: 'platform.cfgComponent.systemFlag',
            prop: 'systemFlag',
            element: 'base-select',
            list: this.$t('datadict.systemFlag'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'platform.cfgComponent.blockType',
            prop: 'blockType',
            element: 'base-select',
            list: this.$t('datadict.blockType'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'platform.cfgComponent.routerName',
            prop: 'routerCode',
            element: 'base-select',
            attrs: {
              data: 'MAIN_MODULE',
              filterable: true
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
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
