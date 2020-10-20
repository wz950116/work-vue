<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>

export default {
  name: 'msgSupplier',
  components: {
  },
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          orderByField: 'key',
          data: {
            usingFlag: '',
            msgSupplierName: '',
            msgRecipientType: ''

          }
        },
        formData: [
          {
            label: 'msg.supplier.msgSupplierName',
            prop: 'msgSupplierName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.supplier.msgRecipientType',
            prop: 'msgRecipientType',
            element: 'base-select',
            list: this.$t('datadict.msgRecipientType'),
            attrs: {
              clearable: true
            }
          }]
      },

      mainData: {
        api: {
          search: '/api/msg/supplier/list',
          doDelete: '/api/msg/supplier/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [{
          name: 'add',
          type: 'dialog',
          component: () =>
            import('./edit.vue')
        }, {
          name: 'update',
          type: 'dialog',
          component: () =>
            import('./edit.vue'),
          getParam: () => {
            return this.$refs.qmTable.currentRow.msgSupplierCode
          }
        }, {
          name: 'remove',
          getParam: () => {
            return this.$refs.qmTable.currentRow.msgSupplierCode
          }
        }, {
          name: 'refresh'
        }],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'msg.supplier.msgSupplierName',
              width: '220',
              prop: 'msgSupplierName'
            },
            {
              label: 'msg.supplier.msgRecipientType',
              prop: 'msgRecipientType',
              align: 'center',
              width: '120',
              format: {
                dict: this.$t('datadict.msgRecipientType')
              }
            },
            {
              label: 'msg.supplier.msgInterface',
              width: '380',
              prop: 'msgInterface'
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }

      }
    }
  },

  methods: {

  }
}
</script>

