<template>
  <qm-edit-tab :tab="tab" ref='tab'></qm-edit-tab>
</template>

<script>
export default {
  name: 'product',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dd/taxRate/getByCode'
        },
        apiData: {
          search(param) {
            return param.productCode
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.addRow'
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          cols: [
            {
              label: 'data.product.list.taxType',
              width: '120',
              align: 'center',
              prop: 'taxType',
              element: 'base-select',
              list: this.$t('datadict.taxType'),
              required: true,
              attrs: {
                clearable: false
              }
            },
            {
              type: 'date',
              label: 'data.product.list.startDate',
              width: '180',
              align: 'center',
              prop: 'beginDate',
              required: true,
              attrs: {
                clearable: false,
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              label: 'data.product.list.taxRate',
              width: '150',
              align: 'right',
              prop: 'taxRate',
              element: 'input-formatter',
              required: true,
              attrs: {
                type: 'taxrate'
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
