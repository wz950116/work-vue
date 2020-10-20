<template>
  <qm-dialog :dialog='dialog' :param='param' :opType="opType" @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'dictShowEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        initType: 'param',
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/sys/dictItemShow/save',
          update: '/api/sys/dictItemShow/save'
        },

        formData: [{
          label: 'sys.dict.snowName',
          prop: 'dictItemShowName',
          element: 'input-validate',
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          prop: 'showFlag',
          label: 'sys.dict.dictItem.showFlag',
          type: 'radio',
          list: this.$t('datadict.showType'),
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        }, {
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
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
