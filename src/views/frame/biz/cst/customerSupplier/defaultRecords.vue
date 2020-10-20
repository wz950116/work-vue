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
          search: ''
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          height: 200,
          cols: [
            {
              label: 'cst.customerSupplier.list.custName',
              prop: 'custName'
            },
            {
              label: 'cst.customerSupplier.list.type',
              prop: 'type'
            },
            {
              label: 'cst.customerSupplier.list.buySell',
              prop: 'buySell'
            },
            {
              label: 'cst.customerSupplier.list.contactNo',
              prop: 'contactNo'
            },
            {
              label: 'cst.customerSupplier.list.batchNo',
              prop: 'batchNo'
            },
            {
              label: 'cst.customerSupplier.list.exitBillNo',
              prop: 'exitBillNo'
            },
            {
              label: 'cst.customerSupplier.list.overduetime',
              prop: 'overduetime',
              attrs: {
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
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
