<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'domesticInvoiceApplyEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/invoice/domesticApply/get',
          save: '/api/invoice/domesticApply/save',
          update: '/api/invoice/domesticApply/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
            getParam() {
              return this.param
            },
            event: 'audit',
            isShow: ['assist', 'audit'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核历史',
            name: 'biz.btn.auditHistory',
            $route: this.$route,
            getParam() {
              return {
                moduleCode: this.$route.meta.bpmModule,
                uk: this.$route.params.uk || this.$route.params.id
              }
            },
            event: 'auditHistory',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.id,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                billNo: data.applyNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'invoice.domesticInvoiceApply.group.editPart1',
            content: [
              // 单据号
              {
                label: 'invoice.domesticInvoiceApply.form.applyNo',
                prop: 'applyNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: false
                }
              },
              // 申请日期
              {
                type: 'date',
                label: 'invoice.domesticInvoiceApply.form.applyDate',
                prop: 'applyDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              // 客户
              {
                label: 'invoice.domesticInvoiceApply.form.customerNo',
                prop: 'customerNo',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
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
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 最迟开票日期
              {
                type: 'date',
                label: 'invoice.domesticInvoiceApply.form.latestInvoiceDate',
                prop: 'latestInvoiceDate',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              // 开票类型
              {
                label: 'invoice.domesticInvoiceApply.form.applyInvoiceType',
                prop: 'applyInvoiceType',
                element: 'base-select',
                list: this.$t('datadict.applyInvoiceType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                default: '2',
                event: this.applyInvoiceTypeChange
              },
              // 不含税金额
              {
                label: 'invoice.domesticInvoiceApply.form.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: true,
                  clearable: true
                }
              },
              // 税额
              {
                label: 'invoice.domesticInvoiceApply.form.taxAmount',
                prop: 'taxAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: true,
                  clearable: true
                }
              },
              // 含税金额
              {
                label: 'invoice.domesticInvoiceReceive.form.includeTaxAmount',
                prop: 'includeTaxAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: true,
                  clearable: true
                }
              },
              // 币种
              {
                label: 'invoice.domesticInvoiceApply.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                default: 'CNY'
              },
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userOrganCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.bizOrganCodeChange
                }
              },
              // 业务部门
              {
                label: 'biz.lbl.bizDeptName',
                prop: 'bizDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_DEPT',
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 业务员
              {
                label: 'biz.lbl.bizEmployeeName',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 操作员
              {
                label: 'biz.lbl.optName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  maxlength: 500,
                  disabled: false,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'invoiceDomApplyDetailDtoList',
            label: 'invoice.domesticInvoiceApply.tab.applyDetailInfoTab',
            component: () => import('./applyDetailInfoTab.vue'),
            required: true
          },
          {
            isShow: ['update', 'view', 'assist', 'audit'],
            name: 'outInvoiceDomApplyDetailDtoList',
            label: 'invoice.domesticInvoiceApply.tab.applyDetailInfoTab',
            component: () => import('./outNoticeProductTab.vue'),
            required: true
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'route'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },

  methods: {
    // 初始化回调
    handleInitCallback(param) {
      // 初始化时，设置为true，防止接口返回快慢导致下方详细数据被刷新
      this.applyInvoiceTypeChange(this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyInvoiceType, true)
    },
    // 开票类型change
    applyInvoiceTypeChange(val, isInit) {
      this.edit.tabs.forEach(table => {
        if (val === '2') {
          this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'invoiceDomApplyDetailDtoList'
          if (table.name === 'invoiceDomApplyDetailDtoList') {
            table.isShow = true
            table.required = true
          }
          if (table.name === 'outInvoiceDomApplyDetailDtoList') {
            table.isShow = false
            table.required = false
          }
        }
        if (val === '1') {
          this.$refs.qmEdit.$refs.qmRouteEdit.activeName = 'outInvoiceDomApplyDetailDtoList'
          if (table.name === 'invoiceDomApplyDetailDtoList') {
            table.isShow = false
            table.required = false
          }
          if (table.name === 'outInvoiceDomApplyDetailDtoList') {
            table.isShow = true
            table.required = true
          }
        }
      })
    },
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    // 本页面关闭
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    },
    // 客户change事件
    customerNoChange(val) {
      this.clearSumInfo()
      this.clearApplyDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearSumInfo()
      this.clearApplyDetailInfo()
    },
    // 清空合计信息
    clearSumInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxAmount'] = ''
    },
    // 清空开票申请详细信息
    clearApplyDetailInfo() {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyInvoiceType === '2') this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceDomApplyDetailDtoList[0].$refs.tab.tableData = []
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyInvoiceType === '1') this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outInvoiceDomApplyDetailDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
