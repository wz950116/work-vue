<template>
  <qm-table ref="qmTable" :mainData="mainData"></qm-table>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  name: 'futuresCost',
  components: {},
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            preliminaryFlag: '1',
            auditStatus: '3'
          },
          defaultSortString: 'documentDate.desc'
        }
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/spot/futureCost/list'
        },
        isColset: true,
        isTopBar: true,
        table: {
          id: 'cost',
          cols: [
            {
              width: '80',
              prop: 'auditStatus',
              label: 'spotProj.cost.list.documentStat',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'organName',
              label: 'spotProj.cost.list.organName',
              width: '100'
            },
            {
              prop: 'deptName',
              label: 'spotProj.cost.list.deptName',
              width: '100'
            },
            {
              prop: 'documentNo',
              label: 'spotProj.cost.list.documentNo',
              width: '120'
            },
            {
              prop: 'documentDate',
              label: 'spotProj.cost.list.documentDate',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'originalCurrencyName',
              align: 'center',
              width: '120',
              label: 'spotProj.cost.list.originalCurrencyName'
            },
            {
              prop: 'originalCurrencyAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.cost.list.originalCurrencyAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'exchangeRate',
              align: 'right',
              width: '100',
              label: 'spotProj.cost.list.exchangeRate'
            },
            {
              prop: 'domesticCurrencyAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.cost.list.domesticCurrencyAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'matchAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.cost.list.matchAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'unmatchAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.cost.list.unmatchAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'projectName',
              width: '100',
              label: 'spotProj.cost.list.projectCode'
            },
            {
              prop: 'derivativeAccount',
              width: '120',
              label: 'spotProj.cost.list.derivativeAccount'
            },
            {
              prop: 'strategyName',
              width: '150',
              label: 'spotProj.cost.list.strategyName'
            },
            {
              prop: 'preliminaryFlag',
              align: 'center',
              width: '80',
              label: 'spotProj.cost.list.preliminaryFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'remark',
              width: '160',
              label: 'spotProj.cost.list.remark'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'spotProj.cost.list.makeUserName'
            },
            {
              prop: 'makeDt',
              label: 'spotProj.cost.list.makeDt',
              align: 'center',
              width: '160'
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
    update() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      request({
        url: '/api/spot/futureCost/isAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: currentRow.documentNo
        }
      }).then(request => {
        this.$router.push({
          name: 'futuresCostEdit',
          params: {
            type: 'update',
            uk: currentRow.documentNo
          }
        })
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
          url: '/api/spot/futureCost/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: currentRow.documentNo
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
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$router.push({
        name: 'futuresCostView',
        params: {
          type: 'view',
          uk: currentRow.documentNo
        }
      })
    }
  }
}
</script>
