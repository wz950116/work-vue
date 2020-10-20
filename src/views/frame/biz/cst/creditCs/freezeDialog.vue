<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        initType: 'param',
        titleName: '冻结与解冻',
        api: {
          view: '',
          update: '/api/cust/credit/updateFreezeStatus'
        },
        apiData: {
          view(param) {
            return param
          },
          update(param) {
            return param
          }
        },
        formData: [
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
        bottomButtons: [{
          iconName: '线性-关闭',
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }, {
          iconName: '线性-取消',
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.save',
          iconName: '线性-保存',
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  created() {

  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
