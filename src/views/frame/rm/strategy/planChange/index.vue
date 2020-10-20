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
  name: 'planChange',
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
            planCode: '',
            strategyCode: '',
            strategyName: '',
            createUser: '',
            deptCode: '',
            changeDate: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'changeDate.desc,changeNo.desc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.plan.form.changeNo',
            prop: 'changeNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.plan.form.planName',
            prop: 'planName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.plan.form.planCode',
            prop: 'planCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.plan.form.strategyCode',
            prop: 'strategyCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.plan.form.strategyName',
            prop: 'strategyName',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true
            }
          },
          {
            width: 100,
            type: 'date',
            label: 'strategy.plan.form.changeDate',
            prop: 'changeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.plan.form.createUser',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          },
          {
            label: 'strategy.plan.form.deptCode',
            prop: 'deptCode',
            element: 'base-select',
            width: 120,
            attrs: {
              data: 'TREE_DEPT',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/strategy/strgPlanChg/list'
        },
        isTopBar: true,
        topBar: [
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
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return {
                row: this.$refs.qmTable.currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: this.$refs.qmTable.currentRow.changeNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '计划变更: ' + this.$refs.qmTable.currentRow.changeNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.changeNo,
                moduleCode: this.moduleCode
              }
            }
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
              label: 'strategy.plan.list.auditStat',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'changeNo',
              label: 'strategy.plan.list.changeNo',
              width: '150'
            },
            {
              prop: 'deptName',
              label: 'strategy.plan.list.deptName',
              width: '100'
            },
            {
              prop: 'planName',
              width: '150',
              label: 'strategy.plan.list.planName'
            },
            {
              prop: 'planCode',
              width: '150',
              label: 'strategy.plan.list.planCode'
            },
            {
              prop: 'strategyCode',
              width: '150',
              label: 'strategy.plan.list.strategyCode'
            },
            {
              prop: 'strategyName',
              width: '150',
              label: 'strategy.plan.list.strategyName'
            },
            {
              prop: 'changeDate',
              align: 'center',
              width: '100',
              label: 'strategy.plan.list.changeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'startDate',
              width: '100',
              align: 'center',
              label: 'strategy.plan.list.startDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              width: '100',
              align: 'center',
              label: 'strategy.plan.list.endDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'applicantName',
              width: '80',
              label: 'strategy.plan.list.applicantName'
            },
            {
              prop: 'changeUserName',
              width: '80',
              label: 'strategy.plan.list.createUserName'
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
    selectType(value) {
      this.typeDialogVisible = false

      var page
      if (value === '1') {
        page = 'futuresSpotHedgeAdd'
      } else if (value === '2') {
        page = 'futuresHedgeAdd'
      } else if (value === '3') {
        page = 'spotHedgeAdd'
      } else if (value === '4') {
        page = 'futuresSingleAdd'
      } else if (value === '5') {
        page = 'spotSingleAdd'
      } else if (value === '6') {
        page = 'otherAdd'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'add',
          planType: value
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

      request({
        url: '/api/strategy/strgPlanChg/checkAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: this.$refs.qmTable.currentRow.changeNo
        }
      }).then(request => {
        var strategyNature = this.$refs.qmTable.currentRow.strategyNature
        var page
        if (strategyNature === '1') {
          page = 'futuresSpotHedgeEdit'
        } else if (strategyNature === '2') {
          page = 'futuresHedgeEdit'
        } else if (strategyNature === '3') {
          page = 'spotHedgeEdit'
        } else if (strategyNature === '4') {
          page = 'futuresSingleEdit'
        } else if (strategyNature === '5') {
          page = 'spotSingleEdit'
        } else if (strategyNature === '6') {
          page = 'otherEdit'
        }

        this.$router.push({
          name: page,
          params: {
            type: 'changeUpdate',
            planType: strategyNature,
            uk: this.$refs.qmTable.currentRow.changeNo,
            planCode: this.$refs.qmTable.currentRow.planCode
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

      request({
        url: '/api/strategy/strgPlanChg/checkAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: currentRow.changeNo
        }
      }).then(res => {
        this.$confirm(this.$t('biz.msg.confirmSubmitAudit'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }).then(() => {
          request({
            url: '/api/strategy/strgPlanChg/remove',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.remove'),
              data: currentRow.changeNo
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

      var strategyNature = this.$refs.qmTable.currentRow.strategyNature
      var page
      if (strategyNature === '1') {
        page = 'futuresSpotHedgeView'
      } else if (strategyNature === '2') {
        page = 'futuresHedgeView'
      } else if (strategyNature === '3') {
        page = 'spotHedgeView'
      } else if (strategyNature === '4') {
        page = 'futuresSingleView'
      } else if (strategyNature === '5') {
        page = 'spotSingleView'
      } else if (strategyNature === '6') {
        page = 'otherView'
      }

      this.$router.push({
        name: page,
        params: {
          type: 'changeView',
          planType: strategyNature,
          uk: this.$refs.qmTable.currentRow.changeNo,
          planCode: this.$refs.qmTable.currentRow.planCode,
          moduleCode: this.$route.meta.bpmModule,
          row: this.$refs.qmTable.currentRow
        }
      })
    }
  }
}
</script>
