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
  name: 'futuresSubAdjust',
  components: {},
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
            makeDateFrom: '',
            makeDateTo: '',
            approvalDateFrom: '',
            approvalDateTo: '',
            adjustType: '',
            derivativeAccount: '',
            documentStat: '',
            makeUserName: ''
          },
          defaultSortString: 'makeDate.desc'
        },
        formData: [
          {
            width: 100,
            label: 'derivative.futuresSubAdjust.documentStat',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'derivative.futuresSubAdjust.derivativeSubAccount',
            prop: 'derivativeSubAccount',
            element: 'base-select',
            width: 120,
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'derivative.futuresSubAdjust.makeDate',
            props: ['makeDateFrom', 'makeDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          },
          {
            type: 'date',
            label: 'derivative.futuresSubAdjust.approvalDate',
            props: ['approvalDateFrom', 'approvalDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          },
          {
            label: 'derivative.futuresSubAdjust.makeUserName',
            prop: 'makeUserName',
            element: 'base-select',
            width: 120,
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
          search: '/api/dvt/dvtFutureAdjRecord/listSub'
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
            name: 'submitAudit',
            permitName: ['audit'],
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return {
                row: this.$refs.qmTable.currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: this.$refs.qmTable.currentRow.id // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '子账号数据调整单: ' + this.$refs.qmTable.currentRow.documentNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
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
          id: 'spotExopsure',
          cols: [
            {
              prop: 'auditStatus',
              label: 'derivative.futuresSubAdjust.documentStat',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'documentNo',
              label: 'derivative.futuresSubAdjust.documentNo',
              width: '120'
            },
            {
              prop: 'derivativeSubAccount',
              width: '120',
              label: 'derivative.futuresSubAdjust.derivativeSubAccount'
            },
            {
              prop: 'makeDate',
              width: '100',
              label: 'derivative.futuresSubAdjust.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              align: 'center'
            },
            {
              prop: 'approvalDate',
              width: '100',
              label: 'derivative.futuresSubAdjust.approvalDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              align: 'center'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'derivative.futuresSubAdjust.makeUserName'
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
        name: 'futuresSubAdjustAdd',
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

      var currentRow = this.$refs.qmTable.currentRow

      // request({
      //   url: '/api/strategy/strgPlan/checkAudit',
      //   method: 'POST',
      //   data: {
      //     funcModule: this.$t('route.' + this.$route.meta.title),
      //     funcOperation: this.$t('biz.btn.remove'),
      //     data: currentRow.planCode
      //   }
      // }).then(request => {
      this.$router.push({
        name: 'futuresSubAdjustEdit',
        params: {
          type: 'view',
          uk: currentRow.id
        }
      })
      // })
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

      // request({
      //   url: '/api/strategy/strgPlan/checkAudit',
      //   method: 'POST',
      //   data: {
      //     funcModule: this.$t('route.' + this.$route.meta.title),
      //     funcOperation: this.$t('biz.btn.remove'),
      //     data: currentRow.planCode
      //   }
      // }).then(request => {
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/dvt/dvtFutureAdjRecord/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: {
              id: currentRow.id,
              versionNum: currentRow.versionNum
            }
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
      // })
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
        name: 'futuresSubAdjustView',
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.id
        }
      })
    }
  }
}
</script>
