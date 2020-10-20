<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'funcEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/msg/supplier/get',
          save: '/api/msg/supplier/save',
          update: '/api/msg/supplier/update'
        },

        formData: [{
          label: 'msg.supplier.msgSupplierName',
          prop: 'msgSupplierName',
          element: 'input-validate',
          attrs: {
            clearable: true,
            maxlength: 80
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },

        {
          label: 'msg.supplier.msgRecipientType',
          prop: 'msgRecipientType',
          element: 'base-select',
          list: this.$t('datadict.msgRecipientType'),
          attrs: {
            clearable: false
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        },
        {
          label: 'msg.supplier.msgInterface',
          prop: 'msgInterface',
          element: 'el-input',
          attrs: {
            cols: 4,
            clearable: true,
            maxlength: 120
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        },
        {
          label: 'biz.lbl.remark',
          prop: 'remark',
          element: 'el-input',
          attrs: {
            cols: 4,
            clearable: true
          }
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
  created() {

  },
  methods: {
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
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
