<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>

export default {
  name: 'msgChannel',
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
            msgChannelName: null,
            msgSupplierName: null

          }
        },
        formData: [
          {
            label: 'msg.channel.msgChannelName',
            prop: 'msgChannelName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.channel.msgSupplierName',
            prop: 'msgSupplierName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },

          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }]
      },

      mainData: {
        api: {
          search: '/api/msg/channel/list',
          doDelete: '/api/msg/channel/remove'
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
          getParam: () => {
            return this.$refs.qmTable.currentRow.msgChannelCode
          },
          component: () =>
            import('./edit.vue')
        }, {
          name: 'remove',
          getParam: () => {
            return this.$refs.qmTable.currentRow.msgChannelCode
          }
        }, {
          name: 'refresh'
        }],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'msg.channel.msgChannelName',
              width: '300',
              prop: 'msgChannelName'
            },
            {
              label: 'msg.channel.msgSupplierName',
              width: '300',
              prop: 'msgSupplierName'
            },
            {
              prop: 'usingFlag',
              width: '100',
              label: 'biz.lbl.usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
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

