<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-route-edit>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import messageUtil from '@/utils/frame/base/messageUtil.js'
import contractUtil from '@/views/frame/biz/spot/util/contractUtil.js'
export default {
  name: 'extPurchaseContractEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        isStep: true,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/contract/pcInfo/get',
          save: '/api/contract/pcInfo/save',
          update: this.getUpdateApi(this.$route.params.type || this.opType)
        },
        apiData: {
          view(param) {
            return param.uk || param.contractNo
          },
          step(param) {
            return {
              billNo: param.uk || param.contractNo
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
            event: this.viewChange
          },
          {
            iconName: '线性-历史版本',
            name: 'biz.btn.modifyHistory',
            permitName: ['modifyHistory'],
            isShow: this.$route.params.uk ? [] : ['view'],
            event: this.doHistory
          },
          {
            iconName: '线性-完结',
            name: 'biz.btn.finish',
            permitName: ['finish'],
            isShow: this.$route.params.uk ? [] : ['view'],
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
                billNo: data.uk || data.contractNo,
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
                contractNo: data.uk || data.contractNo
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
            iconName: '线性-价格估算',
            name: 'spot.contractLot.btn.profitCalc',
            permitName: ['profitCalc'],
            $refs: this.$refs,
            event: 'set',
            component: () => import('../../profit/index'),
            initChoose: this.profitInit,
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit']
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
                label: 'spot.contractLot.form.tradeType',
                prop: 'tradeType',
                element: 'base-select',
                list: this.$t('datadict.tradeTypeForeign'),
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {}
              },
              {
                label: 'spot.contractLot.form.contractType',
                prop: 'contractType',
                element: 'base-select',
                list: this.$t('datadict.contractType'),
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
                label: 'spot.contractLot.form.contractState',
                prop: 'auditStatus',
                element: 'base-select',
                default: '1',
                list: this.$t('datadict.contractStat'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.headlineCodeList',
                prop: 'headlineCodeList',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  clearable: true,
                  multiple: true,
                  usingFlag: '1',
                  clickParent: true,
                  strictly: true,
                  cols: 2
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.signDate',
                prop: 'signDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.isHedging',
                prop: 'isHedging',
                element: 'el-checkbox',
                default: '0',
                attrs: {
                  trueLabel: '1',
                  falseLabel: '0'
                }
              },
              {
                label: 'spot.contractLot.form.supplierCodeList',
                prop: 'supplierCodeList',
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
                  clearable: true,
                  multiple: true,
                  cols: 2,
                  filterable: true
                },
                event: {
                  change: this.changeSupplierCodeList
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
                  clearable: false
                }
              },
              {
                label: 'spot.contractLot.form.bizDeptCode',
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
                  clearable: false
                }
              },
              {
                label: 'spot.contractLot.form.bizEmployeeCode',
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
                  clearable: false
                }
              },
              {
                label: 'spot.contractLot.form.whTypeSource',
                prop: 'whType',
                element: 'base-select',
                list: this.$t('datadict.domesticWhType'),
                default: '1',
                attrs: {
                  clearable: true
                },
                event: this.changeWhType
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
              }
            ]
          },
          part2: {
            titleName: 'spot.contractLot.group.tradeInfo',
            content: [
              {
                label: 'spot.contractLot.form.tradeWay',
                prop: 'deliveryModeList',
                element: 'base-select',
                list: this.$t('datadict.foreignDeliveryMode'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  cols: 2,
                  multiple: true //允许多选
                }
              },
              {
                label: 'spot.contractLot.form.settleStyle',
                prop: 'settleStyle',
                element: 'base-select',
                list: this.$t('datadict.tradeWay'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                },
                event: this.changeSettleStyle,
                isShow: false // 隐藏
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
              },
              // 起运港 LOAD_PORT
              {
                label: 'spot.contractLot.form.loadPort',
                prop: 'loadPort',
                element: 'base-select',
                attrs: {
                  data: 'DD_PORT',
                  clearable: true
                }
              },
              // 目的港 DELIVERY_PORT
              {
                label: 'spot.contractLot.form.deliveryPort',
                prop: 'deliveryPort',
                element: 'base-select',
                attrs: {
                  data: 'DD_PORT',
                  clearable: true
                }
              },
              // 最早装期 LOADING_DAY_START
              {
                type: 'date',
                label: 'spot.contractLot.form.loadingDayStart',
                prop: 'loadingDayStart',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              // 最迟装期 LOADING_DAY_END
              {
                type: 'date',
                label: 'spot.contractLot.form.loadingDayEnd',
                prop: 'loadingDayEnd',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              }
            ]
          },
          part3: {
            titleName: 'spot.contractLot.group.financeInfo',
            content: [
              // 币种
              {
                label: 'spot.contractLot.form.currency',
                prop: 'currency',
                element: 'base-select',
                default: 'USD',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CURRENCY'
                },
                event: {
                  changeAll: this.changeCurrency
                }
              },
              // 汇率类型
              {
                label: 'spot.contractLot.form.exchangeRateType',
                prop: 'exchangeRateType',
                element: 'base-select',
                list: this.$t('datadict.exchangeRateType'),
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: false
                }
              },
              // 汇率
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
                  type: 'exchangeRate'
                },
                event: {
                  userChange: this.exchangeRateChange
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
                isShow: true
              },
              {
                label: 'spot.contractLot.form.localAmount',
                prop: 'localAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                },
                isShow: true
              },
              {
                label: 'spot.contractLot.form.taxedAmount',
                prop: 'taxedAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                },
                isShow: false
              },
              {
                label: 'spot.contractLot.form.taxFreeAmount',
                prop: 'taxFreeAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                },
                isShow: false
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
                  falseLabel: '0'
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
          part5: {
            titleName: 'spot.contractLot.group.marginInfo',
            content: [
              {
                label: 'spot.contractLot.form.marginLevel',
                prop: 'marginLevel',
                element: 'input-formatter',
                default: '0',
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
            component: () => import('../../components/productDetailTag.vue')
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'pricingInfoList',
            label: 'spot.contractLot.tab.pricingInfoList',
            component: () => import('../../components/pricingInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'deliveryPlanList',
            label: 'spot.contractLot.tab.deliveryPlanList',
            component: () => import('../../components/deliveryPlanTab.vue')
          },

          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'relatedList',
            label: 'spot.contractLot.tab.relatedScList',
            component: () => import('../../components/relatedContractTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'paymentPlanList',
            label: 'spot.contractLot.tab.paymentPlanList',
            component: () => import('../../components/paymentPlanTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            required: true,
            name: 'paymentInfoList',
            label: 'spot.contractLot.tab.paymentInfoList',
            component: () => import('../../components/paymentInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
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
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
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
          billType: 'epc'
        }
      }
    }
  },
  mounted() {
    if (this.$route.params.type === 'add') {
      const editForm = toolUtil.getDataEditFromSelf(this)
      editForm.currency = 'USD'
      contractUtil.editformChangeCurrency(this)
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
    changeWhType(whType) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }

      const relatedListData = toolUtil.getDataTabFromEdit(this, 'relatedList')
      const productDetailData = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      relatedListData.splice(0)
      productDetailData.splice(0)

      this.changeShow(whType)
    },
    changeShow(whType) {
      const relatedListDef = toolUtil.getRefTabFromEdit(this, 'relatedList')
      let quantityDisableFlag = false
      if (whType !== '1') {
        relatedListDef.tab.topBar[0].isShow = false
        relatedListDef.tab.topBar[1].isShow = false
        relatedListDef.tab.topBar[2].isShow = false
        quantityDisableFlag = false
      } else {
        relatedListDef.tab.topBar[0].isShow = this.param.billType === 'sc' || this.param.billType === 'scc' || this.param.billType === 'CON_PC_INFO' || this.param.billType === 'CON_PCC_INFO' || this.param.billType === 'CON_DOMESTIC_PC_INFO' || this.param.billType === 'dpc' || this.param.billType === 'CON_DOMESTIC_PCC_INFO' || this.param.billType === 'dpcc' ? ['add', 'update', 'copy'] : false
        relatedListDef.tab.topBar[1].isShow = this.param.billType === 'pc' || this.param.billType === 'pcc' || this.param.billType === 'CON_SC_INFO' || this.param.billType === 'CON_SCC_INFO' || this.param.billType === 'CON_EXT_PC_INFO' || this.param.billType === 'epc' || this.param.billType === 'CON_EXT_PCC_INFO' || this.param.billType === 'epcc' ? ['add', 'update', 'copy'] : false
        relatedListDef.tab.topBar[2].isShow = true
        quantityDisableFlag = true
      }

      let cols = relatedListDef.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]
        if (col.prop === 'productQuantity' || col.prop === 'measurementQuantity') {
          col.attrs.disabled = quantityDisableFlag
        }
      }
    },
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
          return '/api/contract/pcInfo/save'
        case 'update':
          return '/api/contract/pcInfo/update'
        case 'copy':
          return '/api/contract/pcInfo/save'
      }
    },
    exchangeRateChange(val, initFlag) {
      contractUtil.editfromCalcAmount(this)
    },
    handleCloseDialog(param) {
      this.closePage(param)
    },
    viewUpdate() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.gotoPage('extPurchaseContractUpdate', {
        type: 'update',
        contractNo: editForm.contractNo
      })
    },
    viewCopy() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('extPurchaseContractCopy', {
        type: 'copy',
        contractNo: editForm.contractNo
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
            url: '/api/contract/pcInfo/remove',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: editForm.contractNo
            }
          }).then(response => {
            if (response.status) {
              this.closePage(true)
            }
          })
        })
        .catch(() => {})
    },
    viewChange() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.changeAuditCheck') }))
        return
      }
      this.openPage('extPurchaseContractChangeAdd', {
        type: 'add',
        contractNo: editForm.contractNo
      })
    },
    viewArchive() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.achiveAuditCheck') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.closeContractConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/pcInfo/achive',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: editForm.contractNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$notify(notifySuccess({ msg: this.$t('spot.contractLot.msg.successAchive') }))
            this.closePage(true)
          } else {
            this.$confirm(this.$t(response.msgText), this.$t('biz.msg.tip'), {
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel'),
              type: 'warning'
            }).then(() => {
              request({
                url: '/api/contract/pcInfo/achive',
                method: 'post',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.search'),
                  data: {
                    contractLotNo: editForm.contractNo,
                    forceFlag: '1'
                  }
                }
              }).then(response => {
                if (response.status) {
                  this.$notify(notifySuccess({ msg: this.$t('spot.contractLot.msg.successAchive') }))
                  this.closePage(true)
                }
              })
            })
          }
        })
      })
    },
    changeCurrency(currency) {
      contractUtil.editformChangeCurrency(this)
      const feeList = toolUtil.getRefTabFromEdit(this, 'feeList')
      if (feeList) {
        feeList.checkFeeType()
      }

      const paymentPlanList = toolUtil.getDataTabFromEdit(this, 'paymentPlanList')
      if (paymentPlanList) {
        for (let i = 0; i < paymentPlanList.length; i++) {
          paymentPlanList[i].contractCurrenty = currency
        }
      }
    },
    doHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('extPurchaseContractHistory', {
        contractNo: editForm.contractNo
      })
    },
    archiveShow() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('conRelationBill', {
        billType: 'CON_PC_INFO',
        billNo: editForm.contractNo
      })
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        processId: editForm.processId,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.contractNo // 变量值
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
    changeSettleStyle(settleStyle) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      // settleStyle 1:先货后款 2:先款后货 3:现货现款
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (settleStyle === '1') {
        editForm.isCredit = '0'
        this.changeIsCredit(editForm.isCredit)
      } else if (settleStyle === '2' || settleStyle === '3') {
        editForm.isCredit = '1'
        this.changeIsCredit(editForm.isCredit)
      }
    },
    initCallback(data) {
      this.changeIsCredit(data.isCredit)
      this.changeShow(data.whType)
      if (this.edit.param.type === 'copy') {
        data.contractNo = null
        data.docMakeDt = toolUtil.todayStr()
      }
    },
    closePage(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'extPurchaseContract'
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
            custCodeList: editForm.supplierCodeList,
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
        billType: 'CON_PC_INFO',
        billNo: editForm.contractNo,
        mode: this.edit.param.type,
        fillData: fillData
      }
      return initChooseParam
    },
    profitInit() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      const initChooseParam = {
        billType: 'CON_PC_INFO',
        billNo: editForm.contractNo,
        contractInfo: editForm,
        productDetailList: productDetailList
      }
      return initChooseParam
    }
  }
}
</script>
