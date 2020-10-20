<template>
  <qm-dialog :dialog='dialog' ref='qmDialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'cfgGoodsColManageEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgGoodsCol/get',
          save: '/api/platform/cfgGoodsCol/save',
          update: '/api/platform/cfgGoodsCol/update'
        },

        formData: [
          {
            label: 'sys.goodsCol.columnName',
            prop: 'columnName',
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
            label: 'sys.goodsCol.columnDatatype',
            prop: 'columnDatatype',
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
            label: 'sys.goodsCol.columnTxt',
            prop: 'columnTxt',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [{
              trigger: 'blur'
            }]
          },
          {
            label: 'sys.goodsCol.columnTxtEn',
            prop: 'columnTxtEn',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [{
              trigger: 'blur'
            }]
          }, {
            label: 'sys.goodsCol.orderNum',
            prop: 'orderNum',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              type: 'num'
            }
          },
          {
            label: 'sys.goodsCol.columnSumflag',
            prop: 'columnSumflag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            default: '1',
            attrs: {
              clearable: false
            },
            validate: [{
              required: true,
              trigger: 'change'
            }]
          },
          {
            label: 'sys.goodsCol.proType',
            prop: 'proType',
            element: 'base-select',
            list: this.$t('datadict.proType'),
            attrs: {
              clearable: false
            },
            validate: [{
              required: true,
              trigger: 'change'
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
  created() {

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
