<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'dataperManageEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgDataper/get',
          save: '/api/platform/cfgDataper/save',
          update: '/api/platform/cfgDataper/save'
        },

        formData: [{
          label: 'platform.dataper.name',
          prop: 'name',
          element: 'input-validate',
          attrs: {
            clearable: true
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
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },
        {
          label: 'biz.lbl.usingFlag',
          prop: 'usingFlag',
          type: 'radio',
          list: this.$t('datadict.usingFlag'),
          default: '1',
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
    attachment() {

    },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
