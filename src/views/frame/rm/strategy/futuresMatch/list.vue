<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <futureMatchType v-if="typeDialogVisible" @close="dialogClose" @selectType="selectNature"></futureMatchType>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import futureMatchType from '@/views/frame/rm/strategy/futuresMatch/components/futureMatchType'

export default {
  name: 'futureMatch',
  components: {
    futureMatchType
  },
  data() {
    return {
      typeDialogVisible: false,
      addType: '',
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: 'makeDate.desc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.futureMatch.form.superiorName',
            prop: 'instructionName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            type: 'date',
            label: 'strategy.futureMatch.form.makeDate',
            prop: 'makeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.futureMatch.form.makeUser',
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
          search: '/api/strategy/match/page'
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
            name: 'futureDelivery',
            iconName: '线性-标记',
            i18n: '期货交割',
            event: this.futureDelivery
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
              prop: 'matchType',
              label: 'strategy.futureMatch.list.matchType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.matchType')
              }
            },
            {
              prop: 'instructionCode',
              width: '180',
              label: 'strategy.futureMatch.list.instructionCode'
            },
            {
              prop: 'instructionName',
              width: '150',
              label: 'strategy.futureMatch.list.instructionName'
            },
            {
              prop: 'matchCode',
              width: '150',
              label: 'strategy.futureMatch.list.matchCode'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'strategy.futureMatch.list.makeUserName'
            },
            {
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.futureMatch.list.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
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
      this.addType = '1'
      this.typeDialogVisible = true
    },
    dialogClose() {
      this.typeDialogVisible = false
      this.$refs.qmTable.getList()
    },
    selectNature(value) {
      if (this.addType === '1') {
        this.typeDialogVisible = false
        var page
        if (value === '1') {
          page = 'futureMatchStrategyAdd'
        } else if (value === '2') {
          page = 'futureMatchPlanAdd'
        } else {
          page = 'futureMatchInstructionAdd'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'add',
            tradeNature: value
          }
        })
      } else {
        this.typeDialogVisible = false
        var page
        if (value === '1') {
          page = 'deliveryMatchStrategyAdd'
        } else if (value === '2') {
          page = 'deliveryMatchPlanAdd'
        } else {
          page = 'deliveryMatchInstrAdd'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'add',
            tradeNature: value
          }
        })
      }
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
      if (this.$refs.qmTable.currentRow.matchType === '1') {
        var strategyNature = this.$refs.qmTable.currentRow.strgLevel
        var page
        var tradeNature
        if (strategyNature === '4') {
          page = 'futureMatchStrategyUpdate'
          tradeNature = '1'
        } else if (strategyNature === '3') {
          page = 'futureMatchPlanUpdate'
          tradeNature = '2'
        } else if (strategyNature === '1' || strategyNature === '2') {
          page = 'futureMatchInstructionUpdate'
          tradeNature = '3'
        }

        this.$router.push({
          name: page,
          params: {
            type: 'update',
            tradeNature: tradeNature,
            uk: this.$refs.qmTable.currentRow.matchCode
          }
        })
      } else if (this.$refs.qmTable.currentRow.matchType === '4') {
        var strategyNature = this.$refs.qmTable.currentRow.strgLevel
        var page
        var tradeNature
        if (strategyNature === '4') {
          page = 'deliveryMatchStrategyEdit'
          tradeNature = '1'
        } else if (strategyNature === '3') {
          page = 'deliveryMatchPlanEdit'
          tradeNature = '2'
        } else if (strategyNature === '1' || strategyNature === '2') {
          page = 'deliveryMatchInstrEdit'
          tradeNature = '3'
        }

        this.$router.push({
          name: page,
          params: {
            type: 'update',
            uk: this.$refs.qmTable.currentRow.matchCode,
            tradeNature: tradeNature
          }
        })
      }
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
        if (currentRow.matchType === '1') {
          request({
            url: '/api/strategy/match/remove',
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
        }
        if (currentRow.matchType === '4') {
          request({
            url: '/api/strategy/dlvryMatchBatch/remove',
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
        }
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
      if (this.$refs.qmTable.currentRow.matchType === '1') {
        var strategyNature = this.$refs.qmTable.currentRow.strgLevel
        var page
        var tradeNature
        if (strategyNature === '4') {
          page = 'futureMatchStrategyView'
          tradeNature = '1'
        } else if (strategyNature === '3') {
          page = 'futureMatchPlanView'
          tradeNature = '2'
        } else if (strategyNature === '1' || strategyNature === '2') {
          page = 'futureMatchInstructionView'
          tradeNature = '3'
        }

        this.$router.push({
          name: page,
          params: {
            type: 'view',
            tradeNature: tradeNature,
            uk: this.$refs.qmTable.currentRow.matchCode
          }
        })
      } else if (this.$refs.qmTable.currentRow.matchType === '4') {
        var strategyNature = this.$refs.qmTable.currentRow.strgLevel
        var page
        var tradeNature
        if (strategyNature === '4') {
          page = 'deliveryMatchStrategyView'
          tradeNature = '1'
        } else if (strategyNature === '3') {
          page = 'deliveryMatchPlanView'
          tradeNature = '2'
        } else if (strategyNature === '1' || strategyNature === '2') {
          page = 'deliveryMatchInstrView'
          tradeNature = '3'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'view',
            uk: this.$refs.qmTable.currentRow.matchCode,
            tradeNature: tradeNature
          }
        })
      }
    },
    futureDelivery() {
      this.addType = '2'
      this.typeDialogVisible = true
    }
  }
}
</script>
