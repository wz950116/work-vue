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
          search: '/api/cust/contacts/getByCode'
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
              label: 'cst.customerSupplier.list.name',
              prop: 'name',
              element: 'input-validate',
              width: 100,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.mobilephone',
              prop: 'mobilePhone',
              element: 'input-formatter',
              width: 140,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.phone',
              prop: 'phone',
              element: 'input-validate',
              width: 200,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.position',
              prop: 'position',
              element: 'input-validate',
              width: 100,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.fax',
              prop: 'fax',
              element: 'input-validate',
              width: 200,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.mail',
              prop: 'mail',
              element: 'input-validate',
              width: 200,
              attrs: {
                validateType: 'email',
                clearable: true,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.remark',
              prop: 'remark',
              element: 'el-input',
              width: 500,
              attrs: {
                clearable: true,
                maxlength: 500
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
