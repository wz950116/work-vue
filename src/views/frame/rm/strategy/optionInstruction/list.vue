<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <instructionTypeDialog v-if="typeDialogVisible" @close="dialogClose" @selectType="selectType"></instructionTypeDialog>
  </div>
</template>
<script>
import instructionTypeDialog from '@/views/frame/rm/strategy/instruction/instructionType'
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'optionInstruction',
  components: {
    instructionTypeDialog
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
          data: { virtualFlag: '0' },
          defaultSortString: 'startDate.desc'
        },
        formData: [
          {
            label: 'strategy.optionInstruction.form.instructionName',
            prop: 'instructionName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.optionInstruction.form.instructionCode',
            prop: 'instructionCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.optionInstruction.form.strategyName',
            prop: 'strategyCode',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true,
              params: {
                auditStatus: '3',
                strgLevel: '2',
                strategyNature: '1,2,4,6'
              }
            }
          },
          {
            label: 'strategy.optionInstruction.form.planName',
            prop: 'planCode',
            element: 'base-select',
            attrs: {
              data: 'PLAN',
              clearable: true,
              params: {
                auditStatus: '3',
                strgLevel: '1',
                strategyNature: '1,2,4,6'
              }
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/strategy/strgOptInstruction/page',
          doDelete: '/api/strategy/strgOptInstruction/remove'
        },
        apiData: {
          search(param) {
            return param.id
          },
          doDelete(param) {
            return param.instructionCode
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
                  value: this.$refs.qmTable.currentRow.instructionCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '指令: ' + this.$refs.qmTable.currentRow.instructionCode // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'cancelAudit',
            event: this.cancelAudit,
            iconName: '线性-退审',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.retrial')
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
                uk: currentRow.instructionCode,
                moduleCode: this.moduleCode
              }
            }
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
                uk: currentRow.instructionCode // 变量值
              }
            }
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs,
            validate() { }
          }
        ],

        isColset: true,
        table: {
          id: 'instructionManagement',
          cols: [
            {
              label: 'strategy.optionInstruction.list.auditStatus',
              prop: 'auditStatus',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'strategy.optionInstruction.list.organName',
              prop: 'organName',
              width: '100'
            },
            {
              label: 'strategy.optionInstruction.list.deptName',
              prop: 'deptName',
              width: '100'
            },
            {
              label: 'strategy.optionInstruction.list.instructionName',
              prop: 'instructionName',
              width: '150'
            },
            {
              label: 'strategy.optionInstruction.list.instructionCode',
              prop: 'instructionCode',
              width: '150'
            },
            {
              label: 'strategy.optionInstruction.list.planName',
              prop: 'planName',
              width: '150'
            },
            {
              label: 'strategy.optionInstruction.list.planCode',
              prop: 'planCode',
              width: '150'
            },
            {
              label: 'strategy.optionInstruction.list.startDate',
              prop: 'startDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'strategy.optionInstruction.list.endDate',
              prop: 'endDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'strategy.optionInstruction.list.orderName',
              prop: 'orderName',
              width: '80'
            },
            {
              label: 'strategy.optionInstruction.list.traderName',
              prop: 'traderName',
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
        url: '/api/strategy/strgOptInstruction/copyFlag',
        method: 'post',
        data: {
          data: {
            instructionCode: this.$refs.qmTable.currentRow.instructionCode
          },
          funcModule: '指令管理',
          funcOperation: '校验计划或策略是否过期'
        }
      })
        .then(response => {
          var flag
          if (this.$refs.qmTable.currentRow.planCode === this.$refs.qmTable.currentRow.strategyCode) {
            flag = '1'
          } else {
            flag = '0'
          }
          this.$router.push({
            name: 'optionInstructionAdd',
            params: {
              type: 'copy',
              uk: this.$refs.qmTable.currentRow.instructionCode,
              typeFlag: flag,
              row: this.$refs.qmTable.currentRow
            }
          })
        })
        .catch(() => { })
    },
    remove() {
      if (this.$refs.qmTable.currentRow) {
        request({
          url: '/api/strategy/strgOptInstruction/validated',
          method: 'post',
          data: {
            data: this.$refs.qmTable.currentRow.instructionCode,
            funcModule: '指令管理',
            funcOperation: '删除'
          }
        })
          .then(response => {
            this.remove1()
          })
          .catch(() => { })
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
            url: '/api/strategy/strgOptInstruction/remove',
            method: 'post',
            data: {
              data: this.$refs.qmTable.currentRow.instructionCode,
              funcModule: '指令管理',
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
            .catch(() => { })
        })
        .catch(() => { })
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
      this.$confirm(this.$t('biz.msg.confirmCancelAudit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategy/strgOptInstruction/cancelAudit',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.cancelAudit'),
            data: currentRow.instructionCode
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
      var flag
      if (this.$refs.qmTable.currentRow.strgLevel === '1') {
        flag = '0'
      } else {
        flag = '1'
      }
      this.$router.push({
        name: 'optionInstructionView',
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.instructionCode,
          row: this.$refs.qmTable.currentRow,
          typeFlag: flag
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
      request({
        url: '/api/strategy/strgOptInstruction/validated',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.update'),
          data: this.$refs.qmTable.currentRow.instructionCode
        }
      }).then(request => {
        var flag
        if (this.$refs.qmTable.currentRow.strgLevel === '1') {
          flag = '0'
        } else {
          flag = '1'
        }
        this.$router.push({
          name: 'optionInstructionEdit',
          params: {
            type: 'update',
            uk: this.$refs.qmTable.currentRow.instructionCode,
            typeFlag: flag,
            row: this.$refs.qmTable.currentRow
          }
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
        this.$router.push({
          name: 'optionInstructionAdd',
          params: {
            type: 'add',
            typeFlag: value
          }
        })
      }
    }
  }
}
</script>
