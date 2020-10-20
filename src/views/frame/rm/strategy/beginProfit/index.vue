<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if='$route.name === $options.name'>
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>

    <editDialog v-if="dialogVisible" :type="type" :id="postId" @close="dialogClose"></editDialog>
  </div>
</template>
<script>
import editDialog from '@/views/frame/rm/strategy/beginProfit/edit.vue'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'beginProfit',
  components: {
    editDialog
  },
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
          defaultSortString: 'saveDate.desc'
        },
        formData: [
          {
            label: 'strategy.beginProfit.strategyName',
            prop: 'strategyName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.beginProfit.strategyCode',
            prop: 'strategyCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/strategy/strgBeginProfit/list',
          doDelete: '/api/strategy/strgBeginProfit/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            $refs: this.$refs,
            event: this.add
          },
          {
            name: 'update',
            $refs: this.$refs,
            event: this.update
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
            $refs: this.$refs,
            event: this.view
          },
          {
            name: 'export'
          },
          {
            name: 'refresh',
            permitName: ['query']
          }
        ],

        isColset: true,
        table: {
          id: 'beginProfit',
          cols: [
            {
              prop: 'saveDate',
              width: '100',
              align: 'center',
              label: 'strategy.beginProfit.saveDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'strategyCode',
              width: '150',
              label: 'strategy.beginProfit.strategyCode'
            },
            {
              prop: 'strategyName',
              width: '150',
              label: 'strategy.beginProfit.strategyName'
            },
            {
              prop: 'type',
              width: '90',
              label: 'strategy.beginProfit.type',
              format: {
                dict: this.$t('datadict.itemClass')
              }
            },
            {
              prop: 'productName',
              width: '100',
              label: 'strategy.beginProfit.productCode'
            },
            {
              prop: 'futuresContractCode',
              width: '100',
              label: 'strategy.beginProfit.futuresContractCode'
            },
            {
              prop: 'relizationProfit',
              align: 'right',
              width: '100',
              label: 'strategy.beginProfit.relizationProfit',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'positionProfit',
              align: 'right',
              width: '100',
              label: 'strategy.beginProfit.positionProfit',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
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

