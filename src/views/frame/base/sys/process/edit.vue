<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'sysProcessManagerEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          update: '/api/sys/sysProcess/save',
          save: '/api/sys/sysProcess/save'
        },

        formData: [
          {
            label: 'platform.process.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: true,
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
            label: 'platform.process.value',
            prop: 'value',
            element: 'base-select',
            list: this.getItem(),
            attrs: {
              clearable: false,
              maxlength: 32
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
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
  mounted() {},
  methods: {
    getItem() {
      const items = []
      if (this.param && this.param.optionalValue) {
        this.param.optionalValue.split(';').forEach(info => {
          const item = {}
          item['key'] = info.split(':')[0]
          item['value'] = info.split(':')[0]
          item['label'] = info.split(':')[1]
          items.push(item)
        })
      }
      return items
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
