<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  name: 'otherCust',
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
          {
            type: 'date',
            label: 'cst.otherCustomer.form.date',
            props: ['startDate', 'endDate'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'cst.otherCustomer.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.otherCustomer.form.classify',
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
            label: 'cst.otherCustomer.form.isBlacklist',
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
        initSearch: true,
        api: {
          cancelAudit: '/api/cust/other/cancelAudit',
          search: '/api/cust/other/list',
          doDelete: '/api/cust/other/removeByCode',
          updateUsingFlag: '/api/cust/other/updateUsingFlag',
          update: '/api/cust/other/update'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'otherCustAdd',
                params: {
                  type: 'add',
                  back: 'otherCust'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/cust/other/validatedApi',
                data: row.custCode
              }
            },
            routeInfo(row) {
              return {
                name: 'otherCustEdit',
                params: {
                  type: 'update',
                  id: row.custCode,
                  back: 'otherCust'
                }
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            msg: this.$t('cst.otherCustomer.validateMsg.remove'),
            validateApi(row) {
              return {
                url: '/api/cust/warehouse/validatedApi',
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
                name: 'otherCustView',
                params: {
                  type: 'view',
                  id: currentRow.custCode,
                  back: 'otherCust'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '客户编码:' + currentRow.custCode
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.custCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: textValue // 变量值
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
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.custCode
              }
            }
          },
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
              prop: 'custCode',
              width: '150',
              label: 'cst.otherCustomer.list.custNo'
            },
            {
              prop: 'custName',
              width: '220',
              label: 'cst.otherCustomer.list.custName'
            },
            {
              prop: 'custFullnameChs',
              width: '220',
              label: 'cst.otherCustomer.list.custFullName_CHS'
            },
            {
              label: 'cst.otherCustomer.list.creditRating',
              width: '100',
              prop: 'creditRating',
              list: this.$t('datadict.creditRating')
            },
            {
              prop: 'typeCodeList',
              width: '150',
              sortable: false,
              label: 'cst.otherCustomer.list.type',
              format: {
                dict: this.$t('datadict.custType')
              }
            },
            {
              prop: 'classifyCode',
              width: '80',
              align: 'center',
              label: 'cst.otherCustomer.list.classify',
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
              label: 'cst.otherCustomer.list.enterpriseType',
              format: {
                dict: this.$t('datadict.enterpriseType')
              }
            },
            {
              prop: 'enterpriseFormCode',
              width: '100',
              align: 'center',
              label: 'cst.otherCustomer.list.enterpriseForm',
              format: {
                dict: this.$t('datadict.enterpriseForm')
              }
            },
            {
              prop: 'address',
              width: '220',
              label: 'cst.otherCustomer.list.address'
            },
            {
              prop: 'areaName',
              width: '120',
              label: 'cst.otherCustomer.list.area'
            },
            {
              prop: 'isBlacklist',
              width: '120',
              align: 'center',
              label: 'cst.otherCustomer.list.isBlacklist',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'createDate',
              width: '140',
              align: 'center',
              label: 'cst.otherCustomer.list.createDate'
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
        this.$notify(notifyInfo({ msg: this.$t('cst.otherCustomer.validateMsg.enable') }))
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
        this.$notify(notifyInfo({ msg: this.$t('cst.otherCustomer.validateMsg.disable') }))
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
