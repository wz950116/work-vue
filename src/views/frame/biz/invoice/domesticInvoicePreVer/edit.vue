<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'domesticInvoicePreVerEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/invoice/invoiceDomPreVer/get',
          save: '/api/invoice/invoiceDomPreVer/save',
          update: '/api/invoice/invoiceDomPreVer/update'
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
            isShow: ['view', 'update', 'assist', 'audit'],
            event: 'auditHistory'
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
            getParam: data => {
              return {
                claimNo: data.claimNo,
                userEmployeeCode: this.$store.getters.userEmployeeCode
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectInvoiceConfirmDetail',
            isShow: ['add'],
            event: 'set',
            component: () => import('../invoiceDialog/domesticConfirmDetailDialog.vue'),
            initChoose: this.selectInvoiceDomesticReceiveInitChoose,
            callback: this.selectInvoiceDomesticReceiveCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'invoice.domesticInvoiceClaim.group.editPart1',
            content: [
              // 单据号
              {
                label: 'invoice.invoiceDomPreVer.form.verificatNo',
                prop: 'verificatNo',
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
              // 核销日期
              {
                type: 'date',
                label: 'invoice.invoiceDomPreVer.form.verificatDate',
                prop: 'verificatDate',
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
                label: 'invoice.invoiceDomPreVer.form.customerNo',
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
                    typeCode: '2',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  filterable: true,
                  disabled: true,
                  clearable: true
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 商品
              {
                label: 'invoice.invoiceDomPreVer.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRODUCT',
                  filterable: true,
                  disabled: true,
                  clearable: true
                },
                event: {
                  evn: this.productCodeChange
                }
              },
              // 发票号
              {
                label: 'invoice.invoiceDomPreVer.form.invoiceNo',
                prop: 'invoiceNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 核销数量
              {
                label: 'invoice.invoiceDomPreVer.form.verificatQuantity',
                prop: 'verificatQuantity',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'weight',
                  disabled: true,
                  clearable: true
                },
                event: {
                  change: this.verificatQuantityChange
                }
              },
              {},
              {},
              // 发票价格（不含税）
              {
                label: 'invoice.invoiceDomPreVer.form.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'exprice',
                  disabled: true,
                  clearable: true
                }
              },
              // 核销金额（不含税）
              {
                label: 'invoice.invoiceDomPreVer.form.excludeTaxAmount',
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
              // 税率
              {
                label: 'invoice.invoiceDomPreVer.form.taxRate',
                prop: 'taxRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'taxrate',
                  disabled: true,
                  clearable: true
                }
              },
              // 税额
              {
                label: 'invoice.invoiceDomPreVer.form.taxAmount',
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
              // 发票价格（含税）
              {
                label: 'invoice.invoiceDomPreVer.form.includeTaxPrice',
                prop: 'includeTaxPrice',
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
              // 核销金额（含税）
              {
                label: 'invoice.invoiceDomPreVer.form.includeTaxAmount',
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
                label: 'invoice.invoiceDomPreVer.form.currency',
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
                  disabled: true,
                  clearable: true
                }
              },
              {},
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: true,
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
            name: 'invoiceDomPreVerDeDtoList',
            label: 'invoice.invoiceDomPreVer.tab.preVerDetailInfoTab',
            component: () => import('./preVerDetailInfoTab.vue'),
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
      this.edit.formData.part1.content.forEach(info => {
        if (info.prop === 'customerNo') info.attrs.disabled = true
        if (info.prop === 'productCode') info.attrs.disabled = true
        if (info.prop === 'bizOrganCode') info.attrs.disabled = true
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
    // 选择收票登记弹框初始化
    selectInvoiceDomesticReceiveInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 获取属性值
    getEditFormPropVal(key) {
      return this.$refs.qmEdit.$refs.qmRouteEdit.editForm[key]
    },
    // 选择收票登记回调函数
    selectInvoiceDomesticReceiveCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lotNoGroup'] = param.lotNoGroup
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['invoiceNo'] = param.invoiceNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param.customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['productCode'] = param.productCode
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['confirmNo'] = param.confirmNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['confirmDetailId'] = param.id
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['verificatQuantity'] = '0'
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxPrice'] = param.excludeTaxPrice
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxAmount'] = '0'
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxRate'] = param.taxRate
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = '0'
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxPrice'] = param.includeTaxPrice
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxAmount'] = '0'
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['bizOrganCode'] = param.bizOrganCode
      this.clearClaimDetailInfo()
    },
    // 客户change事件
    customerNoChange(val) {
      this.clearReceiveInfo()
      this.clearClaimDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 商品change事件
    productCodeChange(val) {
      this.clearReceiveInfo()
      this.clearClaimDetailInfo()
    },
    // 认领数量change事件
    verificatQuantityChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['verificatQuantity'] = Number(val) + ''
      const excludeTaxPrice = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxPrice']
      const taxRate = this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxRate']
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxAmount'] = (Number(val) * Number(excludeTaxPrice)).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = ((Number(val) * Number(excludeTaxPrice) * Number(taxRate)) / 100).toFixed(2)
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxAmount'] = (Number(val) * Number(excludeTaxPrice) * (1 + Number(taxRate) / 100)).toFixed(2)
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearReceiveInfo()
      this.clearClaimDetailInfo()
    },
    // 清空收票登记信息
    clearReceiveInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['confirmDetailId'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['confirmNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['verificatQuantity'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxPrice'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['excludeTaxAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxRate'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['taxAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxPrice'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['includeTaxAmount'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
    },
    // 清空认领详细信息
    clearClaimDetailInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceDomPreVerDeDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
