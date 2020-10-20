<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  name: 'spotOpt',
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
            strategyCode: '',
            makeDate: '',
            makeUser: ''
          },
          defaultSortString: 'makeDate.desc,matchCode.desc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.spotOpt.form.strategyCode',
            prop: 'strategyCode',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true
            }
          },
          {
            width: 120,
            type: 'date',
            label: 'strategy.spotOpt.form.makeDate',
            prop: 'makeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.spotOpt.form.makeUser',
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
          search: '/api/strategy/strgSpotOpt/list'
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
          id: 'spotOPt',
          cols: [
            {
              prop: 'strategyName',
              label: 'strategy.spotOpt.list.strategyName',
              width: '150'
            },
            {
              prop: 'strategyCode',
              width: '150',
              label: 'strategy.spotOpt.list.strategyCode'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'strategy.spotOpt.list.makeUserName'
            },
            {
              prop: 'matchCode',
              width: '150',
              label: 'strategy.spotOpt.list.matchCode'
            },
            {
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.spotOpt.list.makeDate',
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
      this.$router.push({
        name: 'spotOptAdd',
        params: {
          type: 'add'
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

      this.$router.push({
        name: 'spotOptEdit',
        params: {
          type: 'update',
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
          url: '/api/strategy/strgSpotOpt/remove',
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

      this.$router.push({
        name: 'spotOptView',
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    }
  }
}
</script>
