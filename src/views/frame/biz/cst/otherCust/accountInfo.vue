<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  name: 'warehoueCompany',
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/cust/bankInfo/getByCode'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          height: 200,
          cols: [
            {
              label: 'cst.warehoueCompany.list.bank',
              prop: 'bankCode',
              element: 'base-select',
              required: true,
              width: 200,
              attrs: {
                data: 'DD_BANK',
                clearable: true
              }
            },
            {
              label: 'cst.warehoueCompany.list.account',
              prop: 'bankAccountNo',
              element: 'input-validate',
              width: 300,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 100
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  }
}
</script>
