<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-route-edit>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import messageUtil from '@/utils/frame/base/messageUtil.js'
export default {
  name: 'salesContractEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        isStep: true,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/contract/scInfo/get',
          save: '/api/contract/scInfo/save',
          update: this.getUpdateApi(this.$route.params.type || this.opType)
        },
        apiData: {
          $route: this.$route,
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
            iconName: '线性-附件',
            name: 'spot.contractLot.btn.profitCalc',
            permitName: ['profitCalc'],
            $refs: this.$refs,
            event: 'set',
            component: () => import('../profit/index'),
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
                list: this.$t('datadict.tradeTypeSale'),
                default: '3',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {},
                event: this.changeTradeType
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
                label: 'spot.contractLot.form.customerCodeList',
                prop: 'customerCodeList',
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
                label: 'spot.contractLot.form.contractBizType',
                prop: 'contractBizType',
                element: 'base-select',
                list: this.$t('datadict.contractBizType'),
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
                label: 'spot.contractLot.form.whSource',
                prop: 'whType',
                element: 'base-select',
                default: '1',
                list: this.$t('datadict.distributionSrc'),
                event: this.changeWhType
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
                event: this.changeSettleStyle
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
                list: [],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true
                },
                event: this.changeCurrency
              },
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
              {
                label: 'spot.contractLot.form.exchangeRate',
                prop: 'exchangeRate',
                element: 'input-formatter',
                default: 1,
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
                  type: 'percent'
                }
              },
              {
                label: 'spot.contractLot.form.marginAmount',
                prop: 'marginAmount',
                element: 'input-formatter',
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
            component: () => import('../components/productDetailTag.vue')
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'distributionList',
            label: 'spot.contractLot.tab.distributionList',
            component: () => import('../components/distributionInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'pricingInfoList',
            label: 'spot.contractLot.tab.pricingInfoList',
            component: () => import('../components/pricingInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'deliveryPlanList',
            label: 'spot.contractLot.tab.deliveryPlanList',
            component: () => import('../components/deliveryPlanTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'relatedList',
            label: 'spot.contractLot.tab.relatedPcList',
            component: () => import('../components/relatedContractTab.vue')
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'paymentPlanList',
            label: 'spot.contractLot.tab.paymentPlanList',
            component: () => import('../components/paymentPlanTab.vue')
          },
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
          },
          {
            isShow: ['add', 'update', 'copy', 'view', 'assist', 'audit'],
            name: 'clauseInfoList',
            label: 'spot.contractLot.tab.clauseInfoList',
            component: () => import('../components/clauseInfoTab.vue')
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
          billType: 'sc'
        }
      }
    }
  },
  mounted() {
    request({
      url: '/api/dd/selectData/list',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          type: 'DD_RECORDING_RATE'
        }
      }
    }).then(response => {
      const currencyRef = toolUtil.getDefFormItemByProp(this, 'currency')
      const currencyList = []
      for (let i = 0; i < response.data.length; i++) {
        currencyList.push({
          value: response.data[i].code,
          label: response.data[i].name,
          exchangeRate: response.data[i].data.exchangeRate,
          localFlag: response.data[i].data.localFlag
        })
      }
      currencyRef.list = currencyList

      if (this.$route.params.type === 'add') {
        this.changeTradeType('3')
      }
    })
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
          return '/api/contract/scInfo/save'
        case 'update':
          return '/api/contract/scInfo/update'
        case 'copy':
          return '/api/contract/scInfo/save'
      }
    },
    exchangeRateChange(val, initFlag) {
      if (initFlag === false) {
      } else if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      if (!Array.isArray(this.$refs.qmEdit.$refs.qmRouteEdit.$refs.productDetailList)) {
        // 新增，尚未初始化完成
        return
      }
      const editForm = toolUtil.getDataEditFromSelf(this)
      const productDetailList = toolUtil.getDataTabFromEdit(this, 'productDetailList')
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
    handleCloseDialog(param) {
      this.closePage(param)
    },
    viewUpdate() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.gotoPage('salesContractUpdate', {
        type: 'update',
        contractNo: editForm.contractNo
      })
    },
    viewCopy() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('salesContra', {
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
            url: '/api/contract/scInfo/remove',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.remove'),
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
      this.openPage('salesContractChangeAdd', {
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
          url: '/api/contract/scInfo/achive',
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
                url: '/api/contract/scInfo/achive',
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
      const feeList = toolUtil.getRefTabFromEdit(this, 'feeList')
      feeList.checkFeeType()
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }

      const paymentPlanList = toolUtil.getDataTabFromEdit(this, 'paymentPlanList')
      if (paymentPlanList) {
        for (let i = 0; i < paymentPlanList.length; i++) {
          paymentPlanList[i].contractCurrenty = currency
        }
      }

      const editForm = toolUtil.getDataEditFromSelf(this)
      const currencyRef = toolUtil.getDefFormItemByProp(this, 'currency')
      for (let i = 0; i < currencyRef.list.length; i++) {
        if (currencyRef.list[i].value === currency) {
          editForm.exchangeRate = currencyRef.list[i].exchangeRate
          this.exchangeRateChange(currencyRef.list[i].exchangeRate, false)
          break
        }
      }
    },
    doHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('salesContractHistory', {
        contractNo: editForm.contractNo
      })
    },
    archiveShow() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      this.openPage('conRelationBill', {
        billType: 'CON_SC_INFO',
        billNo: editForm.contractNo
      })
    },
    changeTradeType(val, initFlag) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (val === '3') {
        if (initFlag) {
        } else {
          const currencyRef = toolUtil.getDefFormItemByProp(this, 'currency')
          for (let i = 0; i < currencyRef.list.length; i++) {
            if (currencyRef.list[i].localFlag === '1') {
              editForm.currency = currencyRef.list[i].value
              this.changeCurrency(editForm.currency)
              break
            }
          }
        }
        editForm.exchangeRateType = '1'

        toolUtil.getDefFormItemByProp(this, 'currency').attrs.disabled = true
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
        if (initFlag) {
        } else {
          editForm.currency = 'USD'
          this.changeCurrency('USD')
        }
        toolUtil.getDefFormItemByProp(this, 'currency').attrs.disabled = this.edit.type !== 'add' && this.edit.type !== 'update' && this.edit.type !== 'copy'
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
      // settleStyle 1:先货后款 2:先款后货 2:现货现款
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (settleStyle === '2') {
        editForm.isCredit = '0'
        this.changeIsCredit(editForm.isCredit)
      } else if (settleStyle === '1' || settleStyle === '3') {
        editForm.isCredit = '1'
        this.changeIsCredit(editForm.isCredit)
      }
    },
    changeWhType(whType) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const distributionListDef = toolUtil.getRefTabFromEdit(this, 'distributionList')
      const relatedListDef = toolUtil.getRefTabFromEdit(this, 'relatedList')
      const distributionListData = toolUtil.getDataTabFromEdit(this, 'distributionList')
      const productDetailListData = toolUtil.getDataTabFromEdit(this, 'productDetailList')
      const pricingInfoListData = toolUtil.getDataTabFromEdit(this, 'pricingInfoList')
      const deliveryPlanListData = toolUtil.getDataTabFromEdit(this, 'deliveryPlanList')
      const relatedListData = toolUtil.getDataTabFromEdit(this, 'relatedList')
      const feeListData = toolUtil.getDataTabFromEdit(this, 'feeList')

      let quantityDisableFlag = false
      if (whType === '1') {
        distributionListDef.tab.topBar[0].isShow = true
        distributionListDef.tab.topBar[1].isShow = true
        distributionListDef.tab.topBar[2].isShow = true
        relatedListDef.tab.topBar[0].isShow = false
        relatedListDef.tab.topBar[1].isShow = false
        relatedListDef.tab.topBar[2].isShow = false
        quantityDisableFlag = false
      } else {
        distributionListDef.tab.topBar[0].isShow = false
        distributionListDef.tab.topBar[1].isShow = false
        distributionListDef.tab.topBar[2].isShow = false
        relatedListDef.tab.topBar[0].isShow = false
        relatedListDef.tab.topBar[1].isShow = false
        relatedListDef.tab.topBar[2].isShow = false
        quantityDisableFlag = true
      }
      var cols = distributionListDef.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]
        if (col.prop === 'inQuantity' || col.prop === 'measurementQuantity') {
          col.attrs.disabled = quantityDisableFlag
        }
      }
      cols = relatedListDef.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]
        if (col.prop === 'productQuantity' || col.prop === 'measurementQuantity') {
          col.attrs.disabled = quantityDisableFlag
        }
      }

      distributionListData.splice(0)
      productDetailListData.splice(0)
      pricingInfoListData.splice(0)
      deliveryPlanListData.splice(0)
      relatedListData.splice(0)
      feeListData.splice(0)
    },
    initCallback(data) {
      this.changeTradeType(data.tradeType, true)
      this.changeIsCredit(data.isCredit)
      if (this.edit.param.type === 'copy') {
        data.contractNo = null
        data.docMakeDt = toolUtil.todayStr()
      }
      const distributionListDef = toolUtil.getRefTabFromEdit(this, 'distributionList')
      const relatedListDef = toolUtil.getRefTabFromEdit(this, 'relatedList')

      let quantityDisableFlag = false
      if (data.whType === '1' && (this.edit.param.type === 'add' || this.edit.param.type === 'update' || this.edit.param.type === 'copy')) {
        distributionListDef.tab.topBar[0].isShow = true
        distributionListDef.tab.topBar[1].isShow = true
        distributionListDef.tab.topBar[2].isShow = true
        relatedListDef.tab.topBar[0].isShow = false
        relatedListDef.tab.topBar[1].isShow = false
        relatedListDef.tab.topBar[2].isShow = false
        quantityDisableFlag = false
      } else {
        distributionListDef.tab.topBar[0].isShow = false
        distributionListDef.tab.topBar[1].isShow = false
        distributionListDef.tab.topBar[2].isShow = false
        relatedListDef.tab.topBar[0].isShow = false
        relatedListDef.tab.topBar[1].isShow = false
        relatedListDef.tab.topBar[2].isShow = false
        quantityDisableFlag = true
      }
      var cols = distributionListDef.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]
        if (col.prop === 'inQuantity' || col.prop === 'measurementQuantity') {
          col.attrs.disabled = quantityDisableFlag
        }
      }
      cols = relatedListDef.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]
        if (col.prop === 'productQuantity' || col.prop === 'measurementQuantity') {
          col.attrs.disabled = quantityDisableFlag
        }
      }
    },
    closePage(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'salesContract'
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
        billType: 'CON_SC_INFO',
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
        billType: 'CON_SC_INFO',
        billNo: editForm.contractNo,
        contractInfo: editForm,
        productDetailList: productDetailList
      }
      return initChooseParam
    }
  }
}
</script>
