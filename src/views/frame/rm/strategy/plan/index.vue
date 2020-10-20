<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <tradeTypeDialog v-if="typeDialogVisible" @close="dialogClose" @selectType="selectType"></tradeTypeDialog>
    <!-- <attachment></attachment> -->
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import tradeTypeDialog from '@/views/frame/rm/strategy/plan/tradeTypeDialog'

export default {
  name: 'planManage',
  components: {
    tradeTypeDialog
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
            planCode: '',
            strategyCode: '',
            createUser: '',
            deptCode: ''
          },
          defaultSortString: 'makeDate.desc'
        },
        formData: [
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
            type: 'date',
            label: 'strategy.plan.form.makeDate',
            prop: 'makeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'strategy.plan.form.strategyCode',
            prop: 'strategyCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.plan.form.strategyName',
            prop: 'strategyName',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true,
              params: {
                strgLevel: '1,3'
              }
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
          search: '/api/strategy/strgPlan/list'
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
            name: 'copy',
            i18n: '复制',
            type: 'route',
            permitName: ['copy'],
            iconName: '线性-复制',
            $refs: this.$refs,
            event: this.copy
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
                  value: this.$refs.qmTable.currentRow.planCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '计划: ' + this.$refs.qmTable.currentRow.planCode // 变量值
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
            name: 'cancelAudit',
            event: this.cancelAudit,
            iconName: '线性-退审',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.retrial')
          },
          {
            name: 'change',
            permitName: ['modify'],
            $refs: this.$refs,
            iconName: '线性-变更',
            i18n: this.$t('biz.btn.change'),
            event: this.change
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs
          },
          {
            name: 'createInstruction',
            event: this.createInstruction,
            iconName: '线性-新增',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.createInstruction')
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
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.plan.list.createDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'startDate',
              align: 'center',
              width: '100',
              label: 'strategy.plan.list.startDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              align: 'center',
              width: '100',
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
              prop: 'createUserName',
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
    createInstruction() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.planNotAudit')
          })
        )
        return
      }
      if (currentRow.strgLevel !== '1') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.levelNoInstr')
          })
        )
        return
      }

      this.$router.push({
        name: 'instructionAdd',
        params: {
          type: 'add',
          typeFlag: '0',
          planCode: currentRow.planCode
        }
      })
    },
    copy() {
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
        url: '/api/strategy/strgPlan/copyFlag',
        method: 'post',
        data: {
          data: {
            planCode: this.$refs.qmTable.currentRow.planCode
          },
          funcModule: '计划管理',
          funcOperation: '校验策略是否过期'
        }
      })
        .then(response => {
          var strategyNature = this.$refs.qmTable.currentRow.strategyNature
          var page
          if (strategyNature === '1') {
            page = 'futuresSpotHedgeAdd'
          } else if (strategyNature === '2') {
            page = 'futuresHedgeAdd'
          } else if (strategyNature === '3') {
            page = 'spotHedgeAdd'
          } else if (strategyNature === '4') {
            page = 'futuresSingleAdd'
          } else if (strategyNature === '5') {
            page = 'spotSingleAdd'
          } else if (strategyNature === '6') {
            page = 'otherAdd'
          }

          this.$router.push({
            name: page,
            params: {
              type: 'copy',
              planType: strategyNature,
              uk: this.$refs.qmTable.currentRow.planCode,
              planCode: this.$refs.qmTable.currentRow.planCode
            }
          })
        })
        .catch(() => { })
    },
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

      var currentRow = this.$refs.qmTable.currentRow

      request({
        url: '/api/strategy/strgPlan/checkAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: currentRow.planCode
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
            type: 'update',
            planType: strategyNature,
            uk: this.$refs.qmTable.currentRow.planCode,
            planCode: this.$refs.qmTable.currentRow.planCode,
            auditCloseFlag: request.data
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
        url: '/api/strategy/strgPlan/checkAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: currentRow.planCode
        }
      }).then(res => {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }).then(() => {
          request({
            url: '/api/strategy/strgPlan/remove',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.remove'),
              data: currentRow.planCode
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
          type: 'view',
          planType: strategyNature,
          uk: this.$refs.qmTable.currentRow.planCode,
          moduleCode: this.$route.meta.bpmModule,
          row: this.$refs.qmTable.currentRow
        }
      })
    },
    cancelAudit() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (this.$refs.qmTable.currentRow.auditStatus !== '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.planNotAudit')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmCancelAudit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategy/strgPlan/cancelAudit',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: currentRow.planCode
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.cancelAuditSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    change() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (this.$refs.qmTable.currentRow.auditStatus !== '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.changeNotAudit')
          })
        )
        return
      }

      request({
        url: '/api/strategy/strgPlan/isChange',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: this.$refs.qmTable.currentRow.planCode
        }
      }).then(request => {
        if (request.data) {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.isChange')
            })
          )
          return
        }

        var strategyNature = this.$refs.qmTable.currentRow.strategyNature
        var page
        if (strategyNature === '1') {
          page = 'futuresSpotHedgeChange'
        } else if (strategyNature === '2') {
          page = 'futuresHedgeChange'
        } else if (strategyNature === '3') {
          page = 'spotHedgeChange'
        } else if (strategyNature === '4') {
          page = 'futuresSingleChange'
        } else if (strategyNature === '5') {
          page = 'spotSingleChange'
        } else if (strategyNature === '6') {
          page = 'otherChange'
        }

        this.$router.push({
          name: page,
          params: {
            type: 'change',
            planType: strategyNature,
            uk: this.$refs.qmTable.currentRow.planCode,
            planCode: this.$refs.qmTable.currentRow.planCode
          }
        })
      })
    }
  }
}
</script>
