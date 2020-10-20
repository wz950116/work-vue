<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
export default {
  name: 'msgStat',
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
          data: {}
        },
        formData: [
          {
            type: 'date',
            label: 'msg.record.userSendDt',
            props: ['userSendDateStart', 'userSendDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'msg.record.msgFuncName',
            prop: 'msgFuncName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.record.msgChannelName',
            prop: 'msgChannelName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },

          {
            label: 'msg.record.msgSendStat',
            prop: 'msgSendStat',
            element: 'base-select',
            list: this.$t('datadict.msgSendStat'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/msg/recordStat/list'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'msg.record.msgFuncCode',
              width: '160',
              prop: 'msgFuncCode'
            },
            {
              label: 'msg.record.msgFuncName',
              width: '160',
              prop: 'msgFuncName'
            },
            {
              label: 'msg.record.msgChannelName',
              width: '160',
              prop: 'msgChannelName'
            },
            {
              label: 'msg.record.sendNum',
              width: '100',
              prop: 'sendNum',
              align: 'right',
              attrs: {
                type: 'num'
              }
            },
            {
              label: 'msg.record.userSendDt',
              width: '100',
              prop: 'userSendDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'msg.record.tenantCode',
              width: '100',
              prop: 'tenantName'
            },
            {
              prop: 'msgSendStat',
              width: '100',
              label: 'msg.record.msgSendStat',
              align: 'center',
              format: {
                dict: this.$t('datadict.msgSendStat')
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
  }
}
</script>

