<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
export default {
  name: 'msgTemplet',
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
            templetName: null,
            msgFuncName: null
          }
        },
        formData: [
          {
            label: 'msg.templet.templetName',
            prop: 'msgTempletName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.templet.msgFuncName',
            prop: 'msgFuncName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.templet.msgChannelName',
            prop: 'msgChannelName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/msg/templet/list',
          doDelete: '/api/msg/templet/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue'),
            getParam: () => {
              return this.$refs.qmTable.currentRow.msgTempletCode
            }
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.msgTempletCode
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'msg.templet.templetName',
              prop: 'msgTempletName',
              width: 200
            },
            {
              label: 'msg.templet.msgFuncCode',
              prop: 'msgFuncCode',
              width: 200
            },
            {
              label: 'msg.templet.msgFuncName',
              prop: 'msgFuncName',
              width: 200
            },
            {
              label: 'msg.templet.msgChannelName',
              prop: 'msgChannelName',
              width: 150
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              label: 'biz.lbl.usingFlag',
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
  }
}
</script>

