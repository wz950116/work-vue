<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'funcDataperEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        initType: 'param',
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/func/dataper/save',
          update: '/api/func/dataper/save'
        },

        formData: [{
          label: 'platform.dataper.name',
          prop: 'name',
          element: 'input-validate',
          attrs: {
            clearable: true,
            disabled: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },
        {
          label: 'platform.dataper.code',
          prop: 'code',
          element: 'input-validate',
          attrs: {
            clearable: true,
            disabled: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
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
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
