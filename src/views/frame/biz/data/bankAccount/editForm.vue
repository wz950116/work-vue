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
          view: '/api/dd/organ/bank/account/get',
          save: '/api/dd/organ/bank/account/save',
          update: '/api/dd/organ/bank/account/update'
        },
        apiData: {
          view(param) {
            return param.bankAccountCode
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.bankAccountCode
          }
        },
        formData: [
          {
            label: 'data.bankAccount.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              usingFlag: '1',
              clickParent: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'data.bankAccount.form.bankCode',
            prop: 'bankCode',
            element: 'base-select',
            attrs: {
              data: 'DD_BANK',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'data.bankAccount.form.bankAccountNo',
            prop: 'bankAccountNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.bankAccount.form.bankAccountName',
            prop: 'bankAccountName',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.bankAccount.form.bankAccountType',
            prop: 'bankAccountType',
            element: 'base-select',
            list: this.$t('datadict.bankAccountType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bankAccount.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'data.bankAccount.form.remark',
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
