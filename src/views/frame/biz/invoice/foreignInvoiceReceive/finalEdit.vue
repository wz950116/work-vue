<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='initCallback' @preCallback="handlePreCallback"></qm-edit>
</template>
<!-- 收票登记-最终结算票编辑 -->
<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import request from '@/utils/frame/base/request'
export default {
  name: 'receiveFinalEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/invoice/foreign/get',
          save: '/api/invoice/foreign/save',
          update: '/api/invoice/foreign/update',
          pre: {
            CON_PL_INFO: '/api/contract/plProductDetail/listChooseInvoiceF'
          }
        },
        apiData: {
          pre(param) {
            if (param.preBillType === 'CON_PL_INFO') {
              return {
                lotNo: param.preBillNo
              }
            }
          },
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
            getParam: this.getParamAuditHistory,
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
                billNo: data.invoiceForeignNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-批次详情',
            event: 'set',
            name: 'biz.btn.purchaseLot',
            component: () => import('@/views/frame/biz/spot/dialog/invoice/chooseLotProductPF.vue'),
            callback: this.selectCallback,
            initChoose: this.initDialogChoose,
            isShow: ['add', 'update']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'invoice.foreignInvoiceReceive.group.finalEditPart1',
            content: [
              {
                label: 'invoice.foreignInvoiceReceive.form.receiveNo',
                prop: 'invoiceForeignNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.invoiceNo',
                prop: 'invoiceNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              // 发票类型 结算
              {
                prop: 'invoiceType',
                default: 'F',
                isShow: false
              },
              // 发票方向 收票
              {
                prop: 'invoiceDirection',
                default: 'TAKE',
                isShow: false
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.customerName',
                prop: 'customerNo',
                element: 'base-select',
                list: [],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '2',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAllCustomerNo
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
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
              {
                type: 'date',
                label: 'invoice.foreignInvoiceReceive.form.invoiceDate',
                prop: 'invoiceDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.invoiceAmount',
                prop: 'invoiceAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  // disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.currency',
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
                  // disabled: true,
                  clearable: true
                }
              },
              // {
              //   label: 'invoice.foreignInvoiceReceive.form.exchangeRate',
              //   prop: 'exchangeRate',
              //   element: 'input-formatter',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'blur'
              //     }
              //   ],
              //   attrs: {
              //     min: 0,
              //     type: 'taxrate'
              //   }
              // },
              // {
              //   label: 'invoice.foreignInvoiceReceive.form.localCurrencyAmout',
              //   prop: 'localCurrencyAmout',
              //   element: 'input-formatter',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'blur'
              //     }
              //   ],
              //   attrs: {
              //     min: 0,
              //     type: 'money'
              //   }
              // },
              {
                label: 'invoice.foreignInvoiceReceive.form.loadingPlace',
                prop: 'loadingPlace',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.dischargePlace',
                prop: 'dischargePlace',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.form.priceTerm',
                prop: 'priceTerm',
                element: 'base-select',
                list: this.$t('datadict.priceTerm'),
                attrs: {
                  clearable: true
                }
              },
              {
                prop: 'zhanweizhi1',
                isShow: true,
                attrs: {
                  cols: 2
                }
              },
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
                  filterable: true,
                  data: 'FUNC_ORG',
                  clearable: true
                }
              },
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
                  clearable: true
                }
              },
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
                  clearable: true
                }
              },
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
              {
                label: 'invoice.foreignInvoiceReceive.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'view', 'audit'],
            name: 'invoiceForeignDetailDtoList',
            label: 'invoice.foreignInvoiceReceive.tab.invoiceDetailInfoTab',
            component: () => import('./invoiceDetailInfoTab.vue'),
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
      default: 'router'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    handlePreCallback(result) {
      if (result.length > 0) {
        this.selectCallback(result)
      } else {
        this.$notify(notifyError({ msg: this.$t('invoice.foreignInvoiceReceive.msg.postNoData') }))
      }
    },
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

    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 入库单弹框选择关闭
    selectCallback(params) {
      if (params) {
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForeignDetailDtoList[0].$refs.tab.tableData
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        const lotInfo = params[0].lot
        editForm.lotNo = lotInfo.lotNo
        editForm.customerNo = lotInfo.supplierCodeList[0]
        editForm.customerName = lotInfo.supplierNameList[0]
        for (let i = 0; i < params.length; i++) {
          if (params[i].lotNo !== lotInfo.lotNo) {
            this.$notify(notifyInfo({ msg: this.$t('invoice.foreignInvoiceMake.msg.chooseLotProduct') }))
            return
          }
          params[i].lotProductDetailCode = params[i].productDetailNo
          params[i].id = null
          params[i].versionNum = null
        }

        const newData = []
        for (let i = 0; i < productList.length; i++) {
          if (productList[i].lotNo === lotInfo.lotNo) {
            newData.push(productList[i])
          }
        }

        for (let i = 0; i < params.length; i++) {
          newData.push(params[i])
        }

        productList.splice(0)
        for (let i = 0; i < newData.length; i++) {
          productList.push(newData[i])
        }

        // 商品费用相关列禁用
        const tableCols = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForeignDetailDtoList[0].$refs.tab.tableCols
        if (editForm.invoiceType === 'P' || editForm.invoiceType === 'F') {
          tableCols.forEach(col => {
            // 修改为隐藏了
            if (['prevInvoiceAmount', 'diffAmount'].includes(col.prop)) {
              col.isShow = false
            }
          })
        }
      }
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.invoiceForeignNo // 变量值
      }
    },
    initDialogChoose() {
      return {
        initSearch: true
      }
    },
    async resetOptions(param) {
      const supplierList = []
      if (param) {
        param.supplierCodeList.forEach((s, index) => {
          supplierList.push({
            code: s,
            name: param.supplierNameList[index]
          })
        })
      } else {
        // 传空时base select 会默认处理
      }
      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'customerNo') {
          f.list = supplierList
        }
      })
    },
    initCallback(param) {
      if (param.lotNo) {
        request({
          url: '/api/contract/plInfo/get',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: param.lotNo
          }
        }).then(response => {
          if (response.data) {
            const lotInfo = response.data
            this.resetOptions(lotInfo)
          }
        })
      }
    }
  }
}
</script>
