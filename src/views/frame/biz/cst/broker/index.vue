<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'broker',
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
            custNo: '',
            custName: '',
            type: '',
            classify: '',
            date: '',
            status: '',
            usingFlag: '',
            isBlacklist: ''
          },
          defaultSortString: 'createDate.desc'
        },
        formData: [
          // {
          //   type: 'date',
          //   label: 'cst.broker.form.date',
          //   props: ['startDate', 'endDate'],
          //   attrs: {
          //     clearable: true,
          //     format: 'yyyy-MM-dd',
          //     'value-format': 'yyyyMMdd'
          //   }
          // },
          {
            label: 'cst.broker.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.broker.form.classify',
            prop: 'classifyCode',
            element: 'base-select',
            list: this.$t('datadict.custClassify'),
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
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.broker.form.isBlacklist',
            prop: 'isBlacklist',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          cancelAudit: '/api/cust/brokers/cancelAudit',
          search: '/api/cust/brokers/list',
          doDelete: '/api/cust/brokers/removeByCode',
          updateUsingFlag: '/api/cust/brokers/updateUsingFlag',
          update: '/api/cust/brokers/update'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'brokerAdd',
                params: {
                  type: 'add',
                  back: 'broker'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/cust/brokers/validatedApi',
                data: row.custCode
              }
            },
            routeInfo(row) {
              return {
                name: 'brokerUpdate',
                params: {
                  type: 'update',
                  back: 'broker',
                  id: row.custCode
                }
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            msg: this.$t('cst.broker.validateMsg.remove'),
            validateApi(row) {
              return {
                url: '/api/cust/brokers/validatedApi',
                data: row.custCode
              }
            },
            getParam(currentRow) {
              return currentRow.custCode
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'brokerView',
                params: {
                  type: 'view',
                  back: 'broker',
                  id: currentRow.custCode
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
                  value: currentRow.custCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '经纪商: ' + currentRow.custName + '(' + currentRow.custCode + ')' // 变量值
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
                uk: currentRow.custCode,
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
                uk: currentRow.custCode // 变量值
              }
            }
          },
          // {
          //   name: 'cancelAudit',
          //   msg: this.$t('biz.msg.disableCancelAudit'),
          //   validate(currentRow) {
          //     return currentRow.auditStatus === '3'
          //   },
          //   getParam(currentRow) {
          //     return {
          //       billNum: currentRow.custCode
          //     }
          //   }
          // },
          {
            name: 'export'
          },
          {
            name: 'on',
            iconName: '线性-启用',
            i18n: 'biz.btn.enable',
            event: this.enable
          },
          {
            name: 'off',
            iconName: '线性-停用',
            i18n: 'biz.btn.disable',
            event: this.disable
          },
          {
            name: 'refresh'
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                custCode: currentRow.custCode
              }
            }
          },
          {
            msg: this.$t('cst.broker.validateMsg.credit'),
            name: 'next',
            permitName: ['credit'],
            type: 'route',
            i18n: 'cst.broker.btn.credit',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.usingFlag === '1'
            },
            routeInfo(currentRow) {
              return {
                name: 'custCreditBrAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.custCode,
                  preBillType: 'CUST_INFO',
                  back: 'broker'
                }
              }
            }
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '经纪商管理')
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '经纪商管理', '/api/cust/brokers/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'biz.lbl.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'brokerCode',
              width: '220',
              label: 'cst.broker.list.brokerCode'
            },
            {
              prop: 'custCode',
              width: '150',
              label: 'cst.broker.list.custNo'
            },
            {
              prop: 'custName',
              width: '220',
              label: 'cst.broker.list.custName'
            },
            {
              prop: 'custFullnameChs',
              width: '220',
              label: 'cst.broker.list.custFullName_CHS'
            },
            {
              prop: 'custHeadline',
              width: '220',
              label: 'cst.customerSupplier.form.custHeadline',
              isShow: false
            },
            {
              label: 'cst.customerSupplier.list.creditRating',
              width: '100',
              prop: 'creditRating',
              list: this.$t('datadict.creditRating'),
              isShow: false
            },
            {
              prop: 'typeCode',
              width: '150',
              label: 'cst.broker.list.type',
              format: {
                dict: this.$t('datadict.custType')
              }
            },
            {
              prop: 'classifyCode',
              width: '80',
              align: 'center',
              label: 'cst.broker.list.classify',
              format: {
                dict: this.$t('datadict.custClassify')
              }
            },
            {
              prop: 'usingFlag',
              width: '80',
              align: 'center',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'enterpriseTypeCode',
              width: '100',
              align: 'center',
              label: 'cst.broker.list.enterpriseType',
              format: {
                dict: this.$t('datadict.enterpriseType')
              }
            },
            {
              prop: 'enterpriseFormCode',
              width: '100',
              align: 'center',
              label: 'cst.broker.list.enterpriseForm',
              format: {
                dict: this.$t('datadict.enterpriseForm')
              }
            },
            {
              prop: 'address',
              width: '220',
              label: 'cst.warehoueCompany.list.address'
            },
            {
              prop: 'areaName',
              width: '120',
              label: 'cst.warehoueCompany.list.area'
            },
            {
              prop: 'isBlacklist',
              width: '120',
              align: 'center',
              label: 'cst.broker.list.isBlacklist',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'createDate',
              width: '140',
              align: 'center',
              label: 'cst.broker.list.createDate'
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
    enable() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (row.usingFlag === '1') {
        this.$notify(
          notifyInfo({
            msg: this.$t('cst.customerSupplier.validateMsg.enable')
          })
        )
        return
      }
      request({
        url: this.mainData.api.updateUsingFlag,
        method: 'POST',
        data: {
          data: {
            usingFlag: '1',
            custCode: row.custCode
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
          this.$refs.qmTable.getList()
        })
        .catch(() => {})
    },
    disable() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (row.usingFlag === '0') {
        this.$notify(
          notifyInfo({
            msg: this.$t('cst.customerSupplier.validateMsg.disable')
          })
        )
        return
      }
      request({
        url: this.mainData.api.updateUsingFlag,
        method: 'POST',
        data: {
          data: {
            usingFlag: '0',
            custCode: row.custCode
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.disable')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
          this.$refs.qmTable.getList()
        })
        .catch(() => {})
    }
  }
}
</script>
