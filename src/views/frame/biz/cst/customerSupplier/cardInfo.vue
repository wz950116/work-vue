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
          search: '/api/cust/cardInfo/getByCode'
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
            isShow: ['add', 'update','modify']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update','modify']
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update','modify']
          }
        ],
        table: {
          height: 200,
          cols: [
            {
              label: 'cst.customerSupplier.list.cardType',
              prop: 'cardType',
              element: 'base-select',
              list: this.$t('datadict.cardType'),
              width: 120,
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              label: 'cst.customerSupplier.list.cardNo',
              prop: 'cardNo',
              element: 'input-validate',
              width: 200,
              required: true,
              attrs: {
                clearable: true,
                maxlength: 50
              }
            },
            {
              type: 'date',
              label: 'cst.customerSupplier.list.registDate',
              prop: 'registDate',
              required: true,
              width: 140,
              attrs: {
                clearable: true,
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
              }
            },
            {
              type: 'date',
              label: 'cst.customerSupplier.list.expiryDate',
              prop: 'expiryDate',
              width: 140,
              required: true,
              attrs: {
                clearable: true,
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
              }
            },
            {
              label: 'cst.customerSupplier.list.registAddress',
              prop: 'registAddress',
              element: 'input-validate',
              width: 400,
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
