<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog"></qm-route-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'purchaseLotChangeEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/contract/plcInfo/get',
          save: '/api/contract/plcInfo/save',
          update: '/api/contract/plcInfo/update'
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
            // 批次选择
            name: 'biz.btn.lotSelect',
            iconName: '线性-选择文件',
            isShow: ['add'],
            event: 'set',
            component: () => import('../components/chooseLotInfoPl.vue'), // 组件
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
                label: 'spot.contractLot.form.changeNo',
                prop: 'changeNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  disabled: true
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
                label: 'spot.contractLot.form.headlineNames',
                prop: 'headlineNames',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
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
                label: 'spot.contractLot.form.supplierNames',
                prop: 'supplierNames',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
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
                  clearable: true,
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
          part4: {
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
                  max: 999999999999.999,
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
            component: () => import('../components/productDetailTagLot.vue')
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            required: true,
            name: 'paymentInfoList',
            label: 'spot.contractLot.tab.paymentInfoList',
            component: () => import('../components/paymentInfoTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
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
          billType: 'plc'
        }
      }
    }
  },
  mounted() {
    if (this.$refs.qmEdit.edit.param.type === 'add' && this.$refs.qmEdit.edit.param.lotNo !== undefined && this.$refs.qmEdit.edit.param.lotNo !== null && this.$refs.qmEdit.edit.param.lotNo !== '') {
      const lotNo = this.$refs.qmEdit.edit.param.lotNo
      this.loadFromLot(lotNo)
    }
  },
  methods: {
    exchangeRateChange(val) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }

      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
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
    loadFromLot(lotNo) {
      request({
        url: '/api/contract/plInfo/get',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: lotNo
        }
      }).then(response => {
        if (response.data) {
          const lotInfo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
          const param = response.data
          lotInfo.srcOptOrganCode = param.optOrganCode
          lotInfo.srcOptOrganName = param.optOrganName
          lotInfo.srcOptDeptCode = param.optDeptCode
          lotInfo.srcOptDeptName = param.optDeptName
          lotInfo.srcOptEmployeeCode = param.optEmployeeCode
          lotInfo.srcOptEmployeeName = param.optEmployeeName
          for (const k in lotInfo) {
            if (
              k === 'optOrganCode' ||
              k === 'optOrganName' ||
              k === 'optDeptCode' ||
              k === 'optDeptName' ||
              k === 'optEmployeeCode' ||
              k === 'optEmployeeName' ||
              k === 'srcOptOrganCode' ||
              k === 'srcOptOrganName' ||
              k === 'srcOptDeptCode' ||
              k === 'srcOptDeptName' ||
              k === 'srcOptEmployeeCode' ||
              k === 'srcOptEmployeeName' ||
              k === 'changeDt' ||
              k === 'auditStatus' ||
              k === 'changeReason' ||
              k === 'baseBillType' ||
              k === 'baseModuleCode' ||
              k === 'adviceType' ||
              k === 'operateType' ||
              k === 'fleAttachment'
            ) {
              continue
            }
            lotInfo[k] = param[k]
          }
          lotInfo.headlineCodeList = param.headlineCodeList
          lotInfo.supplierCodeList = param.supplierCodeList
          lotInfo.lotLife = [lotInfo.lotLifeStart, lotInfo.lotLifeEnd]
          lotInfo.deliveryDate = [lotInfo.deliveryDateStart, lotInfo.deliveryDateEnd]
          lotInfo.id = null
          this.changeTradeType(lotInfo.tradeType)
          this.changeIsCredit(lotInfo.isCredit)
          const feeList = toolUtil.getRefTabFromEdit(this, 'feeList')
          feeList.checkFeeType()
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
    closeLv2Dialog(param) {
      if (Array.isArray(param)) {
        param = param[0]
      }
      const productDetailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.productDetailList[0].$refs.tab.tableData
      const paymentInfoList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.paymentInfoList[0].$refs.tab.tableData
      const feeList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeList[0].$refs.tab.tableData
      const marginRuleList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.marginRuleList[0].$refs.tab.tableData
      this.loadFromLot(param.lotNo)
      this.loadSubList(param.lotNo, productDetailList, '/api/contract/plProductDetail/listByLotNo')
      this.loadSubList(param.lotNo, paymentInfoList, '/api/contract/plPaymentInfo/listByLotNo')
      this.loadSubList(param.lotNo, feeList, '/api/contract/plEstimatedCost/listByLotNo')
      this.loadSubMarginList({ billType: 'CON_PC_INFO', billNo: param.contractNo }, marginRuleList, '/api/contract/conMarginRule/getByContractNo')
    },
    loadSubList(lotNo, subList, api) {
      subList.splice(0)
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: lotNo
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
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.gotoPage('purchaseLotChangeUpdate', {
        type: 'update',
        changeNo: editForm.changeNo
      })
    },
    viewRemove() {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
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
            url: '/api/contract/plcInfo/remove',
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
      this.changeTradeType(data.tradeType)
      this.changeIsCredit(data.isCredit)
    },
    closePage(param) {
      let backName = 'purchaseLotChange'
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
