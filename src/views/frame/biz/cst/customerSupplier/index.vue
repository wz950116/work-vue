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
  name: 'customerSupplier',
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
            label: 'cst.customerSupplier.form.custName',
            prop: 'custName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.customerSupplier.form.type',
            prop: 'typeCode',
            element: 'base-select',
            list: this.$t('datadict.custcsType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.customerSupplier.form.custParentCode',
            prop: 'custParentCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '12',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
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
            label: 'cst.customerSupplier.form.isBlacklist',
            prop: 'isBlacklist',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.customerSupplier.list.allocationType',
            prop: 'allocationType',
            element: 'base-select',
            list: this.$t('datadict.custAllocationType'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          cancelAudit: '/api/cust/customer/cancelAudit',
          search: '/api/cust/customer/list',
          doDelete: '/api/cust/customer/removeByCode',
          updateUsingFlag: '/api/cust/customer/updateUsingFlag',
          update: '/api/cust/customer/update'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'customerSupplierAdd',
                params: {
                  type: 'add',
                  back: 'customerSupplier'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/cust/customer/validatedApi',
                data: row.custCode
              }
            },
            routeInfo(row) {
              return {
                name: 'customerSupplierUpdate',
                params: {
                  type: 'update',
                  id: row.custCode,
                  back: 'customerSupplier'
                }
              }
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            msg: this.$t('cst.customerSupplier.validateMsg.remove'),
            validateApi(row) {
              return {
                url: '/api/cust/customer/validatedApi',
                data: row.custCode
              }
            },
            getParam(currentRow) {
              return currentRow.custCode
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'customerSupplierView',
                params: {
                  type: 'view',
                  id: currentRow.custCode,
                  back: 'customerSupplier'
                }
              }
            }
          },
          {
            name: 'allocation',
            permitName: ['allocation'],
            type: 'dialog',
            validate(currentRow) {
              return currentRow && currentRow.auditStatus === '3'
            },
            msg: this.$t('cst.customerSupplier.validateMsg.allocation'),
            getParam(currentRow) {
              return {
                row: currentRow,
                opType: 'allocation'
              }
            },
            component: () => import('@/views/frame/biz/cst/customerSupplier/allocationTypeSetDialog')
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              let textValue = this.title + '客户:' + currentRow.custName + '(' + currentRow.custCode + ')'
              if (currentRow.typeCode === '2') {
                textValue = this.title + '供应商:' + currentRow.custName + '(' + currentRow.custCode + ')'
              }
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
            validate(currentRow) {
              return currentRow.usingFlag === '0'
            },
            event: this.enable
          },
          {
            name: 'off',
            iconName: '线性-停用',
            i18n: 'biz.btn.disable',
            validate(currentRow) {
              return currentRow.usingFlag === '1'
            },
            event: this.disable
          },
          {
            name: 'refresh'
          },
          {
            msg: this.$t('cst.customerSupplier.validateMsg.credit'),
            name: 'next',
            permitName: ['credit'],
            type: 'route',
            i18n: 'cst.customerSupplier.btn.credit',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.usingFlag === '1'
            },
            routeInfo(currentRow) {
              return {
                name: 'custCreditCsAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.custCode,
                  preBillType: 'CUST_INFO',
                  back: 'customerSupplier'
                }
              }
            }
          },
          {
            name: 'modify',
            permitName: ['modify'],
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'customerSupplierModify',
                params: {
                  type: 'modify',
                  id: currentRow.custCode,
                  back: 'customerSupplier'
                }
              }
            },
            msg: this.$t('cst.customerSupplier.validateMsg.modifyCheck'),
            validate(currentRow) {
              return currentRow && currentRow.auditStatus === '3'
            }
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            event: excelUtil.downloadTemplate(this, '客商')
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            event: excelUtil.uploadExcel(this, '客商', '/api/cust/customer/uploadExcel'),
            showLoading: true
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
              width: '110',
              label: 'cst.customerSupplier.list.custNo'
            },
            {
              prop: 'custName',
              width: '220',
              label: 'cst.customerSupplier.list.custName'
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
              prop: 'allocationType',
              width: '120',
              align: 'center',
              label: 'cst.customerSupplier.list.allocationType',
              format: {
                dict: this.$t('datadict.custAllocationType')
              }
            },
            {
              prop: 'custFullnameChs',
              width: '220',
              label: 'cst.customerSupplier.list.custFullName_CHS'
            },
            {
              prop: 'custFullnameEn',
              width: '220',
              label: 'cst.customerSupplier.list.custFullName_EN',
              isShow: false
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
              prop: 'custParentName',
              width: '220',
              label: 'cst.customerSupplier.list.custParentName'
            },
            {
              prop: 'typeCodeList',
              width: '150',
              sortable: false,
              label: 'cst.customerSupplier.list.type',
              format: {
                dict: this.$t('datadict.custType')
              }
            },
            {
              prop: 'currency',
              width: '80',
              label: 'cst.customerSupplier.list.currency',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              prop: 'reverseFlag',
              width: '80',
              label: 'cst.customerSupplier.list.reverseFlag',
              format: {
                dict: this.$t('datadict.reverseFlag')
              }
            },
            {
              prop: 'reverseOrganName',
              width: '120',
              label: 'cst.customerSupplier.list.reverseOrganName'
            },
            // {
            //   prop: 'classifyCode',
            //   width: '80',
            //   align: 'center',
            //   label: 'cst.customerSupplier.list.classify',
            //   format: {
            //     dict: this.$t('datadict.custClassify')
            //   }
            // },
            {
              prop: 'enterpriseTypeCode',
              width: '100',
              align: 'center',
              label: 'cst.customerSupplier.list.enterpriseType',
              format: {
                dict: this.$t('datadict.enterpriseType')
              }
            },
            {
              prop: 'enterpriseFormCode',
              width: '100',
              align: 'center',
              label: 'cst.customerSupplier.list.enterpriseForm',
              format: {
                dict: this.$t('datadict.enterpriseForm')
              }
            },
            {
              prop: 'isBlacklist',
              width: '120',
              align: 'center',
              label: 'cst.customerSupplier.list.isBlacklist',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'areaName',
              width: '120',
              label: 'cst.customerSupplier.list.area'
            },
            {
              prop: 'address',
              width: '220',
              label: 'cst.customerSupplier.list.address'
            },
            {
              prop: 'legalName',
              width: '220',
              label: 'cst.customerSupplier.form.legalName',
              isShow: false
            },
            {
              prop: 'registCapital',
              width: '220',
              label: 'cst.customerSupplier.form.registCapital',
              isShow: false
            },
            {
              prop: 'foundTime',
              width: '220',
              label: 'cst.customerSupplier.form.foundTime',
              isShow: false
            },
            {
              prop: 'scopeBusiness',
              width: '220',
              label: 'cst.customerSupplier.form.scopeBusiness',
              isShow: false
            },
            {
              prop: 'officeAddress',
              width: '220',
              label: 'cst.customerSupplier.form.officeAddress',
              isShow: false
            },
            {
              prop: 'businessScale',
              width: '220',
              label: 'cst.customerSupplier.form.businessScale',
              isShow: false
            },
            {
              prop: 'employees',
              width: '220',
              label: 'cst.customerSupplier.form.employees',
              isShow: false
            },
            {
              prop: 'coopMode',
              width: '220',
              label: 'cst.customerSupplier.form.coopMode',
              isShow: false
            },
            {
              prop: 'productType',
              width: '220',
              label: 'cst.customerSupplier.form.productType',
              isShow: false
            },
            {
              prop: 'buyTradeCode',
              width: '220',
              label: 'cst.customerSupplier.form.buyTrade',
              isShow: false,
              format: {
                dict: this.$t('datadict.tradeWay')
              }
            },
            {
              prop: 'saleTradeCode',
              width: '220',
              label: 'cst.customerSupplier.form.saleTrade',
              isShow: false,
              format: {
                dict: this.$t('datadict.tradeWay')
              }
            },
            {
              prop: 'createDate',
              width: '140',
              align: 'center',
              label: 'cst.customerSupplier.list.createDate'
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
        this.$notify(notifyInfo({ msg: this.$t('cst.customerSupplier.validateMsg.enable') }))
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
        this.$notify(notifyInfo({ msg: this.$t('cst.customerSupplier.validateMsg.disable') }))
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
