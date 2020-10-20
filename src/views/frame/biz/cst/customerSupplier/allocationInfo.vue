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
          search: '/api/cust/allocation/list'
        },
        apiData: {
          search(param) {
            return { custCode: param.uk || param.id }
          }
        },
        table: {
          height: 355,
          cols: [
            {
              prop: 'orgName',
              label: 'cst.customerSupplier.list.orgName',
              width: '140',
              align: 'center'
            },
            {
              prop: 'typeCodeList',
              label: 'cst.customerSupplier.list.custType',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.custcsType')
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
