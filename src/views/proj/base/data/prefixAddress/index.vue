<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'prefixAddress',
  components: {},
  data() {
    return {
      type: '',
      postId: '',
      dialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            strategyCode: '',
            strategyName: ''
          },
          defaultSortString: 'id.desc'
        },
        formData: []
      },
      mainData: {
        api: {
          search: '/api/data/ddPrefixAddress/list',
          doDelete: '/api/data/ddPrefixAddress/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              if (this.$refs.qmTable.currentRow) {
                return this.$refs.qmTable.currentRow.id
              } else {
                return ''
              }
            },
            component: () => import('@/views/proj/base/data/prefixAddress/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/proj/base/data/prefixAddress/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/proj/base/data/prefixAddress/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            permitName: 'query',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'prefixAddress',
          cols: [
            {
              prop: 'custName',
              width: '120',
              label: 'dataHq.prefixAddress.custName'
            },
            {
              prop: 'transactionAddress',
              width: '200',
              label: 'dataHq.prefixAddress.transactionAddress'
            },
            {
              prop: 'marketAddress',
              width: '200',
              label: 'dataHq.prefixAddress.marketAddress'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.prefixAddress.usingFlag'
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
    add() {
      this.type = 'add'
      this.dialogVisible = true
    },
    update() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.type = 'update'
      this.postId = this.$refs.qmTable.currentRow.id
      this.dialogVisible = true
    },
    view() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.type = 'view'
      this.postId = this.$refs.qmTable.currentRow.id
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
      this.$refs.qmTable.getList()
    }
  }
}
</script>

