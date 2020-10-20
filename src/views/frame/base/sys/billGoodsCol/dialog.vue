<template>
  <qm-dialog :dialog='dialog' ref='qmDialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        initType: 'api',
        styleType: 'mini',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          update: '/api/sys/sysBillGoodsCol/update',
          view: '/api/sys/sysBillGoodsCol/get'
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
            label: 'sys.goodsCol.columnName',
            prop: 'columnName',
            element: 'input-validate',
            attrs: {
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.goodsCol.columnDatatype',
            prop: 'columnDatatype',
            element: 'input-validate',
            attrs: {
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },

          {
            label: 'sys.goodsCol.columnTxt',
            prop: 'columnTxt',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },

          {
            label: 'sys.goodsCol.columnTxtEn',
            prop: 'columnTxtEn',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.goodsCol.columnFormat',
            prop: 'columnFormat',
            list: this.$t('datadict.numFormat'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.goodsCol.columnWidth',
            prop: 'columnWidth',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              min: 0,
              max: 999,
              maxlength: 3,
              type: 'integer',
              precision: 0
            }
          },
          {
            label: 'sys.goodsCol.orderNum',
            prop: 'orderNum',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              type: 'num'
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            type: 'radio',
            list: this.$t('datadict.usingFlag'),
            default: '1',
            attrs: {
              clearable: false
            },
            validate: [
              {
                required: true,
                trigger: 'change'
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
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
