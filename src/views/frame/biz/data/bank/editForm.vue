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
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/bank/get',
          save: '/api/dd/bank/save',
          update: '/api/dd/bank/update'
        },
        apiData: {
          view(params) {
            return params.bankCode
          },
          save(params) {
            return params.bankCode
          },
          update(params) {
            return params.bankCode
          }
        },
        formData: [
          {
            label: 'data.bank.form.bankName',
            prop: 'bankName',
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
            label: 'data.bank.form.areaName',
            prop: 'areaCode',
            element: 'tree-area',
            component: () => import('@/views/frame/biz/data/area/TreeArea.vue'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.contact',
            prop: 'contact',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.tel',
            prop: 'tel',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.mail',
            prop: 'mail',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bank.form.address',
            prop: 'address',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
            }
          },
          {
            label: 'data.bank.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
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
