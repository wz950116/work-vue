<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <tradeNatureDialog v-if="typeDialogVisible" @close="dialogClose" @selectNature="selectNature"></tradeNatureDialog>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import tradeNatureDialog from '@/views/frame/rm/strategy/spotTrade/components/tradeNatureDialog'

export default {
  name: 'spotTrade',
  components: {
    tradeNatureDialog
  },
  data() {
    return {
      typeDialogVisible: false,
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            planName: '',
            makeDate: '',
            makeUser: ''
          },
          defaultSortString: 'makeDate.desc, matchCode.desc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.spotTrade.form.planName',
            prop: 'planName',
            element: 'input-validate'
          },
          {
            width: 120,
            type: 'date',
            label: 'strategy.spotTrade.form.makeDate',
            prop: 'makeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.spotTrade.form.makeUser',
            prop: 'makeUser',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/strategy/strgSpotTradeMatch/list'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            event: this.add
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            event: this.update
          },
          {
            name: 'remove',
            $refs: this.$refs,
            event: this.remove
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            event: this.view
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'spotTrade',
          cols: [
            {
              prop: 'planCode',
              label: 'strategy.spotTrade.list.planCode',
              width: '150'
            },
            {
              prop: 'planName',
              width: '150',
              label: 'strategy.spotTrade.list.planName'
            },
            {
              prop: 'matchCode',
              width: '150',
              label: 'strategy.spotTrade.list.matchCode'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'strategy.spotTrade.list.makeUser'
            },
            {
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.spotTrade.list.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'autoMatchFlag',
              align: 'center',
              width: '100',
              label: 'strategy.spotTrade.list.autoMatchFlag',
              format: {
                dict: this.$t('datadict.yesNo')
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
      this.typeDialogVisible = true
    },
    dialogClose() {
      this.typeDialogVisible = false
      this.$refs.qmTable.getList()
    },
    selectNature(value) {
      this.typeDialogVisible = false

      var page
      if (value === '1') {
        page = 'strategySpotTradeAdd'
      } else if (value === '2') {
        page = 'planSpotTradeAdd'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'add',
          tradeNature: value
        }
      })
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

      var strategyNature = this.$refs.qmTable.currentRow.strgLevel
      var page
      var tradeNature
      if (strategyNature === '2' || strategyNature === '4') {
        page = 'strategySpotTradeEdit'
        tradeNature = '1'
      } else if (strategyNature === '1' || strategyNature === '3') {
        page = 'planSpotTradeEdit'
        tradeNature = '2'
      }

      this.$router.push({
        name: page,
        params: {
          type: 'update',
          tradeNature: tradeNature,
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    },
    remove() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategy/strgSpotTradeMatch/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: currentRow.matchCode
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.deleteSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
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

      var strgLevel = this.$refs.qmTable.currentRow.strgLevel
      var page
      var tradeNature
      if (strgLevel === '2' || strgLevel === '4') {
        page = 'strategySpotTradeView'
        tradeNature = '1'
      } else if (strgLevel === '1' || strgLevel === '3') {
        page = 'planSpotTradeView'
        tradeNature = '2'
      }

      this.$router.push({
        name: page,
        params: {
          type: 'view',
          tradeNature: tradeNature,
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    }
  }
}
</script>
