<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/cust/billInfo/getByCode'
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
            isShow: ['add', 'update', 'modify']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'modify']
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update', 'modify']
          }
        ],
        table: {
          height: 200,
          cols: [
            {
              label: 'cst.customerSupplier.list.taxNo',
              prop: 'taxNo',
              element: 'input-validate',
              required: true,
              width: 200,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.bank',
              prop: 'bank',
              element: 'input-validate',
              required: true,
              width: 200,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.account',
              prop: 'account',
              element: 'input-validate',
              width: 200,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.address',
              prop: 'address',
              width: 300,
              element: 'input-validate',
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.phone',
              prop: 'phone',
              width: 150,
              element: 'input-validate',
              attrs: {
                clearable: true,
                maxlength: 50
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
