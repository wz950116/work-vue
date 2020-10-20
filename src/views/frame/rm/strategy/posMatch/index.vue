<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <matchTypeDialog v-if="typeDialogVisible" @close="dialogClose" @selectType="selectType"></matchTypeDialog>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import matchTypeDialog from '@/views/frame/rm/strategy/posMatch/matchType'

export default {
  name: 'posMatch',
  components: {
    matchTypeDialog
  },
  data() {
    return {
      typeDialogVisible: false,
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
            makeUser: '',
            strgLevelS: ['1', '2']
          },
          defaultSortString: 'makeDate.desc, matchCode.desc'
        },
        formData: [
          {
            width: 180,
            label: 'strategy.posMatch.form.instructionName',
            prop: 'instructionCode',
            element: 'base-select',
            attrs: {
              data: 'INSTRUCTION',
              clearable: true
            }
          },
          {
            width: 120,
            type: 'date',
            label: 'strategy.posMatch.form.makeDate',
            prop: 'makeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.posMatch.form.makeUser',
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
          search: '/api/strategy/posMatch/list'
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
          id: 'posMatch',
          cols: [
            {
              prop: 'instructionName',
              label: 'strategy.posMatch.list.instructionName',
              width: '150'
            },
            {
              prop: 'matchCode',
              width: '150',
              label: 'strategy.posMatch.list.matchCode'
            },
            {
              prop: 'planCode',
              width: '150',
              label: 'strategy.posMatch.list.planCode'
            },
            {
              prop: 'planName',
              width: '150',
              label: 'strategy.posMatch.list.planName'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'strategy.posMatch.list.makeUser'
            },
            {
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.posMatch.list.makeDate',
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
      this.typeDialogVisible = true
    },
    dialogClose() {
      this.typeDialogVisible = false
    },
    selectType(type) {
      this.typeDialogVisible = false
      this.$router.push({
        name: 'posMatchAdd',
        params: {
          type: 'add',
          matchNature: type
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
        name: 'posMatchEdit',
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
          url: '/api/strategy/posMatch/remove',
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
        name: 'posMatchView',
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    }
  }
}
</script>
