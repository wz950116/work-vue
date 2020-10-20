<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>
<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'strategyChange',
  components: {},
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
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
            optEmployeeCode: ''
          },
          defaultSortString: 'makeDate.desc,strategyNature.asc'
        },
        formData: [
          {
            label: 'strategy.strategyManagement.form.changeNo',
            prop: 'changeNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
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
              clearable: true
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
          search: '/api/strg/strgStrategyChg/page',
          doDelete: '/api/strg/strgStrategyChg/remove'
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
            name: 'submitAudit',
            permitName: ['submitAudit'],
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
                  value: '策略变更: ' + this.$refs.qmTable.currentRow.changeNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            permitName: ['withdrawAudit'],
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
            name: 'auditHistory',
            permitName: ['auditHistory'],
            type: 'dialog',
            $refs: this.$refs,
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.changeNo // 变量值
              }
            }
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs,
            validate() {}
          }
        ],

        isColset: true,
        table: {
          id: 'strategyChange',
          cols: [
            {
              label: 'strategy.strategyManagement.list.changeNo',
              prop: 'changeNo',
              width: '150'
            },
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
              label: 'strategy.strategyManagement.list.originalData',
              prop: 'originFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
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
    remove() {
      if (this.$refs.qmTable.currentRow) {
        if (this.$refs.qmTable.currentRow.auditStatus !== '2' && this.$refs.qmTable.currentRow.auditStatus !== '3') {
          this.$confirm('是否确定删除', this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              request({
                url: '/api/strg/strgStrategyChg/remove',
                method: 'post',
                data: {
                  data: this.$refs.qmTable.currentRow.changeNo,
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
        } else {
          Notification(
            notifyInfo({
              msg: '只能删除审批状态为草拟或拒绝的策略'
            })
          )
        }
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
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
      var strategyNature = this.$refs.qmTable.currentRow.strategyNature
      var page
      if (strategyNature === '1') {
        page = 'hedgingChangeView'
      } else if (strategyNature === '2') {
        page = 'futuresArbitrageChangeView'
      } else if (strategyNature === '3') {
        page = 'spotArbitrageChangeView'
      } else if (strategyNature === '4') {
        page = 'futuresUnilateralChangeView'
      } else if (strategyNature === '5') {
        page = 'spotUnilateralChangeView'
      } else if (strategyNature === '6') {
        page = 'otherChangeView'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.changeNo,
          flag: '0',
          row: this.$refs.qmTable.currentRow
        }
      })
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
      if (['2', '3'].includes(this.$refs.qmTable.currentRow.auditStatus)) {
        Notification(
          notifyInfo({
            msg: '只有草拟和拒绝的策略才能被修改'
          })
        )
        return
      }
      var strategyNature = this.$refs.qmTable.currentRow.strategyNature
      var page
      if (strategyNature === '1') {
        page = 'hedgingChangeUpdate'
      } else if (strategyNature === '2') {
        page = 'futuresArbitrageChangeUpdate'
      } else if (strategyNature === '3') {
        page = 'spotArbitrageChangeUpdate'
      } else if (strategyNature === '4') {
        page = 'futuresUnilateralChangeUpdate'
      } else if (strategyNature === '5') {
        page = 'spotUnilateralChangeUpdate'
      } else if (strategyNature === '6') {
        page = 'otherChangeUpdate'
      }
      this.$router.push({
        name: page,
        params: {
          type: 'update',
          uk: this.$refs.qmTable.currentRow.changeNo,
          flag: '0',
          row: this.$refs.qmTable.currentRow
        }
      })
    }
  }
}
</script>
