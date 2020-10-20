<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <strategyTypeDialog v-if="typeDialogVisible" @close="dialogClose" @selectType="selectType"></strategyTypeDialog>
  </div>
</template>
<script>
import strategyTypeDialog from '@/views/frame/rm/strategy/strategyManagement/strategyType'
import request from '@/utils/frame/base/request'
import { Notification } from 'element-ui'
// 提醒
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'strategyManagement',
  components: {
    strategyTypeDialog
  },
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      typeDialogVisible: false,
      opButton: '',
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            strategyName: '',
            strategyCode: '',
            strategyNature: '',
            purpose: '',
            deptCode: '',
            projectCode: '',
            applicant: '',
            makeDate: '',
            optEmployeeCode: '',
            startDate: '',
            endDate: ''
          },
          defaultSortString: 'makeDate.desc,strategyNature.asc'
        },
        formData: [
          {
            label: 'strategy.strategyManagement.form.strategyName',
            prop: 'strategyName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.strategyManagement.form.strategyCode',
            prop: 'strategyCode',
            element: 'input-validate',
            width: 180,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.strategyManagement.form.strategyNature',
            prop: 'strategyNature',
            element: 'base-select',
            list: this.$t('datadict.strategyNature'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.strategyManagement.form.purpose',
            prop: 'purpose',
            element: 'base-select',
            attrs: {
              data: 'DD_TYPE',
              clearable: true
            }
          },
          {
            label: 'strategy.strategyManagement.form.deptCode',
            prop: 'deptCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_DEPT',
              clearable: true
            }
          },
          {
            label: 'strategy.strategyManagement.form.projectCode',
            prop: 'projectCode',
            element: 'base-select',
            attrs: {
              data: 'PROJECT',
              clearable: true,
              params: {
                auditStatus: '3'
              }
            }
          },
          {
            label: 'strategy.strategyManagement.form.applicant',
            prop: 'applicant',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'strategy.strategyManagement.form.makeDate',
            props: ['startDate', 'endDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          },
          {
            label: 'strategy.strategyManagement.form.optEmployeeCode',
            prop: 'optEmployeeCode',
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
          search: '/api/strg/strategy/page',
          doDelete: '/api/strg/strategy/remove'
        },
        apiData: {
          search(param) {
            return param.id
          },
          doDelete(param) {
            return param.strategyCode
          }
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
            event: this.update
          },

          {
            name: 'remove',
            type: 'dialog',
            event: this.remove
          },
          {
            name: 'view',
            type: 'route',
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
                  value: this.$refs.qmTable.currentRow.strategyCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '策略: ' + this.$refs.qmTable.currentRow.strategyCode // 变量值
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
                uk: currentRow.strategyCode,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'optimize',
            permitName: ['optimization'],
            iconName: '线性-标记',
            i18n: '优化策略',
            type: 'route',
            event: this.optimize
          },
          {
            name: 'change',
            permitName: ['modify'],
            iconName: '线性-变更',
            i18n: '变更',
            type: 'route',
            event: this.change
          },
          {
            name: 'stop',
            iconName: '线性-变更',
            i18n: '终止',
            type: 'route',
            event: this.stop
          },
          {
            name: 'close',
            iconName: '线性-变更',
            i18n: '关闭',
            type: 'route',
            event: this.close
          },
          {
            name: 'cancelClose',
            iconName: '线性-变更',
            i18n: '取消关闭',
            type: 'route',
            event: this.cancelClose
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs,
            validate() {}
          },
          {
            name: 'cancelAudit',
            event: this.cancelAudit,
            iconName: '线性-退审',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.retrial')
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            $refs: this.$refs,
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.strategyCode // 变量值
              }
            }
          },
          {
            name: 'createPlan',
            event: this.createPlan,
            iconName: '线性-新增',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.createPlan')
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
          id: 'strategyManagement',
          cols: [
            {
              label: 'strategy.strategyManagement.list.auditStat',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              },
              width: '80'
            },
            {
              label: 'strategy.strategyManagement.list.strategyType',
              prop: 'isOptimizeFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.strategyType')
              },
              width: '80'
            },
            {
              label: 'strategy.strategyManagement.list.organName',
              prop: 'organName',
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.deptName',
              prop: 'deptName',
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.strategyName',
              prop: 'strategyName',
              width: '150'
            },
            {
              label: 'strategy.strategyManagement.list.strategyCode',
              prop: 'strategyCode',
              width: '150'
            },
            {
              label: 'strategy.strategyManagement.list.strategyNature',
              prop: 'strategyNature',
              align: 'center',
              format: {
                dict: this.$t('datadict.strategyNature')
              },
              width: '80'
            },
            {
              label: 'strategy.strategyManagement.list.purpose',
              prop: 'typeName',
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.maxFund',
              prop: 'maxFund',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.limitLoss',
              prop: 'limitLoss',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.expectProfit',
              prop: 'expectProfit',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.riskProfitRatio',
              prop: 'riskProfitRatio',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.expectReturnRatio',
              prop: 'expectReturnRatio',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.projectName',
              prop: 'projectName',
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.strgLevel',
              prop: 'strgLevel',
              align: 'center',
              format: {
                dict: this.$t('datadict.strgLevel')
              },
              attrs: {
                clearable: true
              },
              width: '110'
            },
            {
              label: 'strategy.strategyManagement.list.makeDate',
              prop: 'makeDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.startDate',
              prop: 'startDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.endDate',
              prop: 'endDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: '100'
            },
            {
              label: 'strategy.strategyManagement.list.applicantName',
              prop: 'applicantName',
              width: '80'
            },
            {
              label: 'strategy.strategyManagement.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '80'
            },
            // {
            //   label: 'strategy.strategyManagement.list.stopStat',
            //   prop: 'stopStat',
            //   align: 'center',
            //   width: '80',
            //   format: {
            //     dict: this.$t('datadict.yesNo')
            //   }
            // },
            {
              label: 'strategy.strategyManagement.list.closeStat',
              prop: 'closeStat',
              align: 'center',
              width: '80',
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
    createPlan() {
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
            msg: this.$t('strategy.strategyManagement.msg.strategyNotAudit')
          })
        )
        return
      }
      if (currentRow.isOptimizeFlag === '2') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.optimizeNotUse')
          })
        )
        return
      }

      if (currentRow.strgLevel === '2' || currentRow.strgLevel === '4') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.levelNoPlan')
          })
        )
        return
      }

      let page = ''
      let value = currentRow.strategyNature
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
          planType: value,
          strategyCode: currentRow.strategyCode
        }
      })
    },
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
            msg: this.$t('strategy.strategyManagement.msg.strategyNotAudit')
          })
        )
        return
      }
      if (currentRow.isOptimizeFlag === '2') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.optimizeNotUse')
          })
        )
        return
      }

      if (currentRow.strgLevel !== '2') {
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
          typeFlag: '1',
          strategyCode: currentRow.strategyCode
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
      if (currentRow.isOptimizeFlag === '2') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.strategyManagement.msg.optimizeNotUse')
          })
        )
        return
      }
      var strategyNature = currentRow.strategyNature
      var page
      if (strategyNature === '1') {
        page = 'hedgingStrategyAdd'
      } else if (strategyNature === '2') {
        page = 'futuresArbitrageAdd'
      } else if (strategyNature === '3') {
        page = 'spotArbitrageAdd'
      } else if (strategyNature === '4') {
        page = 'futuresUnilateralAdd'
      } else if (strategyNature === '5') {
        page = 'spotUnilateralAdd'
      } else if (strategyNature === '6') {
        page = 'otherStrategyAdd'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'copy',
          uk: this.$refs.qmTable.currentRow.strategyCode,
          row: this.$refs.qmTable.currentRow
        }
      })
    },
    remove() {
      if (this.$refs.qmTable.currentRow) {
        request({
          url: '/api/strg/strategy/checkRemove',
          method: 'post',
          data: {
            data: this.$refs.qmTable.currentRow.strategyCode,
            funcModule: '策略管理',
            funcOperation: '删除'
          }
        })
          .then(response => {
            this.remove1()
          })
          .catch(() => {})
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    remove1() {
      this.$confirm('是否确定删除', this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          request({
            url: '/api/strg/strategy/remove',
            method: 'post',
            data: {
              data: this.$refs.qmTable.currentRow.strategyCode,
              funcModule: '策略管理',
              funcOperation: '删除'
            }
          })
            .then(response => {
              Notification(
                notifySuccess({
                  msg: '删除成功'
                })
              )
              this.$refs.qmTable.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    add() {
      this.typeDialogVisible = true
      this.opButton = 'add'
    },
    view() {
      if (this.$refs.qmTable.currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (!this.$refs.qmTable.currentRow.parentStrategyCode) {
        var strategyNature = this.$refs.qmTable.currentRow.strategyNature
        var page
        if (strategyNature === '1') {
          page = 'hedgingStrategyView'
        } else if (strategyNature === '2') {
          page = 'futuresArbitrageView'
        } else if (strategyNature === '3') {
          page = 'spotArbitrageView'
        } else if (strategyNature === '4') {
          page = 'futuresUnilateralView'
        } else if (strategyNature === '5') {
          page = 'spotUnilateralView'
        } else if (strategyNature === '6') {
          page = 'otherStrategyView'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'view',
            uk: this.$refs.qmTable.currentRow.strategyCode,
            row: this.$refs.qmTable.currentRow
          }
        })
      } else {
        this.$router.push({
          name: 'optimizationStrategyView',
          params: {
            type: 'view',
            uk: this.$refs.qmTable.currentRow.strategyCode,
            row: this.$refs.qmTable.currentRow,
            strategyType: this.$refs.qmTable.currentRow.strategyNature,
            parentStrategyCode: this.$refs.qmTable.currentRow.parentStrategyCode
          }
        })
      }
    },
    update() {
      if (this.$refs.qmTable.currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      request({
        url: '/api/strg/strategy/checkUpdate',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.update'),
          data: this.$refs.qmTable.currentRow,
          uk: this.$refs.qmTable.currentRow.strategyCode
        }
      }).then(request => {
        this.update1()
      })
    },
    update1() {
      if (!this.$refs.qmTable.currentRow.parentStrategyCode) {
        var strategyNature = this.$refs.qmTable.currentRow.strategyNature
        var page
        if (strategyNature === '1') {
          page = 'hedgingStrategyUpdate'
        } else if (strategyNature === '2') {
          page = 'futuresArbitrageUpdate'
        } else if (strategyNature === '3') {
          page = 'spotArbitrageUpdate'
        } else if (strategyNature === '4') {
          page = 'futuresUnilateralUpdate'
        } else if (strategyNature === '5') {
          page = 'spotUnilateralUpdate'
        } else if (strategyNature === '6') {
          page = 'otherStrategyUpdate'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'update',
            uk: this.$refs.qmTable.currentRow.strategyCode,
            row: this.$refs.qmTable.currentRow
          }
        })
      } else {
        this.$router.push({
          name: 'optimizationStrategyUpdate',
          params: {
            type: 'update',
            uk: this.$refs.qmTable.currentRow.strategyCode,
            strategyType: this.$refs.qmTable.currentRow.strategyNature,
            strategyTypeParent: this.$refs.qmTable.currentRow.strategyTypeParent,
            parentStrategyCode: this.$refs.qmTable.currentRow.parentStrategyCode,
            row: this.$refs.qmTable.currentRow
          }
        })
      }
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
            msg: '只有审批状态为同意的数据才能被退审'
          })
        )
        return
      }
      request({
        url: '/api/strg/strategy/checkCancelAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.cancelAudit'),
          data: currentRow.strategyCode
        }
      }).then(request => {
        this.cancelAudit1(currentRow)
      })
    },
    cancelAudit1(currentRow) {
      this.$confirm(this.$t('biz.msg.confirmCancelAudit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strg/strategy/cancelAudit',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.cancelAudit'),
            data: currentRow.strategyCode
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
    dialogClose() {
      this.typeDialogVisible = false
      this.$refs.qmTable.getList()
    },
    selectType(value) {
      this.typeDialogVisible = false
      if (this.opButton === 'add') {
        var page
        if (value === '1') {
          page = 'hedgingStrategyAdd'
        } else if (value === '2') {
          page = 'futuresArbitrageAdd'
        } else if (value === '3') {
          page = 'spotArbitrageAdd'
        } else if (value === '4') {
          page = 'futuresUnilateralAdd'
        } else if (value === '5') {
          page = 'spotUnilateralAdd'
        } else if (value === '6') {
          page = 'otherStrategyAdd'
        }
        this.$router.push({
          name: page,
          params: {
            type: 'add',
            strategyType: value
          }
        })
      }
      if (this.opButton === 'optimize') {
        if (this.$refs.qmTable.currentRow.parentStrategyCode) {
          this.$router.push({
            name: 'optimizationStrategyAdd',
            params: {
              type: 'add',
              uk: this.$refs.qmTable.currentRow.strategyCode,
              strategyType: value,
              strategyTypeParent: this.$refs.qmTable.currentRow.strategyNature,
              parentStrategyCode: this.$refs.qmTable.currentRow.parentStrategyCode,
              parentFlag: true
            }
          })
        } else {
          this.$router.push({
            name: 'optimizationStrategyAdd',
            params: {
              type: 'add',
              uk: this.$refs.qmTable.currentRow.strategyCode,
              strategyType: value,
              strategyTypeParent: this.$refs.qmTable.currentRow.strategyNature,
              parentStrategyCode: this.$refs.qmTable.currentRow.parentStrategyCode,
              parentFlag: false
            }
          })
        }
      }
    },
    optimize() {
      if (this.$refs.qmTable.currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (['3', '5'].includes(this.$refs.qmTable.currentRow.strategyNature)) {
        Notification(
          notifyInfo({
            msg: '只有策略类型为：套期,期货单边,期货套利的数据才能优化'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.auditStatus !== '3') {
        Notification(
          notifyInfo({
            msg: '只有审批通过的策略才能被优化'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.closeStat === '1') {
        Notification(
          notifyInfo({
            msg: '策略已经关闭，无法进行优化操作'
          })
        )
        return
      }
      // if (this.$refs.qmTable.currentRow.stopStat === '1') {
      //   Notification(
      //     notifyInfo({
      //       msg: '策略已经终止，无法进行变更操作'
      //     })
      //   )
      //   return
      // }
      if (this.$refs.qmTable.currentRow.optimizedFlag > 0) {
        Notification(
          notifyInfo({
            msg: '此策略已经被优化，请选择其他策略优化'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.changeFlag && this.$refs.qmTable.currentRow.changeFlag !== '0') {
        Notification(
          notifyInfo({
            msg: '此策略的变更策略未审批成功，请先审批成功在进行优化'
          })
        )
        return
      }
      this.typeDialogVisible = true
      this.opButton = 'optimize'
    },
    change() {
      if (this.$refs.qmTable.currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.auditStatus !== '3') {
        Notification(
          notifyInfo({
            msg: '只有审批通过的策略才能被变更'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.closeStat === '1') {
        Notification(
          notifyInfo({
            msg: '策略已经关闭，无法进行变更操作'
          })
        )
        return
      }
      // if (this.$refs.qmTable.currentRow.stopStat === '1') {
      //   Notification(
      //     notifyInfo({
      //       msg: '策略已经终止，无法进行变更操作'
      //     })
      //   )
      //   return
      // }
      if (this.$refs.qmTable.currentRow.optimizedFlag > 0) {
        Notification(
          notifyInfo({
            msg: '此策略已经被优化，请选择其他策略变更'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.changeFlag && this.$refs.qmTable.currentRow.changeFlag !== '0') {
        Notification(
          notifyInfo({
            msg: '此策略的变更策略未审批成功，请先审批成功在进行变更'
          })
        )
        return
      }
      var strategyNature = this.$refs.qmTable.currentRow.strategyNature
      var page
      if (strategyNature === '1') {
        page = 'hedgingChangeAdd'
      } else if (strategyNature === '2') {
        page = 'futuresArbitrageChangeAdd'
      } else if (strategyNature === '3') {
        page = 'spotArbitrageChangeAdd'
      } else if (strategyNature === '4') {
        page = 'futuresUnilateralChangeAdd'
      } else if (strategyNature === '5') {
        page = 'spotUnilateralChangeAdd'
      } else if (strategyNature === '6') {
        page = 'otherChangeAdd'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'add',
          uk: this.$refs.qmTable.currentRow.strategyCode,
          flag: '1'
        }
      })
    },
    stop() {
      var currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (currentRow.auditStatus !== '3') {
        Notification(
          notifyInfo({
            msg: '只有审批通过的策略才能被终止'
          })
        )
        return
      }
      // if (currentRow.stopStat === '1') {
      //   Notification(
      //     notifyInfo({
      //       msg: '策略已经终止，无法进行终止操作'
      //     })
      //   )
      //   return
      // }
      if (currentRow.closeStat === '1') {
        Notification(
          notifyInfo({
            msg: '策略已经关闭，无法进行终止操作'
          })
        )
        return
      }
      this.$confirm(this.$t('biz.msg.confirmFinish'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strg/strategy/stop',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.stop'),
            data: currentRow.strategyCode
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.finishSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    close() {
      var currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (currentRow.auditStatus !== '3') {
        Notification(
          notifyInfo({
            msg: '只有审批通过的策略才能被关闭'
          })
        )
        return
      }
      if (currentRow.closeStat === '1') {
        Notification(
          notifyInfo({
            msg: '策略已经关闭，无法进行关闭操作'
          })
        )
        return
      }
      this.$confirm(this.$t('biz.msg.confirmClose'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strg/strategy/close',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.stop'),
            data: currentRow.strategyCode
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.closeSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    cancelClose() {
      var currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (currentRow.closeStat === '0') {
        Notification(
          notifyInfo({
            msg: '策略未关闭，无法进行取消关闭操作'
          })
        )
        return
      }
      this.$confirm(this.$t('biz.msg.confirmCancelClose'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strg/strategy/cancelClose',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.stop'),
            data: currentRow.strategyCode
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.cancelCloseSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    }
  }
}
</script>
