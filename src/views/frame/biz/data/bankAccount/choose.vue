<template>
  <qm-dialog-table :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('route.' + this.$route.meta.title),
        moreShowFlg: true,
        formData: [{
          label: 'data.bankAccount.form.organCode',
          prop: 'organCode',
          element: 'base-select',
          attrs: {
            data: 'TREE_ORGAN',
            clearable: true,
            usingFlag: '1'
          }
        }, {
          label: 'data.bankAccount.form.bankCode',
          prop: 'bankCode',
          element: 'base-select',
          attrs: {
            data: 'DD_BANK',
            clearable: true
          }
        }, {
          label: 'data.bankAccount.form.bankAccountName',
          prop: 'bankAccountName',
          element: 'input-validate',
          attrs: {
            clearable: true
          }
        }, {
          label: 'data.bankAccount.form.usingFlag',
          prop: 'usingFlag',
          element: 'base-select',
          list: this.$t('datadict.usingFlag'),
          attrs: {
            clearable: true
          }
        }, {
          label: 'data.bankAccount.form.bankAccountNo',
          prop: 'bankAccountNo',
          element: 'input-validate',
          attrs: {
            clearable: true
          }
        }, {
          label: 'data.bankAccount.form.bankAccountType',
          prop: 'bankAccountType',
          element: 'base-select',
          list: this.$t('datadict.bankAccountType'),
          attrs: {
            clearable: true
          }
        }],

        mainData: {
          api: {
            search: '/api/dd/organ/bank/account/list'
          },
          table: {
            cols: [{
              prop: 'organName',
              label: 'data.bankAccount.list.organName'
            }, {
              prop: 'bankName',
              label: 'data.bankAccount.list.bankName'
            }, {
              prop: 'bankAccountNo',
              label: 'data.bankAccount.list.bankAccountNo'
            }, {
              prop: 'bankAccountName',
              label: 'data.bankAccount.list.bankAccountName'
            }, {
              prop: 'bankAccountType',
              format: {
                dict: this.$t('datadict.bankAccountType')
              },
              label: 'data.bankAccount.list.bankAccountType'
            }, {
              prop: 'usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.bankAccount.list.usingFlag'
            }]
          }
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.choose',
          event: 'save',
          showLoading: true,
          isShow: ['add', 'update']
        }]
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
