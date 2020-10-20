<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback' @preCallback='handlePreCallback'></qm-route-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'purchaseLotEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        isStep: true,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          pre: {
            CON_PC_INFO: '/api/contract/pcInfo/get'
          },
          view: '/api/contract/plInfo/get',
          save: '/api/contract/plInfo/save',
          update: this.getUpdateApi(this.$route.params.type || this.opType)
        },
        apiData: {
          pre(param) {
            return param.preBillNo
          },
          view(param) {
            return param.uk || param.lotNo
          },
          step(param) {
            return {
              billNo: param.uk || param.lotNo
            }
          },
          save(param) {
            return param
          },
          update(param) {
            return param
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
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'copy', 'assist', 'audit']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update', 'copy'],
            attrs: {
              type: 'primary'
            },
            extraEvent: this.beforeSaveCheck
          },
          {
            // 合同选择
            iconName: '线性-选择文件',
            name: 'spot.contractLot.btn.contractSelect',
            isShow: ['add'],
            event: 'set',
            component: () => import('../components/chooseContractProductPc.vue'), // 组件
            callback: this.closeLv2Dialog // 关闭弹窗回调
          },
          {
            iconName: '线性-复制',
            name: 'biz.btn.copy',
            permitName: ['copy'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.viewCopy
          },
          {
            iconName: '线性-修改',
            name: 'biz.btn.update',
            permitName: ['update'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.viewUpdate
          },
          {
            iconName: '线性-删除',
            name: 'biz.btn.delete',
            permitName: ['remove'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.viewRemove
          },
          {
            iconName: '线性-变更',
            name: 'biz.btn.change',
            permitName: ['modify'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.openModifyAdd
          },
          {
            iconName: '线性-历史版本',
            name: 'biz.btn.modifyHistory',
            permitName: ['modifyHistory'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.doHistory
          },
          {
            permitName: ['goodFinish'],
            iconName: '线性-完结',
            name: 'spot.contractLot.btn.goodFinish',
            isShow: this.$route.params.uk ? [] : ['view'],
            $refs: this.$refs,
            event: this.goodFinish
          },
          {
            permitName: ['fundFinish'],
            iconName: '线性-完结',
            name: 'spot.contractLot.btn.fundFinish',
            isShow: this.$route.params.uk ? [] : ['view'],
            $refs: this.$refs,
            event: this.fundFinish
          },
          {
            permitName: ['invoFinish'],
            iconName: '线性-完结',
            name: 'spot.contractLot.btn.invoFinish',
            isShow: this.$route.params.uk ? [] : ['view'],
            $refs: this.$refs,
            event: this.invoFinish
          },
          {
            permitName: ['finish'],
            iconName: '线性-完结',
            name: 'biz.btn.finish',
            isShow: this.$route.params.uk ? [] : ['view'],
            $refs: this.$refs,
            event: this.viewArchive
          },
          {
            // 卷宗查询
            iconName: '线性-查看',
            name: 'biz.btn.archiveShow',
            permitName: ['archiveShow'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.archiveShow
          },
          {
            // 审批
            iconName: '线性-审核',
            name: 'biz.btn.audit',

            $refs: this.$refs,
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

            $refs: this.$refs,
            getParam: this.getParamAuditHistory,
            isShow: ['update', 'view', 'assist', 'audit'],
            event: 'auditHistory'
          },
          {
            // 附件
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',

            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.lotNo,
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
                lotNo: data.uk || data.lotNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-查看',
            name: 'biz.btn.step',
            event: 'step',
            isShow: true
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.contractLot.group.baseInfo',
            content: [
              {
                label: 'spot.contractLot.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.tradeType',
                prop: 'tradeType',
                element: 'base-select',
                list: this.$t('datadict.tradeType'),
                // default: '3',
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.signDate',
                prop: 'signDate',
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.lotState',
                prop: 'auditStatus',
                default: '1',
                element: 'base-select',
                list: this.$t('datadict.contractStat'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.lotNo',
                prop: 'lotNo',
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
                label: 'spot.contractLot.form.contractType',
                prop: 'contractType',
                element: 'base-select',
                list: this.$t('datadict.contractType'),
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.lotLife',
                props: ['lotLifeStart', 'lotLifeEnd'],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.goodFinish',
                prop: 'goodFinishFlag',
                element: 'base-select',
                default: '0',
                list: this.$t('datadict.yesNo'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.headlineCodeList',
                prop: 'headlineCodeList',
                element: 'base-select',
                list: [],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  multiple: true,
                  cols: 2,
                  usingFlag: '1'
                }
              },
              {
                label: 'spot.contractLot.form.bizOrganCode',
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
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.fundFinish',
                prop: 'fundFinishFlag',
                element: 'base-select',
                default: '0',
                list: this.$t('datadict.yesNo'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.supplierCodeList',
                prop: 'supplierCodeList',
                element: 'base-select',
                list: [],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  cols: 2,
                  filterable: true
                },
                event: {
                  change: this.changeSupplierCodeList
                }
              },
              {
                label: 'spot.contractLot.form.bizDeptCode',
                prop: 'bizDeptCode',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                element: 'base-select',
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
                label: 'spot.contractLot.form.invoFinish',
                prop: 'invoFinishFlag',
                element: 'base-select',
                default: '0',
                list: this.$t('datadict.yesNo'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.optEmployeeName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.docMakeDt',
                prop: 'docMakeDt',
                default: toolUtil.todayStr(),
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.bizEmployeeCode',
                prop: 'bizEmployeeCode',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                element: 'base-select',
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
              }
            ]
          },
          part2: {
            titleName: 'spot.contractLot.group.tradeInfo',
            content: [
              {
                label: 'spot.contractLot.form.deliveryMode',
                prop: 'deliveryMode',
                element: 'base-select',
                list: this.$t('datadict.deliveryMode'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.settleStyle',
                prop: 'settleStyle',
                element: 'base-select',
                list: this.$t('datadict.tradeWay'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.deliveryMarketCode',
                prop: 'deliveryMarketCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_SPOT_MARKET',
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.deliveryPlace',
                prop: 'deliveryPlace',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.deliveryDate',
                props: ['deliveryDateStart', 'deliveryDateEnd'],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.transMode',
                prop: 'transMode',
                element: 'base-select',
                list: this.$t('datadict.transMode'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.costBearing',
                prop: 'costBearing',
                element: 'base-select',
                list: this.$t('datadict.costBearing'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.moreOrLess',
                prop: 'moreOrLess',
                element: 'input-formatter',
                attrs: {
                  type: 'percent',
                  disabled: true
                }
              }
            ]
          },
          part3: {
            titleName: 'spot.contractLot.group.financeInfo',
            content: [
              {
                label: 'spot.contractLot.form.currency',
                prop: 'currency',
                element: 'base-select',
                attrs: {
                  data: 'CURRENCY',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.exchangeRateType',
                prop: 'exchangeRateType',
                element: 'base-select',
                list: this.$t('datadict.exchangeRateType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.exchangeRate',
                prop: 'exchangeRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  type: 'exchangeRate'
                },
                event: {
                  change: this.exchangeRateChange
                }
              },
              {},
              {
                label: 'spot.contractLot.form.originalAmount',
                prop: 'originalAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                },
                isShow: false
              },
              {
                label: 'spot.contractLot.form.localAmount',
                prop: 'localAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                },
                isShow: false
              },
              {
                label: 'spot.contractLot.form.taxedAmount',
                prop: 'taxedAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.taxFreeAmount',
                prop: 'taxFreeAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              }
            ]
          },
          part4: {
            titleName: 'spot.contractLot.group.creditInfo',
            content: [
              {
                label: 'spot.contractLot.form.isCredit',
                prop: 'isCredit',
                element: 'el-checkbox',
                default: '0',
                attrs: {
                  trueLabel: '1',
                  falseLabel: '0',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.creditLimit',
                prop: 'creditLimit',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  type: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.creditDuration',
                prop: 'creditDuration',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  type: 'num'
                }
              }
            ]
          },
          part5: {
            titleName: 'spot.contractLot.group.marginInfo',
            content: [
              {
                label: 'spot.contractLot.form.marginLevel',
                prop: 'marginLevel',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 100,
                  type: 'percent'
                },
                event: {
                  change: this.changeMarginLevel
                }
              },
              {
                label: 'spot.contractLot.form.marginAmount',
                prop: 'marginAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  type: 'money'
                }
              }
            ]
          },
          part6: {
            titleName: 'spot.contractLot.group.remark',
            content: [
              {
                label: 'spot.contractLot.form.remark',
                prop: 'remark',
                element: 'input-validate',
                attrs: {
                  type: 'textarea',
                  cols: 4,
                  clearable: true
                }
              }
            ]
          }
        },
        tables: [
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            required: true,
            name: 'productDetailList',
            label: 'spot.contractLot.tab.productDetailList',
            component: () => import('../components/productDetailTagLot.vue')
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            required: true,
            name: 'paymentInfoList',
            label: 'spot.contractLot.tab.paymentInfoList',
            component: () => import('../components/paymentInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'feeList',
            label: 'spot.contractLot.tab.estimatedCostList',
            component: () => import('../components/estimatedCostTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'marginRuleList',
            label: 'spot.contractLot.tab.marginInfoTab',
            component: () => import('../components/marginInfoTab.vue')
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
        return {
          billType: 'pl'
        }
      }
    }
  },
  methods: {
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add' || (this.$route.params.type || this.$route.params.opType) === 'copy') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    getUpdateApi(type) {
      switch (type) {
        case 'save':
          return '/api/contract/plInfo/save'
        case 'update':
          return '/api/contract/plInfo/update'
        case 'copy':
          return '/api/contract/plInfo/save'
      }
    },
    changeSupplierCodeList(data) {
      const feeList = toolUtil.getRefTabFromEdit(this, 'feeList')
      if (feeList) {
        feeList.checkFeeType()
      }
      const marginRuleList = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
      if (marginRuleList) {
        marginRuleList.setCustCode()
      }
    },
    exchangeRateChange(val) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }

      const editForm = toolUtil.getDataEditFromSelf(this)
      const productDetailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.productDetailList[0].$refs.tab.tableData
      if (productDetailList === undefined || productDetailList.length === 0) {
        return
      }
      const exchangeRate = toolUtil.toNum(val)
      let sumOriginalAmount = 0
      let sumTaxFreeAmount = 0
      let sumTaxAmount = 0
      let sumTaxedAmount = 0
      let sumLocalAmount = 0
      for (let i = 0; i < productDetailList.length; i++) {
        const row = productDetailList[i]
        row.originalAmount = null
        row.taxFreeAmount = null
        row.taxAmount = null
        row.taxedAmount = null
        row.localAmount = null

        // 原币金额
        const measurementQuantity = toolUtil.toNum(row.measurementQuantity)
        let estimatedPrice = toolUtil.toNum(row.estimatedPrice)
        if (estimatedPrice !== null) {
          estimatedPrice = estimatedPrice + toolUtil.toNum(row.premium)
        }
        if (measurementQuantity !== null && estimatedPrice !== null) {
          row.originalAmount = measurementQuantity * estimatedPrice
          if (exchangeRate !== null) {
            row.localAmount = row.originalAmount * exchangeRate
            row.taxedAmount = row.localAmount
            const taxRate = toolUtil.toNum(row.taxRate)
            if (taxRate !== null) {
              row.taxFreeAmount = row.taxedAmount / (1 + taxRate / 100)
              row.taxAmount = row.taxedAmount - row.taxFreeAmount
            }
          }
        }

        sumOriginalAmount += toolUtil.toNum(row.originalAmount)
        sumTaxFreeAmount += toolUtil.toNum(row.taxFreeAmount)
        sumTaxAmount += toolUtil.toNum(row.taxAmount)
        sumTaxedAmount += toolUtil.toNum(row.taxedAmount)
        sumLocalAmount += toolUtil.toNum(row.localAmount)
      }
      editForm.originalAmount = sumOriginalAmount
      editForm.taxFreeAmount = sumTaxFreeAmount
      editForm.taxAmount = sumTaxAmount
      editForm.taxedAmount = sumTaxedAmount
      editForm.localAmount = sumLocalAmount
    },
    changeMarginLevel(marginLevel) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const editForm = toolUtil.getDataEditFromSelf(this)
      const originalAmount = toolUtil.toNum(editForm.originalAmount)
      if (originalAmount === null) {
        editForm.marginAmount = null
      } else {
        editForm.marginAmount = (originalAmount * toolUtil.toNum(marginLevel)) / 100
      }
    },
    handleCloseDialog(param) {
      this.closePage(param)
    },
    closeLv2Dialog(param) {
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.productDetailList[0].$refs.tab.tableData
      const paymentInfoList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.paymentInfoList[0].$refs.tab.tableData
      const feeList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeList[0].$refs.tab.tableData
      const headlineCodeList = this.getFormItemByProp('headlineCodeList')
      const supplierCodeList = this.getFormItemByProp('supplierCodeList')

      const editForm = toolUtil.getDataEditFromSelf(this)
      const contract = param[0].contract
      for (let i = 0; i < param.length; i++) {
        if (param[i].contractNo !== contract.contractNo) {
          this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.chooseContractProduct') }))
          return
        }
      }

      const marginRuleList = toolUtil.getDataTabFromEdit(this, 'marginRuleList')
      this.loadSubMarginList({ billType: 'CON_PC_INFO', billNo: contract.contractNo }, marginRuleList, '/api/contract/conMarginRule/getByContractNo')

      feeList.splice(0)
      paymentInfoList.splice(0)
      headlineCodeList.list.splice(0)
      supplierCodeList.list.splice(0)
      productList.splice(0)
      const exchangeRate = toolUtil.toNum(contract.exchangeRate)
      for (let i = 0; i < param.length; i++) {
        param[i].contract = null
        param[i].contractProductDetailNo = param[i].productDetailNo
        param[i].productDetailNo = 'TEMP-' + toolUtil.uuid()
        param[i].productQuantity = param[i].rmnPrdQty
        param[i].measurementQuantity = param[i].rmnMemQty

        param[i].originalAmount = null
        param[i].taxFreeAmount = null
        param[i].taxAmount = null
        param[i].taxedAmount = null
        param[i].localAmount = null
        const measurementQuantity = toolUtil.toNum(param[i].measurementQuantity)
        let estimatedPrice = toolUtil.toNum(param[i].estimatedPrice)
        if (estimatedPrice !== null) {
          estimatedPrice = estimatedPrice + toolUtil.toNum(param[i].premium)
        }
        if (measurementQuantity !== null && estimatedPrice !== null) {
          param[i].originalAmount = measurementQuantity * estimatedPrice
          if (exchangeRate !== null) {
            param[i].localAmount = param[i].originalAmount * exchangeRate
            param[i].taxedAmount = param[i].localAmount
            const taxRate = toolUtil.toNum(param[i].taxRate)
            if (taxRate !== null) {
              param[i].taxFreeAmount = param[i].taxedAmount / (1 + taxRate / 100)
              param[i].taxAmount = param[i].taxedAmount - param[i].taxFreeAmount
            }
          }
        }

        if (Array.isArray(param[i].feeList)) {
          const prdFeeList = param[i].feeList
          for (let j = 0; j < prdFeeList.length; j++) {
            const prdFee = prdFeeList[j]
            prdFee.productDetailNo = param[i].productDetailNo
            feeList.push(prdFee)
          }
        }
      }

      for (let i = 0; i < contract.headlineCodeList.length; i++) {
        headlineCodeList.list.push({
          key: contract.headlineCodeList[i],
          value: contract.headlineCodeList[i],
          label: contract.headlineNameList[i]
        })
      }
      for (let i = 0; i < contract.supplierCodeList.length; i++) {
        supplierCodeList.list.push({
          key: contract.supplierCodeList[i],
          value: contract.supplierCodeList[i],
          label: contract.supplierNameList[i]
        })
      }

      const newData = []
      for (let i = 0; i < productList.length; i++) {
        if (productList[i].contractNo === contract.contractNo) {
          newData.push(productList[i])
        }
      }
      for (let i = 0; i < param.length; i++) {
        newData.push(param[i])
      }

      for (let i = 0; i < newData.length; i++) {
        productList.push(newData[i])
      }
      for (const k in editForm) {
        if (k === 'optOrganCode' || k === 'optOrganName' || k === 'optDeptCode' || k === 'optDeptName' || k === 'optEmployeeCode' || k === 'optEmployeeName' || k === 'bizOrganCode' || k === 'bizOrganName' || k === 'bizDeptCode' || k === 'bizDeptName' || k === 'bizEmployeeCode' || k === 'bizEmployeeName' || k === 'auditStatus' || k === 'remark' || k === 'baseBillType' || k === 'baseModuleCode' || k === 'adviceType' || k === 'operateType' || k === 'fleAttachment') {
          continue
        }
        editForm[k] = contract[k]
      }
      editForm.deliveryDate = [contract.deliveryDateStart, contract.deliveryDateEnd]
      this.changeTradeType(contract.tradeType)
      this.changeIsCredit(contract.isCredit)
      toolUtil.getRefTabFromEdit(this, 'feeList').checkFeeType()

      let sumOriginalAmount = 0
      let sumTaxFreeAmount = 0
      let sumTaxAmount = 0
      let sumTaxedAmount = 0
      let sumLocalAmount = 0
      for (let i = 0; i < productList.length; i++) {
        const row = productList[i]
        sumOriginalAmount += toolUtil.toNum(row.originalAmount)
        sumTaxFreeAmount += toolUtil.toNum(row.taxFreeAmount)
        sumTaxAmount += toolUtil.toNum(row.taxAmount)
        sumTaxedAmount += toolUtil.toNum(row.taxedAmount)
        sumLocalAmount += toolUtil.toNum(row.localAmount)
      }
      editForm.originalAmount = sumOriginalAmount
      editForm.taxFreeAmount = sumTaxFreeAmount
      editForm.taxAmount = sumTaxAmount
      editForm.taxedAmount = sumTaxedAmount
      editForm.localAmount = sumLocalAmount
      editForm.marginAmount = (sumOriginalAmount * toolUtil.toNum(editForm.marginLevel)) / 100
      if (Array.isArray(contract.paymentInfoList)) {
        for (let i = 0; i < contract.paymentInfoList.length; i++) {
          paymentInfoList.push(contract.paymentInfoList[i])
        }
      }
    },
    loadSubMarginList(contractNo, subList, api) {
      subList.splice(0)
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contractNo
        }
      }).then(response => {
        if (response.data) {
          if (response.data.length > 0) {
            const productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
            const productCodeMap = []
            for (let i = 0; i < productDetailList.length; i++) {
              productCodeMap.push(productDetailList[i].productCode)
            }
            for (let i = 0; i < response.data.length; i++) {
              if (productCodeMap.includes(response.data[i].productCode)) {
                response.data[i].id = null
                subList.push(response.data[i])
                //赋值給收付状态和代收服务商
                if (i === 0) {
                  const marginRuleListTab = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
                  marginRuleListTab.handleInitCallback(response.data)
                }
              }
            }
          }
        }
      })
    },
    changeTradeType(val) {
      if (val === '3') {
        toolUtil.getDefFormItemByProp(this, 'exchangeRate').attrs.disabled = true

        toolUtil.getDefFormItemByProp(this, 'originalAmount').isShow = false
        toolUtil.getDefFormItemByProp(this, 'localAmount').isShow = false
        toolUtil.getDefFormItemByProp(this, 'taxedAmount').isShow = true
        toolUtil.getDefFormItemByProp(this, 'taxFreeAmount').isShow = true

        toolUtil.getDefTableColByProp(this, 'productDetailList', 'originalAmount').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'localAmount').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxRate').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxFreeAmount').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxedAmount').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxAmount').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxRate').required = true
      } else {
        toolUtil.getDefFormItemByProp(this, 'exchangeRate').attrs.disabled = this.edit.type !== 'add' && this.edit.type !== 'update' && this.edit.type !== 'copy'

        toolUtil.getDefFormItemByProp(this, 'originalAmount').isShow = true
        toolUtil.getDefFormItemByProp(this, 'localAmount').isShow = true
        toolUtil.getDefFormItemByProp(this, 'taxedAmount').isShow = false
        toolUtil.getDefFormItemByProp(this, 'taxFreeAmount').isShow = false

        toolUtil.getDefTableColByProp(this, 'productDetailList', 'originalAmount').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'localAmount').isShow = true
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxRate').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxFreeAmount').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxedAmount').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxAmount').isShow = false
        toolUtil.getDefTableColByProp(this, 'productDetailList', 'taxRate').required = false
      }
    },
    viewUpdate() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.gotoPage('purchaseLotUpdate', {
        type: 'update',
        lotNo: editForm.lotNo
      })
    },
    viewCopy() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('purchaseLotCopy', {
        type: 'copy',
        lotNo: editForm.lotNo
      })
    },
    viewRemove() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.removeAuditCheck') }))
        return
      }
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          request({
            url: '/api/contract/plInfo/remove',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: editForm.lotNo
            }
          }).then(response => {
            if (response.status) {
              this.closePage(true)
            }
          })
        })
        .catch(() => {})
    },
    openModifyAdd() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.changeAuditCheck') }))
        return
      }
      request({
        url: '/api/contract/plInfo/checkChangeAble',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: editForm.lotNo
        }
      }).then(response => {
        if (response.status) {
          this.openPage('purchaseLotChangeAdd', {
            type: 'add',
            lotNo: editForm.lotNo
          })
        }
      })
    },
    viewArchive() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.achiveAuditCheck') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.closeLotConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/plInfo/achive',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: editForm.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.closePage(true)
          }
        })
      })
    },
    goodFinish() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (editForm.goodFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotGoodFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotGoodFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/plInfo/goodFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: editForm.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.closePage(true)
          }
        })
      })
    },
    fundFinish() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (editForm.fundFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotFundFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotFundFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/plInfo/fundFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: editForm.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.closePage(true)
          }
        })
      })
    },
    invoFinish() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (editForm.invoFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotInvoFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotInvoFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/plInfo/invoFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: editForm.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.closePage(true)
          }
        })
      })
    },
    doHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('purchaseLotHistory', {
        lotNo: editForm.lotNo
      })
    },
    archiveShow() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('conRelationBill', {
        billType: 'CON_PL_INFO',
        billNo: editForm.lotNo
      })
    },
    getFormItemByProp(prop) {
      for (const partName in this.edit.formData) {
        const content = this.edit.formData[partName].content
        for (let j = 0; j < content.length; j++) {
          if (content[j].prop === prop) {
            return content[j]
          }
        }
      }
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.lotNo // 变量值
      }
    },
    initCallback(data) {
      const headlineCodeList = this.getFormItemByProp('headlineCodeList')
      const supplierCodeList = this.getFormItemByProp('supplierCodeList')
      headlineCodeList.list.splice(0)
      supplierCodeList.list.splice(0)
      if (this.edit.param.type === 'update') {
        request({
          url: '/api/contract/pcHeadline/listByContractNo',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: data.contractNo
          }
        }).then(response => {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              headlineCodeList.list.push({
                key: response.data[i].headlineCode,
                value: response.data[i].headlineCode,
                label: response.data[i].headlineName
              })
            }
          }
        })
        request({
          url: '/api/contract/pcSupplier/listByContractNo',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: data.contractNo
          }
        }).then(response => {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              supplierCodeList.list.push({
                key: response.data[i].supplierCode,
                value: response.data[i].supplierCode,
                label: response.data[i].supplierName
              })
            }
          }
        })
      } else {
        for (let i = 0; i < data.headlineCodeList.length; i++) {
          headlineCodeList.list.push({
            key: data.headlineCodeList[i],
            value: data.headlineCodeList[i],
            label: data.headlineNameList[i]
          })
        }
        for (let i = 0; i < data.supplierCodeList.length; i++) {
          supplierCodeList.list.push({
            key: data.supplierCodeList[i],
            value: data.supplierCodeList[i],
            label: data.supplierNameList[i]
          })
        }
      }
      this.changeTradeType(data.tradeType)
      this.changeIsCredit(data.isCredit)
      if (this.edit.param.type === 'copy') {
        data.lotNo = null
        data.docMakeDt = toolUtil.todayStr()
      }
    },
    changeIsCredit(isCredit) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (isCredit === '1') {
        toolUtil.getDefFormItemByProp(this, 'creditLimit').attrs.disabled = this.edit.type !== 'add' && this.edit.type !== 'update' && this.edit.type !== 'copy'
        toolUtil.getDefFormItemByProp(this, 'creditDuration').attrs.disabled = this.edit.type !== 'add' && this.edit.type !== 'update' && this.edit.type !== 'copy'
      } else {
        toolUtil.getDefFormItemByProp(this, 'creditLimit').attrs.disabled = true
        toolUtil.getDefFormItemByProp(this, 'creditDuration').attrs.disabled = true
        editForm.creditLimit = null
        editForm.creditDuration = null
      }
    },
    closePage(param) {
      let backName = 'purchaseLot'
      if (param) {
      } else if (this.$route.params.back) {
        backName = this.$route.params.back
      }
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: Object.assign({}, this.$route.params.backParam, { refresh: !!param })
        })
      })
    },
    gotoPage(pageName, pageParam) {
      const params = {}
      if (pageParam) {
        Object.assign(params, pageParam)
      }
      params.back = this.$route.params.back
      params.backParam = this.$route.params.backParam
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: pageName,
          params: params
        })
      })
    },
    openPage(pageName, pageParam) {
      const params = {}
      if (pageParam) {
        Object.assign(params, pageParam)
      }
      params.back = this.$route.name
      params.backParam = this.$route.params
      this.$router.push({
        name: pageName,
        params: params
      })
    },
    handlePreCallback(contract) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const headlineCodeList = this.getFormItemByProp('headlineCodeList')
      const supplierCodeList = this.getFormItemByProp('supplierCodeList')
      for (let i = 0; i < contract.headlineCodeList.length; i++) {
        headlineCodeList.list.push({
          key: contract.headlineCodeList[i],
          value: contract.headlineCodeList[i],
          label: contract.headlineNameList[i]
        })
      }
      for (let i = 0; i < contract.supplierCodeList.length; i++) {
        supplierCodeList.list.push({
          key: contract.supplierCodeList[i],
          value: contract.supplierCodeList[i],
          label: contract.supplierNameList[i]
        })
      }
      for (const k in editForm) {
        if (k == 'supplierCodeList' || k === 'optOrganCode' || k === 'optOrganName' || k === 'optDeptCode' || k === 'optDeptName' || k === 'optEmployeeCode' || k === 'optEmployeeName' || k === 'bizOrganCode' || k === 'bizOrganName' || k === 'bizDeptCode' || k === 'bizDeptName' || k === 'bizEmployeeCode' || k === 'bizEmployeeName' || k === 'auditStatus' || k === 'remark' || k === 'baseBillType' || k === 'baseModuleCode' || k === 'adviceType' || k === 'operateType' || k === 'fleAttachment') {
          continue
        }
        editForm[k] = contract[k]
      }
      if (contract.supplierCodeList.length > 0) {
        editForm.supplierCodeList = contract.supplierCodeList[0]
      }
      this.changeTradeType(contract.tradeType)

      request({
        url: '/api/contract/pcProductDetail/listByContractNo',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contract.contractNo
        }
      }).then(response => {
        if (response.data) {
          if (response.data.length > 0) {
            const productDetailListTab = toolUtil.getRefTabFromEdit(this, 'productDetailList')
            productDetailListTab.handleClose(response.data)
          }
        }
      })

      request({
        url: '/api/contract/pcPaymentInfo/listByContractNo',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contract.contractNo
        }
      }).then(response => {
        if (response.data) {
          const paymentInfoList = toolUtil.getDataTabFromEdit(this, 'paymentInfoList')
          for (let i = 0; i < response.data.length; i++) {
            paymentInfoList.push(response.data[i])
          }
        }
      })

      request({
        url: '/api/contract/conMarginRule/getByContractNo',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            billType: 'CON_PC_INFO',
            billNo: contract.contractNo
          }
        }
      }).then(response => {
        if (response.data) {
          const marginRuleList = toolUtil.getDataTabFromEdit(this, 'marginRuleList')
          const marginRuleListRef = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
          for (let i = 0; i < response.data.length; i++) {
            marginRuleList.push(response.data[i])
          }
          marginRuleListRef.handleInitCallback(response.data)
        }
      })
    },
    async beforeSaveCheck() {
      // 保证金监控
      const marginRuleList = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
      if (marginRuleList) {
        if (!marginRuleList.checkSaveData()) {
          return false
        }
      }
      return true
    }
  }
}
</script>

