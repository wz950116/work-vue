<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'domesticInvoiceApply',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            applyNo: '',
            applyDateStart: '',
            applyDateEnd: '',
            customerNo: '',
            latestInvoiceDateStart: '',
            latestInvoiceDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            confirmStatus: ''
          },
          defaultSortString: 'applyDate.desc, applyNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.domesticInvoiceApply.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'invoice.domesticInvoiceApply.form.latestInvoiceDate',
            props: ['latestInvoiceDateStart', 'latestInvoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: []
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.confirmStatus',
            prop: 'confirmStatus',
            element: 'base-select',
            list: this.$t('datadict.confirmStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          cancelAudit: '/api/invoice/domesticApply/cancelAudit',
          search: '/api/invoice/domesticApply/list',
          doDelete: '/api/invoice/domesticApply/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 新增
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'domesticInvoiceApplyAdd',
                params: {
                  type: 'add',
                  back: 'domesticInvoiceApply'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'domesticInvoiceApplyUpdate',
                params: {
                  type: 'update',
                  id: currentRow[0].applyNo,
                  back: 'domesticInvoiceApply'
                }
              }
            },
            validateApi(currentRow) {
              return {
                url: '/api/invoice/domesticApply/validatedApi',
                data: currentRow[0].applyNo
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow[0].applyNo
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'domesticInvoiceApplyView',
                params: {
                  type: 'view',
                  id: currentRow[0].applyNo,
                  back: 'domesticInvoiceApply'
                }
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 提交审批
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow[0],
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow[0].applyNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow[0].applyNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog'),
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 撤回审核
          {
            name: 'withdrawAudit',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow[0].applyNo,
                moduleCode: this.moduleCode
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                },
                {
                  result: currentRow[0].auditStatus === '2',
                  msg: this.$t('biz.msg.disableWithdrawAudit')
                }
              ]
            }
          },
          // 审批历史
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow[0],
                moduleCode: this.moduleCode,
                uk: currentRow[0].applyNo // 变量值
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 弃审
          {
            name: 'cancelAudit',
            getParam(currentRow) {
              return {
                billNum: currentRow[0].applyNo
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                },
                {
                  result: currentRow[0].auditStatus === '3',
                  msg: this.$t('biz.msg.disableCancelAudit')
                }
              ]
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow[0].applyNo
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                }
              ]
            }
          },
          // 导出
          {
            name: 'export'
          },
          // 刷新
          {
            name: 'refresh'
          },
          // 开票确认(内贸)
          {
            name: 'next',
            permitName: ['domesticInvoiceConfirm'],
            type: 'route',
            i18n: 'invoice.domesticInvoiceApply.btn.domesticInvoiceConfirm',
            routeInfo(currentRow) {
              return {
                name: 'domesticInvoiceConfirmAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow[0].applyNo,
                  preBillType: 'DOMESTIC_INVOICE_APPLY',
                  back: 'domesticInvoiceApply'
                }
              }
            },
            validate: currentRow => {
              return [
                {
                  result: currentRow.length === 1,
                  msg: this.$t('biz.msg.noRowSelected')
                },
                {
                  result: currentRow[0].auditStatus === '3' && currentRow[0].confirmStatus !== '2',
                  msg: this.$t('invoice.domesticInvoiceApply.msg.domesticInvoiceConfirm')
                }
              ]
            }
          },
          // 快速开票
          {
            name: 'quickMakeOutInvoice',
            iconName: '线性-生成',
            i18n: 'invoice.domesticInvoiceApply.btn.quickMakeOutInvoice',
            event: this.quickMakeOutInvoice
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          showCheckbox: true,
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
            // 单据号
            {
              label: 'invoice.domesticInvoiceApply.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请日期
            {
              label: 'invoice.domesticInvoiceApply.list.applyDate',
              prop: 'applyDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 客户
            {
              label: 'invoice.domesticInvoiceApply.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 不含税金额
            {
              label: 'invoice.domesticInvoiceApply.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'invoice.domesticInvoiceApply.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 含税金额
            {
              label: 'invoice.domesticInvoiceApply.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'invoice.domesticInvoiceApply.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 最迟开票日期
            {
              label: 'invoice.domesticInvoiceApply.list.latestInvoiceDate',
              prop: 'latestInvoiceDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 确认状态
            {
              label: 'invoice.domesticInvoiceApply.list.confirmStatus',
              prop: 'confirmStatus',
              format: {
                dict: this.$t('datadict.confirmStatus')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.optName'
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
    // 快速开票
    quickMakeOutInvoice() {
      const rowList = this.$refs.qmTable.currentRow
      if (!rowList || rowList.length === 0) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      var customerNoList = []
      var customerInfoMap = {}
      rowList.forEach(row => {
        var customerInfo = {
          customerName: '',
          invoiceAmount: 0
        }
        if (customerNoList.includes(row.customerNo)) {
          customerInfo = customerInfoMap[row.customerNo]
        } else {
          customerNoList.push(row.customerNo)
        }
        var invoiceAmount = customerInfo.invoiceAmount
        row.invoiceDomApplyDetailDtoList.forEach(invoiceDomApplyDetailDto => {
          var resetQuantity = Number(invoiceDomApplyDetailDto.applyQuantity) - Number(invoiceDomApplyDetailDto.confirmQuantity)
          var resetAmount = resetQuantity * Number(invoiceDomApplyDetailDto.includeTaxPrice)
          invoiceAmount = (Number(invoiceAmount) + resetAmount).toFixed(2)
        })
        customerInfo.customerName = row.customerName
        customerInfo.invoiceAmount = invoiceAmount
        customerInfoMap[row.customerNo] = customerInfo
      })
      var msg = ''
      customerNoList.forEach(customerNo => {
        var customerInfo = customerInfoMap[customerNo]
        customerInfo.ticketNumber = Math.ceil(Number(customerInfo.invoiceAmount) / 500000)
        if (customerInfo.ticketNumber !== 0) {
          msg = msg + customerInfo.customerName + '&nbsp;&nbsp;' + Vue.filter('thousands')(customerInfo.invoiceAmount, 2) + ' CNY&nbsp;&nbsp;' + customerInfo.ticketNumber + '张<br>'
        }
      })
      if (msg === '') {
        this.$notify(notifyInfo({ msg: this.$t('invoice.domesticInvoiceApply.msg.quickMakeOutInvoiceMsg') }))
        return
      }
      this.$confirm(msg, this.$t('biz.msg.tip'), {
        type: 'info',
        customClass: 'quick-make-out-invoice',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>

<style>
.quick-make-out-invoice {
  width: 500px !important;
}
</style>