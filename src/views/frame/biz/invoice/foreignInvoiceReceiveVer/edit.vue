<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'foreignInvoiceReceiveVerEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/invoice/invoiceForReceiveVer/get',
          save: '/api/invoice/invoiceForReceiveVer/save',
          update: '/api/invoice/invoiceForReceiveVer/update'
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
            name: 'biz.btn.print',
            getParam(data) {
              return {
                receiveVerificatNo: data.uk || data.receiveVerificatNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectInvoiceForReceive',
            isShow: ['add'],
            event: 'set',
            component: () => import('../invoiceDialog/foreignReceiveDetailDialog.vue'),
            initChoose: this.selectForeignReceiveDetailInitChoose,
            callback: this.selectForeignReceiveDetailCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'invoice.foreignInvoiceReceiveVer.group.editPart1',
            content: [
              // 单据号
              {
                label: 'invoice.foreignInvoiceReceiveVer.form.receiveVerificatNo',
                prop: 'receiveVerificatNo',
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
                label: 'invoice.foreignInvoiceReceiveVer.form.verificatDate',
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
              // 供应商
              {
                label: 'invoice.foreignInvoiceReceiveVer.form.customerNo',
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
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  filterable: true,
                  disabled: true,
                  clearable: true
                }
              },
              // 采购批次
              {
                label: 'invoice.foreignInvoiceReceiveVer.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  filterable: true,
                  disabled: true,
                  clearable: true
                }
              },
              // 发票号
              {
                label: 'invoice.foreignInvoiceReceiveVer.form.invoiceNo',
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
              // 核销金额
              {
                label: 'invoice.foreignInvoiceReceiveVer.form.includeTaxAmount',
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
                label: 'invoice.foreignInvoiceReceiveVer.form.currency',
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
                  evn: this.onBizOrganCodeChange
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

        tables: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'invoiceForReVerJoDeDtoList',
            label: 'invoice.foreignInvoiceReceiveVer.tab.receiveVerJoinDetailInfoTab',
            component: () => import('./receiveVerJoinDetailInfoTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'invoiceForReVerDeDtoList',
            label: 'invoice.foreignInvoiceReceiveVer.tab.receiveVerDetailInfoTab',
            component: () => import('./receiveVerDetailInfoTab.vue'),
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
    // 是否自动采番
    autoFlag() {
      const seqMode = this.$route.meta.seqMode
      if (seqMode && seqMode === '0') {
        return true
      }
      return false
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
    // 选择收票登记（外贸）后回调函数
    selectForeignReceiveDetailCallback(param) {
      let arrayLot = []
      let arrayCustomer = []
      let arrayInvoice = []
      let arrayCurrency = []
      let productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForReVerJoDeDtoList[0].$refs.tab.tableData
      if (productList != null && productList.length > 0) {
        productList.forEach(element => {
          arrayLot.push(element.lotNo)
          arrayCustomer.push(element.customerNo)
          arrayInvoice.push(element.invoiceNo)
          arrayCurrency.push(element.currency)
        })
      }
      param.forEach(element => {
        if (!arrayLot.includes(element.lotNo)) {
          arrayLot.push(element.lotNo)
        }
        if (!arrayCustomer.includes(element.customerNo)) {
          arrayCustomer.push(element.customerNo)
        }
        if (!arrayInvoice.includes(element.invoiceNo)) {
          arrayInvoice.push(element.invoiceNo)
        }
        if (!arrayCurrency.includes(element.currency)) {
          arrayCurrency.push(element.currency)
        }
      })
      if (arrayLot.length > 1) {
        this.$notify(notifyInfo({ msg: this.$t('批次需要统一') }))
        return
      }
      if (arrayCustomer.length > 1) {
        this.$notify(notifyInfo({ msg: this.$t('客户需要统一') }))
        return
      }
      if (arrayInvoice.length > 1) {
        this.$notify(notifyInfo({ msg: this.$t('发票号需要统一') }))
        return
      }
      if (arrayCurrency.length > 1) {
        this.$notify(notifyInfo({ msg: this.$t('币种需要统一') }))
        return
      }
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerName'] = param[0].customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['customerNo'] = param[0].customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractNo'] = param[0].contractNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['lotNo'] = param[0].lotNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['invoiceNo'] = param[0].invoiceNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param[0].currency
      let arrayStr = []
      productList.forEach(element => {
        arrayStr.push(element.invoiceForeignNo + element.invoiceForeignDetailNo)
      })
      // 先添加
      param.forEach((row, index) => {
        if (!arrayStr.includes(row.invoiceForeignNo + row.invoiceForeignDetailNo)) {
          productList.push({
            invoiceForeignNo: row.invoiceForeignNo,
            invoiceForeignDetailNo: row.invoiceForeignDetailNo,
            contractNo: row.contractNo,
            lotNo: row.lotNo,
            lotDetailNo: row.lotProductDetailCode,
            invoiceNo: row.invoiceNo,
            customerNo: row.customerNo,
            customerName: row.customerName,
            productCode: row.productCode,
            productName: row.productName,
            dryWeight: row.dryWeight,
            grossWeight: row.grossWeight,
            netWeight: row.netWeight,
            invoicePrice: row.invoicePrice,
            invoiceAmount: row.invoiceAmount,
            brand: row.brand,
            origin: row.origin,
            spec: row.spec,
            productKeyAttr01: row.productKeyAttr01,
            productKeyAttr02: row.productKeyAttr02,
            productKeyAttr03: row.productKeyAttr03,
            verificatQuantity: row.unVerificatQuantity,
            verificatAmount: (Number(row.invoicePrice) * Number(row.unVerificatQuantity)).toFixed(2),
            currency: row.currency
          })
        }
      })
    },
    selectForeignReceiveDetailInitChoose() {
      return {
        initSearch: true,
        multiple: true,
        invoiceDirection: {
          disabled: true,
          value: 'TAKE'
        }
      }
    },
    // 业务机构change事件
    onBizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearConfirmJoinDetailInfo()
      this.clearConfirmDetailInfo()
    },
    // 清空收票核销关联收票登记明细信息
    clearVerificatJoinDetailInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForReVerJoDeDtoList[0].$refs.tab.tableData = []
    },
    // 清空收票核销明细信息
    clearVerificatDetailInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.invoiceForReVerDeDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
