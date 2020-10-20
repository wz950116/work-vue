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
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/customs/get',
          save: '/api/dd/customs/save',
          update: '/api/dd/customs/update'
        },
        apiData: {
          view(param) {
            return param.customsCode
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.customsCode
          }
        },
        formData: [
          {
            label: 'data.customs.form.customsName',
            prop: 'customsName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.areaCode',
            prop: 'areaCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_AREA',
              clearable: true
            }
          },
          {
            label: 'data.customs.form.contact',
            prop: 'contact',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.tel',
            prop: 'tel',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.mail',
            prop: 'mail',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.address',
            prop: 'address',
            element: 'input-validate',
            attrs: {
              cols: 2,
              clearable: true
            }
          },
          {
            label: 'data.customs.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 2,
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
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
