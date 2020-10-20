<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <future-cost-match-type v-if="typeDialogVisible" @close="dialogClose" @selectType="selectType"></future-cost-match-type>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import futureCostMatchType from '@/views/proj/spot/futuresCost/components/futureCostMatchType'
export default {
  name: 'futuresCost',
  components: { futureCostMatchType },
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      typeDialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            organCode: '',
            deptCode: '',
            documentStat: '',
            originalCurrencyAmtFrom: null,
            originalCurrencyAmtTo: null,
            purchaseSaleType: '',
            documentDateChangeStartTime: '',
            documentDateChangeEndTime: ''
          },
          defaultSortString: 'documentDate.desc'
        },
        formData: [
          {
            width: 120,
            label: 'spotProj.cost.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true
            }
          },
          {
            width: 100,
            label: 'spotProj.cost.form.deptCode',
            prop: 'deptCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_DEPT',
              clearable: true
            }
          },
          {
            label: 'spotProj.cost.form.documentStat',
            prop: 'documentStat',
            element: 'base-select',
            width: 120,
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'numberInterval',
            label: 'spotProj.cost.form.originalCurrencyAmt',
            props: ['originalCurrencyAmtFrom', 'originalCurrencyAmtTo'],
            attrs: {
              startMin: 0,
              startMax: 999999999999.99,
              endMin: 0,
              endMax: 999999999999.99,
              type: 'thousands',
              precision: 3
            }
          },
          {
            label: 'spotProj.cost.form.preliminaryFlag',
            prop: 'preliminaryFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'spotProj.cost.form.documentDate',
            props: ['documentDateChangeStartTime', 'documentDateChangeEndTime'],
            default: ['', ''],
            attrs: {
              pickStart: 'dateStartBeforeLv2',
              pickEnd: 'dateEndBeforeLv2',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/spot/futureCost/list'
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
                  value: this.$refs.qmTable.currentRow.documentNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '期货费用: ' + this.$refs.qmTable.currentRow.documentNo // 变量值
                }
              }
            }
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
            permitName: ['retrial'],
            event: this.cancelAudit,
            iconName: '线性-退审',
            $refs: this.$refs,
            i18n: this.$t('biz.btn.retrial')
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
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'originalCurrencyName',
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
              prop: 'preliminaryFlag',
              align: 'center',
              width: '80',
              label: 'spotProj.cost.list.preliminaryFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
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
    add() {
      this.typeDialogVisible = true
    },
    selectType(value) {
      this.typeDialogVisible = false
      this.$router.push({
        name: 'futuresCostAdd',
        params: {
          type: 'add',
          typeFlag: value
        }
      })
    },
    dialogClose() {
      this.typeDialogVisible = false
      this.$refs.qmTable.getList()
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
      this.$router.push({
        name: 'futuresCostAdd',
        params: {
          type: 'copy',
          uk: currentRow.documentNo
        }
      })
    },
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
            msg: this.$t('spotProj.cost.msg.costNotAudit')
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
          url: '/api/spot/futureCost/cancelAudit',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.cancelAudit'),
            data: currentRow.documentNo
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
          uk: currentRow.documentNo,
          moduleCode: this.$route.meta.bpmModule,
          row: this.$refs.qmTable.currentRow
        }
      })
    }
  }
}
</script>
