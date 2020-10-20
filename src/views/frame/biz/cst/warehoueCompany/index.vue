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
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'warehoueCompany',
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
          //   label: 'cst.customerSupplier.form.date',
          //   props: ['startDate', 'endDate'],
          //   attrs: {
          //     clearable: true,
          //     format: 'yyyy-MM-dd',
          //     'value-format': 'yyyyMMdd'
          //   }
          // },
          {
            label: 'cst.warehoueCompany.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.warehoueCompany.form.classify',
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
            label: 'cst.warehoueCompany.form.isBlacklist',
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
          cancelAudit: '/api/cust/warehouse/cancelAudit',
          search: '/api/cust/warehouse/list',
          doDelete: '/api/cust/warehouse/removeByCode',
          updateUsingFlag: '/api/cust/warehouse/updateUsingFlag',
          update: '/api/cust/warehouse/update'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'warehoueCompanyAdd',
                params: {
                  type: 'add',
                  back: 'warehoueCompany'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/cust/warehouse/validatedApi',
                data: row.custCode
              }
            },
            routeInfo(row) {
              return {
                name: 'warehoueCompanyUpdate',
                params: {
                  type: 'update',
                  id: row.custCode,
                  back: 'warehoueCompany'
                }
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            msg: this.$t('cst.warehoueCompany.validateMsg.remove'),
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
                name: 'warehoueCompanyView',
                params: {
                  type: 'view',
                  id: currentRow.custCode,
                  back: 'warehoueCompany'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '仓储公司:' + currentRow.custCode
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
            msg: this.$t('cst.warehoueCompany.validateMsg.credit'),
            name: 'next',
            permitName: ['credit'],
            type: 'route',
            i18n: 'cst.warehoueCompany.btn.credit',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.usingFlag === '1'
            },
            routeInfo(currentRow) {
              return {
                name: 'custCreditWhAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.custCode,
                  preBillType: 'CUST_INFO',
                  back: 'warehoueCompany'
                }
              }
            }
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '仓储公司管理')
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '仓储公司管理', '/api/cust/warehouse/uploadExcel')
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
              label: 'cst.warehoueCompany.list.custNo'
            },
            {
              prop: 'custName',
              width: '220',
              label: 'cst.warehoueCompany.list.custName'
            },
            {
              prop: 'custFullnameChs',
              width: '220',
              label: 'cst.warehoueCompany.list.custFullName_CHS'
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
              list: this.$t('datadict.creditRating')
            },
            {
              prop: 'typeCode',
              width: '150',
              label: 'cst.warehoueCompany.list.type',
              format: {
                dict: this.$t('datadict.custType')
              }
            },
            {
              prop: 'classifyCode',
              width: '80',
              align: 'center',
              label: 'cst.warehoueCompany.list.classify',
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
              label: 'cst.warehoueCompany.list.enterpriseType',
              format: {
                dict: this.$t('datadict.enterpriseType')
              }
            },
            {
              prop: 'enterpriseFormCode',
              width: '100',
              align: 'center',
              label: 'cst.warehoueCompany.list.enterpriseForm',
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
              label: 'cst.warehoueCompany.list.isBlacklist',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'createDate',
              width: '140',
              align: 'center',
              label: 'cst.warehoueCompany.list.createDate'
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
