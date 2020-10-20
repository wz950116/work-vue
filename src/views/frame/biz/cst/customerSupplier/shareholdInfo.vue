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
          search: '/api/cust/stackHold/getByCode'
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
              label: 'cst.customerSupplier.list.shareholder',
              prop: 'shareholder',
              element: 'input-validate',
              width: 150,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 100
              }
            },
            {
              label: 'cst.customerSupplier.list.amount',
              prop: 'amount',
              element: 'input-formatter',
              width: 150,
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 3,
                maxlength: 50
              }
            },
            {
              label: 'cst.customerSupplier.list.shareholdSituation',
              prop: 'shareholdSituation',
              element: 'input-formatter',
              required: true,
              width: 150,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'thousands',
                precision: 2,
                maxlength: 20
              }
            },
            {
              label: 'cst.customerSupplier.list.contactsInfo',
              prop: 'contactsInfo',
              element: 'input-validate',
              width: 200,
              attrs: {
                clearable: true,
                maxlength: 20
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
