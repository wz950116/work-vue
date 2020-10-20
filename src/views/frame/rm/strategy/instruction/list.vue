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
  name: 'instructionManagement',
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
            label: 'strategy.instruction.form.instructionName',
            prop: 'instructionName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.instruction.form.instructionCode',
            prop: 'instructionCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.instruction.form.instructionType',
            prop: 'instructionType',
            element: 'base-select',
            list: this.$t('datadict.instructionType1'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.instruction.form.orderCode',
            prop: 'orderCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          },
          {
            label: 'strategy.instruction.form.strategyName',
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
            label: 'strategy.instruction.form.planName',
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
          search: '/api/strg/instruction/page',
          doDelete: '/api/strg/instruction/remove'
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
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs,
            validate() { }
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
                uk: currentRow.instructionCode // 变量值
              }
            }
          },
          {
            name: 'issued',
            iconName: '线性-标记',
            i18n: '下达指令',
            type: 'dialog',
            event: this.issued
          },
          {
            name: 'undo',
            iconName: '线性-标记',
            i18n: '撤销指令',
            type: 'dialog',
            event: this.undo
          }
        ],

        isColset: true,
        table: {
          id: 'instructionManagement',
          cols: [
            {
              label: 'strategy.instruction.list.auditStat',
              prop: 'auditStatus',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'strategy.instruction.list.organName',
              prop: 'organName',
              width: '100'
            },
            {
              label: 'strategy.instruction.list.deptName',
              prop: 'deptName',
              width: '100'
            },
            {
              label: 'strategy.instruction.list.instructionName',
              prop: 'instructionName',
              width: '150'
            },
            {
              label: 'strategy.instruction.list.instructionCode',
              prop: 'instructionCode',
              width: '150'
            },
            {
              label: 'strategy.instruction.list.instructionType',
              prop: 'instructionType',
              align: 'center',
              width: '100',
              format: {
                dict: this.$t('datadict.instructionType')
              }
            },
            {
              label: 'strategy.instruction.list.strategyName',
              prop: 'planName',
              width: '150'
            },
            {
              label: 'strategy.instruction.list.strategyCode',
              prop: 'planCode',
              width: '150'
            },
            {
              label: 'strategy.instruction.list.startDate',
              prop: 'startDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'strategy.instruction.list.endDate',
              prop: 'endDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'strategy.instruction.list.orderName',
              prop: 'orderName',
              width: '80'
            },
            {
              label: 'strategy.instruction.list.traderName',
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
        url: '/api/strg/instruction/copyFlag',
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
            name: 'instructionAdd',
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
          url: '/api/strg/instruction/checkRemove',
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
            url: '/api/strg/instruction/remove',
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

      if (this.$refs.qmTable.currentRow.auditStatus !== '3') {
        this.$notify(
          notifyInfo({
            msg: '只有审批状态为同意的数据才能被退审'
          })
        )
        return
      }
      request({
        url: '/api/strg/instruction/checkCancelAudit',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.cancelAudit'),
          data: currentRow.instructionCode
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
          url: '/api/strg/instruction/cancelAudit',
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
    // 下达指令
    issued() {
      if (this.$refs.qmTable.currentRow) {
        this.$confirm('是否确定下达指令', this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            request({
              url: '/api/strg/instruction/issued',
              method: 'post',
              data: {
                data: this.$refs.qmTable.currentRow.instructionCode,
                funcModule: '指令管理',
                funcOperation: '下达指令'
              }
            })
              .then(response => {
                Notification(
                  notifySuccess({
                    msg: '下达指令成功'
                  })
                )
              })
              .catch(() => { })
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
    // 撤销指令
    undo() {
      if (this.$refs.qmTable.currentRow) {
        this.$confirm('是否确定撤销指令', this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            request({
              url: '/api/strg/instruction/undo',
              method: 'post',
              data: {
                data: this.$refs.qmTable.currentRow.instructionCode,
                funcModule: '指令管理',
                funcOperation: '撤销指令'
              }
            })
              .then(response => {
                Notification(
                  notifySuccess({
                    msg: '撤销指令成功'
                  })
                )
              })
              .catch(() => { })
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
      if (this.$refs.qmTable.currentRow.planCode === this.$refs.qmTable.currentRow.strategyCode) {
        flag = '1'
      } else {
        flag = '0'
      }
      this.$router.push({
        name: 'instructionView',
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
        url: '/api/strg/instruction/checkUpdate',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.update'),
          data: this.$refs.qmTable.currentRow
        }
      }).then(request => {
        var flag
        if (this.$refs.qmTable.currentRow.planCode === this.$refs.qmTable.currentRow.strategyCode) {
          flag = '1'
        } else {
          flag = '0'
        }
        this.$router.push({
          name: 'instructionUpdate',
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
          name: 'instructionAdd',
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
