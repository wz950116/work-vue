<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-route-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import messageUtil from '@/utils/frame/base/messageUtil.js'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import contractUtil from '@/views/frame/biz/spot/util/contractUtil.js'
export default {
  name: 'domesticSalesContractChangeEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/domesticContract/sccInfo/get',
          save: '/api/domesticContract/sccInfo/save',
          update: '/api/domesticContract/sccInfo/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.changeNo
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
            isShow: ['add', 'update', 'assist', 'audit']
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
            },
            extraEvent: this.beforeSaveCheck
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.contractSelect',
            isShow: ['add'],
            event: 'set',
            component: () => import('../../components/chooseContractInfoSc.vue'), // 组件
            callback: this.closeLv2Dialog // 关闭弹窗回调
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
                billNo: data.uk || data.changeNo,
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
                changeNo: data.uk || data.changeNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            // 电子合同
            iconName: '线性-附件',
            name: 'spot.contractLot.btn.electronContract',
            permitName: ['eContract'],
            $refs: this.$refs,
            event: 'set',
            component: () => import('@/views/frame/base/sys/template/disp.vue'),
            initChoose: this.contractTempInit,
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            // 效益测算
            iconName: '线性-附件',
            name: 'spot.contractLot.btn.profitCalc',
            permitName: ['profitCalc'],
            $refs: this.$refs,
            event: 'set',
            component: () => import('../../profit/index'),
            initChoose: this.profitInit,
            isShow: ['add', 'update', 'view', 'assist', 'audit']
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
                label: 'spot.contractLot.form.externalFlag',
                prop: 'externalFlag',
                element: 'input-validate',
                isShow: false
              },
              {
                label: 'spot.contractLot.form.tradeType',
                prop: 'tradeType',
                element: 'base-select',
                list: this.$t('datadict.tradeType'),
                default: '3',
                attrs: {
                  disabled: true
                },
                isShow: false
              },
              {
                //计划生效日期
                type: 'date',
                label: 'spot.contractLot.form.effectiveDate',
                prop: 'effectiveDate',
                default: toolUtil.todayStr(),
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
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
                label: 'spot.contractLot.form.changeNo',
                prop: 'changeNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.headlineNames',
                prop: 'headlineNames',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.signDate',
                prop: 'signDate',
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.isHedging',
                prop: 'isHedging',
                element: 'el-checkbox',
                default: '0',
                attrs: {
                  trueLabel: '1',
                  falseLabel: '0',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.customerNames',
                prop: 'customerNames',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.contractDocNo',
                prop: 'contractDocNo',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.isReverse',
                prop: 'isReverse',
                element: 'el-checkbox',
                default: '0',
                attrs: {
                  trueLabel: '1',
                  falseLabel: '0',
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.contractLife',
                props: ['contractLifeStart', 'contractLifeEnd'],
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.contractBizType',
                prop: 'contractBizType',
                element: 'base-select',
                list: this.$t('datadict.dfContractBizType'),
                attrs: {
                  clearable: true
                },
                validate: [
                  {
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'spot.contractLot.form.bizOrganCode',
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
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.bizDeptCode',
                prop: 'bizDeptCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_DEPT',
                  clearable: true
                }
              },
              {
                label: 'spot.contractLot.form.whSource',
                prop: 'whType',
                element: 'base-select',
                list: this.$t('datadict.distributionSrc')
              },
              {
                label: 'spot.contractLot.form.bizEmployeeCode',
                prop: 'bizEmployeeCode',
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
              },
              {
                label: 'spot.contractLot.form.optEmployeeName',
                prop: 'srcOptEmployeeName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.docMakeDt',
                prop: 'docMakeDt',
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              }
            ]
          },
          part2: {
            titleName: 'spot.contractLot.group.changeInfo',
            content: [
              {
                label: 'spot.contractLot.form.changOptEmployeeName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.changeDt',
                prop: 'changeDt',
                type: 'date',
                default: toolUtil.todayStr(),
                attrs: {
                  format: 'yyyy-MM-dd',
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.changeStat',
                prop: 'auditStatus',
                default: '1',
                element: 'base-select',
                list: this.$t('datadict.auditStatus'),
                attrs: {
                  disabled: true
                }
              },
              {},
              {
                label: 'spot.contractLot.form.changeReason',
                prop: 'changeReason',
                element: 'el-input',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  cols: 2,
                  clearable: true
                }
              }
            ]
          },
          part3: {
            titleName: 'spot.contractLot.group.tradeInfo',
            content: [
              {
                label: 'spot.contractLot.form.tradeWay',
                prop: 'deliveryMode',
                element: 'base-select',
                list: this.$t('datadict.domesticDeliveryMode'),
                attrs: {
                  disabled: false
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
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
                attrs: {
                  clearable: true
                }
              },
              // 溢短装范围(%)*
              {
                type: 'numberInterval',
                label: 'spot.contractLot.form.moreOrLess',
                props: ['moreOrLessStart', 'moreOrLessEnd'],
                attrs: {
                  startMin: -999999999999.99,
                  startMax: 0,
                  endMin: 0,
                  endMax: 999999999999.99,
                  type: 'thousands',
                  precision: 3
                }
              }
            ]
          },
          part4: {
            titleName: 'spot.contractLot.group.financeInfo',
            content: [
              // 币种
              {
                label: 'spot.contractLot.form.currency',
                prop: 'currency',
                element: 'base-select',
                default: 'CNY',
                attrs: {
                  data: 'CURRENCY',
                  disabled: true
                }
              },
              // 汇率类型(隐藏)
              {
                label: 'spot.contractLot.form.exchangeRateType',
                prop: 'exchangeRateType',
                element: 'base-select',
                list: this.$t('datadict.exchangeRateType'),
                default: '1',
                isShow: false
              },
              // 汇率(隐藏)
              {
                label: 'spot.contractLot.form.exchangeRate',
                prop: 'exchangeRate',
                element: 'input-formatter',
                default: 1,
                attrs: {
                  type: 'exchangeRate'
                },
                isShow: false
              },
              // 原币金额(隐藏)
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
              // 本币金额(隐藏)
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
              // 含税金额
              {
                label: 'spot.contractLot.form.taxedAmount',
                prop: 'taxedAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              // 无税金额
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
          part5: {
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
                },
                event: {
                  change: this.changeIsCredit
                }
              },
              {
                label: 'spot.contractLot.form.creditLimit',
                prop: 'creditLimit',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.creditDuration',
                prop: 'creditDuration',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 999999999999,
                  type: 'num'
                }
              }
            ]
          },
          part6: {
            titleName: 'spot.contractLot.group.marginInfo',
            content: [
              {
                label: 'spot.contractLot.form.marginLevel',
                prop: 'marginLevel',
                default: '0',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'percent'
                },
                event: {
                  userChange: this.changeMarginLevel
                }
              },
              {
                label: 'spot.contractLot.form.marginAmount',
                prop: 'marginAmount',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              }
            ]
          },
          part7: {
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
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            required: true,
            name: 'productDetailList',
            label: 'spot.contractLot.tab.productDetailList',
            component: () => import('../../components/productDetailTag.vue')
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'distributionList',
            label: 'spot.contractLot.tab.distributionList',
            component: () => import('../../components/distributionInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'pricingInfoList',
            label: 'spot.contractLot.tab.pricingInfoList',
            component: () => import('../../components/pricingInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'deliveryPlanList',
            label: 'spot.contractLot.tab.deliveryPlanList',
            component: () => import('../../components/deliveryPlanTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'relatedList',
            label: 'spot.contractLot.tab.relatedPcList',
            component: () => import('../../components/relatedContractTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'paymentPlanList',
            label: 'spot.contractLot.tab.paymentPlanList',
            component: () => import('../../components/paymentPlanTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            required: true,
            name: 'paymentInfoList',
            label: 'spot.contractLot.tab.paymentInfoList',
            component: () => import('../../components/paymentInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'feeList',
            label: 'spot.contractLot.tab.estimatedCostList',
            component: () => import('../../components/estimatedCostTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'marginRuleList',
            label: 'spot.contractLot.tab.marginInfoTab',
            component: () => import('../../components/marginInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'clauseInfoList',
            label: 'spot.contractLot.tab.clauseInfoList',
            component: () => import('../../components/clauseInfoTab.vue')
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
          billType: 'dscc'
        }
      }
    }
  },
  mounted() {
    if (this.$route.params.type === 'add' && this.$route.params.contractNo !== undefined && this.$route.params.contractNo !== null && this.$route.params.contractNo !== '') {
      const contractNo = this.$route.params.contractNo
      this.loadFromContract(contractNo)
    }
  },
  methods: {
    changeMarginLevel(val) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const marginLevel = toolUtil.toNum(editForm.marginLevel)
      const originalAmount = toolUtil.toNum(editForm.originalAmount)
      if (marginLevel !== null && originalAmount !== null) {
        editForm.marginAmount = (originalAmount / 100) * marginLevel
      } else {
        editForm.marginAmount = null
      }
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
    handleCloseDialog(param) {
      this.closePage(param)
    },
    loadFromContract(contractNo) {
      request({
        url: '/api/domesticContract/scInfo/get',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contractNo
        }
      }).then(response => {
        if (response.data) {
          const contractInfo = toolUtil.getDataEditFromSelf(this)
          const param = response.data
          contractInfo.srcOptOrganCode = param.optOrganCode
          contractInfo.srcOptOrganName = param.optOrganName
          contractInfo.srcOptDeptCode = param.optDeptCode
          contractInfo.srcOptDeptName = param.optDeptName
          contractInfo.srcOptEmployeeCode = param.optEmployeeCode
          contractInfo.srcOptEmployeeName = param.optEmployeeName
          for (const k in contractInfo) {
            if (k === 'optOrganCode' || k === 'optOrganName' || k === 'optDeptCode' || k === 'optDeptName' || k === 'optEmployeeCode' || k === 'optEmployeeName' || k === 'srcOptOrganCode' || k === 'srcOptOrganName' || k === 'srcOptDeptCode' || k === 'srcOptDeptName' || k === 'srcOptEmployeeCode' || k === 'srcOptEmployeeName' || k === 'changeDt' || k === 'auditStatus' || k === 'changeReason') {
              continue
            }
            contractInfo[k] = param[k]
          }

          contractInfo.baseBillType = this.$route.meta.bizCode
          contractInfo.baseModuleCode = this.$route.meta.bpmModule
          contractInfo.headlineCodeList = param.headlineCodeList
          contractInfo.customerCodeList = param.customerCodeList
          contractInfo.contractLife = [contractInfo.contractLifeStart, contractInfo.contractLifeEnd]
          contractInfo.deliveryDate = [contractInfo.deliveryDateStart, contractInfo.deliveryDateEnd]
          contractInfo.id = null
          this.changeIsCredit(contractInfo.isCredit)
          const feeList = toolUtil.getRefTabFromEdit(this, 'feeList')
          feeList.checkFeeType()
        }
      })
    },
    closeLv2Dialog(param) {
      if (Array.isArray(param)) {
        param = param[0]
      }
      // 配货信息
      const distributionList = toolUtil.getDataTabFromEdit(this, 'distributionList')
      // 付款计划
      const paymentPlanList = toolUtil.getDataTabFromEdit(this, 'paymentPlanList')

      const productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      const pricingInfoList = toolUtil.getDataTabFromEdit(this, 'pricingInfoList')
      const deliveryPlanList = toolUtil.getDataTabFromEdit(this, 'deliveryPlanList')
      const paymentInfoList = toolUtil.getDataTabFromEdit(this, 'paymentInfoList')
      const relatedList = toolUtil.getDataTabFromEdit(this, 'relatedList')
      const clauseInfoList = toolUtil.getDataTabFromEdit(this, 'clauseInfoList')
      const feeList = toolUtil.getDataTabFromEdit(this, 'feeList')
      const marginRuleList = toolUtil.getDataTabFromEdit(this, 'marginRuleList')
      this.loadFromContract(param.contractNo)
      this.loadSubList(param.contractNo, productDetailList, '/api/contract/scProductDetail/listByContractNo')
      this.loadSubList({ contractNo: param.contractNo, purchaseOrSale: 'S' }, pricingInfoList, '/api/pricingRule/listByContract')
      this.loadSubList(param.contractNo, deliveryPlanList, '/api/contract/scDeliveryPlan/listByContractNo')
      this.loadSubList(param.contractNo, paymentInfoList, '/api/contract/scPaymentInfo/listByContractNo')
      this.loadSubList(param.contractNo, relatedList, '/api/contract/scRelatedPc/listByContractNo')
      this.loadSubList(param.contractNo, clauseInfoList, '/api/contract/scClauseInfo/listByContractNo')
      this.loadSubList(param.contractNo, feeList, '/api/contract/scEstimatedCost/listByContractNo')
      // 赋值配货信息
      this.loadSubMarginList({ purchaseOrSale: 'S', contractNo: param.contractNo }, distributionList, '/api/contract/whSaleContract/listByContract')
      // 赋值付款计划
      this.loadSubList(param.contractNo, paymentPlanList, '/api/contract/scPaymentPlan/listByContractNo')
      this.loadSubMarginList({ billType: 'DOM_CON_SC_INFO', billNo: param.contractNo }, marginRuleList, '/api/contract/conMarginRule/getByContractNo')

      const editForm = toolUtil.getDataEditFromSelf(this)
      setTimeout(() => {
        this.$set(editForm, 'baseBillType', this.$route.meta.bizCode)
        this.$set(editForm, 'baseModuleCode', this.$route.meta.bpmModule)
      }, 1000)
    },
    loadSubList(contractNo, subList, api) {
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
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].id = null
            subList.push(response.data[i])
          }
        }
      })
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
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].id = null
            subList.push(response.data[i])
            //赋值給收付状态和代收服务商
            if (i === 0) {
              const productDetailListTab = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
              productDetailListTab.handleInitCallback(response.data)
            }
          }
        }
      })
    },
    viewUpdate() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.gotoPage('salesContractChangeUpdate', {
        type: 'update',
        changeNo: editForm.changeNo
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
            url: '/api/domesticContract/sccInfo/remove',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: editForm.changeNo
            }
          }).then(response => {
            if (response.status) {
              this.closePage(true)
            }
          })
        })
        .catch(() => {})
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.changeNo // 变量值
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
    initCallback(data) {
      this.changeIsCredit(data.isCredit)
    },
    closePage(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'salesContractChange'
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
    async beforeSaveCheck() {
      // 保证金监控
      const marginRuleList = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
      if (marginRuleList) {
        if (!marginRuleList.checkSaveData()) {
          return false
        }
      }

      // 检查授信
      const editForm = toolUtil.getDataEditFromSelf(this)
      const creditList = await request({
        url: '/api/cust/credit/getCsCeneralCreditLimitByContract',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            custCodeList: editForm.customerCodeList,
            creditQuotaType: '3'
          }
        }
      })
      if (creditList.status) {
        if (creditList.data) {
          if (editForm.localAmount <= creditList.data) {
            return true
          }
          const result = await messageUtil.syncConfirm(this, this.$t('spot.contractLot.msg.overCreditLimitByContract'))
          return result
        } else {
          return true
        }
      } else {
        return false
      }
    },
    contractTempInit() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const fillData = Object.assign({}, editForm)
      fillData.productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      fillData.pricingInfoList = toolUtil.getDataTabFromEdit(this, 'pricingInfoList')
      fillData.deliveryPlanList = toolUtil.getDataTabFromEdit(this, 'deliveryPlanList')
      fillData.relatedList = toolUtil.getDataTabFromEdit(this, 'relatedList')
      fillData.paymentInfoList = toolUtil.getDataTabFromEdit(this, 'paymentInfoList')
      fillData.feeList = toolUtil.getDataTabFromEdit(this, 'feeList')
      fillData.clauseInfoList = toolUtil.getDataTabFromEdit(this, 'clauseInfoList')
      const initChooseParam = {
        billType: 'DOM_CON_SCC_INFO',
        billNo: editForm.changeNo,
        mode: this.edit.param.type,
        fillData: fillData
      }
      return initChooseParam
    },
    profitInit() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      const initChooseParam = {
        billType: 'DOM_CON_SCC_INFO',
        billNo: editForm.changeNo,
        contractInfo: editForm,
        productDetailList: productDetailList
      }
      return initChooseParam
    }
  }
}
</script>
