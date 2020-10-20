import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import messageUtil from '@/utils/frame/base/messageUtil.js'
const contractUtil = {
  billTypeShort(billType) {
    switch (billType) {
      // 采购合同
      case 'CON_PC_INFO':
      case 'pc':
        return ['P', 'C', '_', '?']
      // 销售合同变更
      case 'CON_PCC_INFO':
      case 'pcc':
        return ['P', 'C', 'C', '?']
      // 采购合同
      case 'CON_SC_INFO':
      case 'sc':
        return ['S', 'C', '_', '?']
      // 销售合同变更
      case 'CON_SCC_INFO':
      case 'scc':
        return ['S', 'C', 'C', '?']
      // 采购批次
      case 'CON_PL_INFO':
      case 'pl':
        return ['P', 'L', '_', '?']
      // 销售批次变更
      case 'CON_PLC_INFO':
      case 'plc':
        return ['P', 'L', 'C', '?']
      // 采购批次
      case 'CON_SL_INFO':
      case 'sl':
        return ['S', 'L', '_', '?']
      // 销售批次变更
      case 'CON_SLC_INFO':
      case 'slc':
        return ['S', 'L', 'C', '?']

      // 采购合同(内贸)
      case 'CON_DOMESTIC_PC_INFO':
      case 'dpc':
        return ['P', 'C', '_', 'D']
      // 销售合同变更(内贸)
      case 'CON_DOMESTIC_PCC_INFO':
      case 'dpcc':
        return ['P', 'C', 'C', 'D']
      // 采购合同(内贸)
      case 'DOM_CON_SC_INFO':
      case 'dsc':
        return ['S', 'C', '_', 'D']
      // 销售合同变更(内贸)
      case 'DOM_CON_SCC_INFO':
      case 'dscc':
        return ['S', 'C', 'C', 'D']
      // 采购批次(内贸)
      case 'CON_DOMESTIC_PL_INFO':
      case 'dpl':
        return ['P', 'L', '_', 'D']
      // 销售批次变更(内贸)
      case 'CON_DOMESTIC_PLC_INFO':
      case 'dplc':
        return ['P', 'L', 'C', 'D']
      // 采购批次(内贸)
      case 'DOM_CON_SL_INFO':
      case 'dsl':
        return ['S', 'L', '_', 'D']
      // 销售批次变更(内贸)
      case 'DOM_CON_SLC_INFO':
      case 'dslc':
        return ['S', 'L', 'C', 'D']

      // 采购合同(外贸)
      case 'CON_EXT_PC_INFO':
      case 'epc':
        return ['P', 'C', '_', 'E']
      // 销售合同变更(外贸)
      case 'CON_EXT_PCC_INFO':
      case 'epcc':
        return ['P', 'C', 'C', 'E']
      // 采购合同(外贸)
      case 'EXT_CON_SC_INFO':
      case 'esc':
        return ['S', 'C', '_', 'E']
      // 销售合同变更(外贸)
      case 'EXT_CON_SCC_INFO':
      case 'escc':
        return ['S', 'C', 'C', 'E']
      // 采购批次(外贸)
      case 'CON_EXT_PL_INFO':
      case 'epl':
        return ['P', 'L', '_', 'E']
      // 销售批次变更(外贸)
      case 'CON_EXT_PLC_INFO':
      case 'eplc':
        return ['P', 'L', 'C', 'E']
      // 采购批次(外贸)
      case 'EXT_CON_SL_INFO':
      case 'esl':
        return ['S', 'L', '_', 'E']
      // 销售批次变更(外贸)
      case 'EXT_CON_SLC_INFO':
      case 'eslc':
        return ['S', 'L', 'C', 'E']

      default:
        return ['?', '?', '?', '?']
    }
  },

  // 采购合同	CON_PC_INFO pc
  // 采购合同变更	CON_PCC_INFO pcc
  // 销售合同	CON_SC_INFO sc
  // 销售合同变更	CON_SCC_INFO scc
  // 内贸采购合同	CON_DOMESTIC_PC_INFO dpc
  // 外贸采购合同	CON_EXT_PC_INFO dpc
  // 内贸采购合同变更	CON_DOMESTIC_PCC_INFO dpcc
  // 外贸采购合同变更	CON_EXT_PCC_INFO epcc
  // 内贸销售合同	DOM_CON_SC_INFO dsc
  // 内贸销售合同变更	DOM_CON_SCC_INFO dscc
  // 外贸销售合同	EXT_CON_SC_INFO esc
  // 外贸销售合同变更	EXT_CON_SCC_INFO escc
  // 采购批次	CON_PL_INFO pl
  // 采购批次变更	CON_PLC_INFO plc
  // 销售批次	CON_SL_INFO sl
  // 销售批次变更	CON_SLC_INFO slc
  // 内贸采购批次	CON_DOMESTIC_PL_INFO dpl
  // 外贸采购批次	CON_EXT_PL_INFO epl
  // 内贸采购批次变更	CON_DOMESTIC_PLC_INFO dplc
  // 外贸采购批次变更	CON_EXT_PLC_INFO eplc
  // 内贸销售批次	DOM_CON_SL_INFO dsl
  // 外贸销售批次	EXT_CON_SL_INFO esl
  // 内贸销售批次变更	DOM_CON_SLC_INFO dslc
  // 外贸销售批次变更	EXT_CON_SLC_INFO eslc

  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为采购
   */
  isPurchase(billType) {
    return this.billTypeShort(billType)[0] === 'P'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为销售
   */
  isSale(billType) {
    return this.billTypeShort(billType)[0] === 'S'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为合同
   */
  isContract(billType) {
    return this.billTypeShort(billType)[1] === 'C'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为批次
   */
  isLot(billType) {
    return this.billTypeShort(billType)[1] === 'L'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为正式的
   */
  isFormal(billType) {
    return this.billTypeShort(billType)[2] === '_'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为变更的
   */
  isChange(billType) {
    return this.billTypeShort(billType)[2] === 'C'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为内贸
   */
  isDomestic(billType) {
    return this.billTypeShort(billType)[3] === 'D'
  },
  /**
   * @param {String} billType 单据类型
   * @returns {boolean} 是否为外贸
   */
  isExternal(billType) {
    return this.billTypeShort(billType)[3] === 'E'
  },
  /**
   * 按照属性找控件
   * @param {Object} self 自身this
   * @param {String} prop 属性名称
   * @param {Object} 控件定义
   */
  editformGetItemByProp(self, prop) {
    for (const partKey in self.edit.formData) {
      const part = self.edit.formData[partKey]
      for (const item of part.content) {
        if (Array.isArray(item.props)) {
          if (item.props.includes(prop)) {
            return item
          }
        } else if (item.prop === prop) {
          return item
        }
      }
    }
    return null
  },
  /**
   * 设置合同上币种，本币币种，汇率的默认值
   * @param {Object} self 自身this
   */
  setContractDefaultData(self) {
    if (self.$route.params.type === 'add') {
      const defaultHeadline = self.$store.state.user.userOrganCode
      const currency = this.isExternal(self.param.billType) ? 'USD' : 'CNY'
      const editForm = toolUtil.getDataEditFromSelf(self)
      editForm.currency = currency
      editForm.headlineCodeList = defaultHeadline

      request({
        url: '/api/dd/currency/getByOrgCode',
        method: 'post',
        data: {
          funcModule: self.$t('route.' + self.$route.meta.title),
          funcOperation: self.$t('biz.btn.search'),
          data: defaultHeadline
        }
      }).then(response => {
        if (response.status) {
          editForm.localCurrency = response.data.currencyCode
          this.editformChangeCurrency(self)
        }
      })
    }
  },
  /**
   * 在EditForm上修改汇率
   * @param {Object} self 自身this
   */
  editformChangeCurrency(self) {
    const editForm = toolUtil.getDataEditFromSelf(self)
    request({
      url: '/api/recording/rate/getExchangeRate',
      method: 'post',
      data: {
        funcModule: self.$t('route.' + self.$route.meta.title),
        funcOperation: self.$t('biz.btn.search'),
        data: editForm.currency
      }
    }).then(response => {
      if (response.status) {
        editForm.exchangeRate = response.data
        this.editfromCalcAmount(self)
      }
    })
  },
  /**
   * 在EditForm重新计算金额
   * @param {Object} self 自身this
   */
  editfromCalcAmount(self) {
    const editForm = toolUtil.getDataEditFromSelf(self)
    const prdDtlList = toolUtil.getDataTabFromEdit(self, 'productDetailList')
    if (prdDtlList === null) {
      return
    }
    const exchangeRate = toolUtil.toDecimal(editForm.exchangeRate)

    let originalAmount = null
    let localAmount = null
    let taxedAmount = null
    let taxFreeAmount = null
    let taxAmount = null

    for (const prdDtl of prdDtlList) {
      const estimatedPrice = toolUtil.toDecimal(prdDtl.estimatedPrice)
      const premium = toolUtil.toDecimal(prdDtl.premium)
      const measurementQuantity = toolUtil.toDecimal(prdDtl.measurementQuantity)
      const taxRate = toolUtil.toDecimal(prdDtl.taxRate)
      if (estimatedPrice === null || measurementQuantity === null) {
        // prdDtl.originalAmount = null
        prdDtl.localAmount = null
        prdDtl.taxedAmount = null
        prdDtl.taxFreeAmount = null
        prdDtl.taxAmount = null
        continue
      }
      prdDtl.originalAmount = estimatedPrice.plus(premium).times(measurementQuantity)
      prdDtl.taxedAmount = prdDtl.originalAmount
      if (exchangeRate !== null && exchangeRate.greaterThan(0)) {
        prdDtl.localAmount = prdDtl.originalAmount.times(exchangeRate)
      } else {
        prdDtl.localAmount = null
      }
      if (taxRate != null) {
        prdDtl.taxFreeAmount = prdDtl.taxedAmount.times(100).dividedBy(taxRate.plus(100))
        prdDtl.taxAmount = prdDtl.taxedAmount.minus(prdDtl.taxFreeAmount)
      } else {
        prdDtl.taxFreeAmount = null
        prdDtl.taxAmount = null
      }

      if (prdDtl.originalAmount !== null) {
        originalAmount = originalAmount === null ? prdDtl.originalAmount : originalAmount.plus(prdDtl.originalAmount)
      }
      if (prdDtl.localAmount !== null) {
        localAmount = localAmount === null ? prdDtl.localAmount : localAmount.plus(prdDtl.localAmount)
      }
      if (prdDtl.taxedAmount !== null) {
        taxedAmount = taxedAmount === null ? prdDtl.taxedAmount : taxedAmount.plus(prdDtl.taxedAmount)
      }
      if (prdDtl.taxFreeAmount !== null) {
        taxFreeAmount = taxFreeAmount === null ? prdDtl.taxFreeAmount : taxFreeAmount.plus(prdDtl.taxFreeAmount)
      }
      if (prdDtl.taxAmount !== null) {
        taxAmount = taxAmount === null ? prdDtl.taxAmount : taxAmount.plus(prdDtl.taxAmount)
      }
    }

    editForm.originalAmount = originalAmount
    editForm.localAmount = localAmount
    editForm.taxedAmount = taxedAmount
    editForm.taxFreeAmount = taxFreeAmount
    editForm.taxAmount = taxAmount

    const paymentInfoList = toolUtil.getDataTabFromEdit(self, 'paymentInfoList')
    if (paymentInfoList != null) {
      for (let i = 0; i < paymentInfoList.length; i++) {
        const paymentLevel = toolUtil.toNum(paymentInfoList[i].paymentLevel)
        if (paymentLevel !== null && originalAmount !== null) {
          paymentInfoList[i].prepayAmount = (originalAmount / 100) * paymentLevel
        }
      }
    }
    const marginLevel = toolUtil.toNum(editForm.marginLevel)
    if (marginLevel !== null && originalAmount !== null) {
      editForm.marginAmount = (originalAmount / 100) * marginLevel
    }
  },
  /**
   * 在EditForm重新计算金额
   * @param {Object} self 自身this
   */
  tabCalcAmount(self) {
    const editRef = toolUtil.getRefEditFromTab(self)
    this.editfromCalcAmount(editRef)
  },
  // editfromInit(self, data) {
  //   if (Array.isArray(data.headlineCodeList) && data.headlineCodeList.length === 1) {
  //     data.headlineCodeList = data.headlineCodeList[0]
  //   }
  //   if (Array.isArray(data.customerCodeList) && data.customerCodeList.length === 1) {
  //     data.customerCodeList = data.customerCodeList[0]
  //   }
  //   if (Array.isArray(data.supplierCodeList) && data.supplierCodeList.length === 1) {
  //     data.supplierCodeList = data.supplierCodeList[0]
  //   }

  //   if (data.localCurrency === data.currency) {
  //     // data.exchangeRate = 1
  //     this.editformGetItemByProp(self, 'exchangeRate').attrs.disabled = true
  //     this.editfromCalcAmount(self)
  //   }
  // },
  getTabColDefByProp(self, prop) {
    const cols = self.tab.table.cols
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].prop === prop) {
        return cols[i]
      }
    }
  },
  async beforeSaveCheck(self) {
    // // 保证金监控
    // const marginRuleList = toolUtil.getRefTabFromEdit(this, 'marginRuleList')
    // if (marginRuleList) {
    //   if (!marginRuleList.checkSaveData()) {
    //     return false
    //   }
    // }

    if (this.isSale(self.param.billType)) {
      // 保证金比例检查
      const editForm = toolUtil.getDataEditFromSelf(self)
      let marginLevel = toolUtil.toNum(editForm.marginLevel)
      if (marginLevel === null) {
        marginLevel = 0
      }
      const custInfo = await request({
        url: '/api/cust/customer/getByCode',
        method: 'post',
        data: {
          funcModule: self.$t('route.' + self.$route.meta.title),
          funcOperation: self.$t('biz.btn.search'),
          data: Array.isArray(editForm.customerCodeList) ? editForm.customerCodeList[0] : editForm.customerCodeList
        }
      })
      if (custInfo.status) {
        if (custInfo.data && custInfo.data.marginMinRatio) {
          if (marginLevel < custInfo.data.marginMinRatio) {
            const result = await messageUtil.syncConfirm(self, self.$t('spot.contractLot.msg.lessMarginMinRatio'))
            if (result === false) {
              return false
            }
          }
        }
      }
    }
    return true
  }
}

export default contractUtil
