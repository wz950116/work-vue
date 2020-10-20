<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import Vue from 'vue'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'custCreditCs',
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
            custName: '',
            custHeadline: '',
            dateStart: '',
            dateEnd: '',
            creditType: '',
            typeCode: '',
            custParentCode: '',
            creditQuotaType: '',
            auditStatus: '',
            docType: '',
            docNo: ''
          },
          defaultSortString: 'applyDt.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'cst.creditCs.form.date',
            props: ['dateStart', 'dateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'cst.creditCs.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.custHeadline',
            prop: 'custHeadline',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.creditType',
            prop: 'creditType',
            element: 'base-select',
            list: this.$t('datadict.creditType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.typeCode',
            prop: 'typeCode',
            element: 'base-select',
            list: this.$t('datadict.custType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.custParentCode',
            prop: 'custParentCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3',
                typeCode: '12'
              },
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.creditQuotaType',
            prop: 'creditQuotaType',
            element: 'base-select',
            list: this.$t('datadict.creditQuotaType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.docType',
            prop: 'docType',
            element: 'base-select',
            list: this.$t('datadict.custCreditDocType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.docNo',
            prop: 'docNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.freezeStatus',
            prop: 'freezeStatus',
            element: 'base-select',
            list: this.$t('datadict.freezeStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.voidStatus',
            prop: 'voidStatus',
            element: 'base-select',
            list: this.$t('datadict.voidStatus'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/cust/credit/listCs',
          doDelete: '/api/cust/credit/remove',
          cancelAudit: '/api/cust/credit/cancelAudit',
          void: '/api/cust/credit/updateVoidStatus',
          freeze: '/api/cust/credit/updateFreezeStatus',
          export: '/api/cust/credit/export'
        },
        apiData: {
          search(param) {},
          doDelete(param) {
            return param.custCreditNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'custCreditCsAdd',
                params: {
                  type: 'add',
                  back: 'custCreditCs'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'custCreditCsUpdate',
                params: {
                  type: 'update',
                  custCreditNo: currentRow.custCreditNo,
                  back: 'custCreditCs'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/cust/credit/validatedApi',
                data: row.custCreditNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.custCreditNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'custCreditCsView',
                params: {
                  type: 'view',
                  custCreditNo: currentRow.custCreditNo,
                  back: 'custCreditCs'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.custCreditNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '客户/供应商: ' + currentRow.custName // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          //撤回审批
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.custCreditNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.custCreditNo // 变量值
              }
            }
          },
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.custCreditNo
              }
            }
          },
          // {
          //   name: 'adjustment',
          //   iconName: '线性-新增',
          //   i18n: 'biz.btn.adjustment',
          //   type: 'route',
          //   routeInfo(currentRow) {
          //     return {
          //       name: 'custCreditCsUpdate',
          //       params: {
          //         type: 'update',
          //         custCreditNo: currentRow.custCreditNo,
          //         back: 'custCreditCs'
          //       }
          //     }
          //   },
          //   validateApi(row) {
          //     return {
          //       url: '/api/cust/credit/validatedApi',
          //       data: row.custCreditNo
          //     }
          //   },
          //   event: this.adjustment
          // },
          {
            name: 'freeze',
            type: 'dialog',
            iconName: '线性-修改',
            i18n: 'biz.btn.freeze',
            event: this.freeze,
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/cst/creditCs/freezeDialog.vue')
          },
          {
            name: 'unfreeze',
            type: 'dialog',
            iconName: '线性-删除',
            i18n: 'biz.btn.unfreeze',
            event: this.unfreeze
          },
          {
            name: 'void',
            type: 'route',
            iconName: '线性-删除',
            i18n: 'biz.btn.void',
            event: this.void
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          cols: [
            {
              label: 'biz.lbl.auditStatus',
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'cst.creditCs.list.freezeStatus',
              prop: 'freezeStatus',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.freezeStatus')
              }
            },
            {
              label: 'cst.creditCs.list.voidStatus',
              prop: 'voidStatus',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.voidStatus')
              }
            },
            {
              label: 'cst.creditCs.list.custName',
              width: '220',
              prop: 'custName'
            },
            {
              label: 'cst.creditCs.list.custTypeName',
              width: '100',
              align: 'center',
              prop: 'typeCode',
              format: {
                dict: this.$t('datadict.custType2')
              }
            },
            {
              label: 'cst.creditCs.list.custHeadline',
              width: '220',
              prop: 'custHeadline'
            },
            {
              label: 'cst.creditCs.list.creditType',
              prop: 'creditType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditType')
              }
            },
            {
              label: 'cst.creditCs.list.creditWay',
              prop: 'creditWay',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditWay')
              }
            },

            {
              label: 'cst.creditCs.list.creditQuotaType',
              prop: 'creditQuotaType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.creditQuotaType')
              }
            },
            {
              label: 'cst.creditCs.list.dateStart',
              prop: 'dateStart',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditCs.list.dateEnd',
              prop: 'dateEnd',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'cst.creditCs.list.creditDays',
              prop: 'creditDays',
              width: '100',
              align: 'right',
              sortable: false,
              format: {
                func: 'num'
              }
            },
            {
              label: 'cst.creditCs.list.creditQuota',
              prop: 'creditQuota',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditCs.list.usedAmount',
              prop: 'usedAmount',
              width: '100',
              sortable: false,
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'cst.creditCs.list.useableAmount',
              prop: 'useableAmount',
              width: '100',
              sortable: false,
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            // {
            //   label: 'cst.creditCs.list.netDays',
            //   prop: 'netDays',
            //   width: '100',
            //   align: 'right',
            //   format: {
            //     func: 'thousands',
            //     dict: 0
            //   }
            // },
            {
              label: 'cst.creditCs.list.docType',
              prop: 'docType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.custCreditDocType')
              }
            },
            {
              label: 'cst.creditCs.list.docNo',
              width: '220',
              prop: 'docNo'
            },
            {
              label: 'cst.creditCs.list.limitByContract',
              prop: 'limitByContract',
              width: '100',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            // {
            //   label: 'cst.creditCs.list.limitByYear',
            //   prop: 'limitByYear',
            //   width: '100',
            //   align: 'right',
            //   format: {
            //     func: 'thousands',
            //     dict: 2
            //   }
            // },
            {
              label: 'cst.creditCs.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '100',
              align: 'center'
            },
            {
              label: 'cst.creditCs.list.applyDt',
              prop: 'applyDt',
              width: '160',
              align: 'center'
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
    // 冻结处理
    freeze() {
      const currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRow.freezeStatus == '1') {
        this.$notify(notifyInfo({ msg: this.$t('cst.creditCs.msg.freezeCheck') }))
        return
      }

      // 注册组件
      Vue.component('view-form-table', () => import('@/views/frame/biz/cst/creditCs/freezeDialog.vue'))
      const row = this.$refs.qmTable.currentRow
      row.custCreditNo = row.custCreditNo
      this.$refs.qmTable.param = row
      this.$refs.qmTable.opType = 'update'
      this.$refs.qmTable.opMode = 'dialog'
      this.$refs.qmTable.dialogDetailVisible = true
    },
    // 解冻处理
    unfreeze() {
      const currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRow.freezeStatus !== '1') {
        this.$notify(notifyInfo({ msg: this.$t('cst.creditCs.msg.unfreezeCheck') }))
        return
      }

      // 注册组件
      Vue.component('view-form-table', () => import('@/views/frame/biz/cst/creditCs/freezeDialog.vue'))
      const row = this.$refs.qmTable.currentRow
      row.custCreditNo = row.custCreditNo
      this.$refs.qmTable.param = row
      this.$refs.qmTable.opType = 'update'
      this.$refs.qmTable.opMode = 'dialog'
      this.$refs.qmTable.dialogDetailVisible = true
    },
    // 作废处理
    void() {
      const currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRow.voidStatus == '1') {
        this.$notify(notifyInfo({ msg: this.$t('cst.creditCs.msg.voidCheck') }))
        return
      }

      this.$confirm(this.$t('cst.creditCs.msg.voidConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: this.mainData.api.void,
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              voidStatus: '1',
              custCreditNo: currentRow.custCreditNo
            }
          }
        }).then(response => {
          if (response.status) {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.voidSuccess') }))
            this.$refs.qmTable.getList()
          }
        })
      })
    }
  }
}
</script>
