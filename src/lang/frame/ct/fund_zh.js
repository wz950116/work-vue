export default {
  fund: {
    common: {
      fundApplyConfirmCheck: '付款待处理',
      advanceApplyTransferCheck: '预付款转账处理',
      fundReceiveClaimCheck: '实收款待认领',
      advanceClaimTransferCheck: '预收款转账处理',
      domesticInvoiceApplyConfirmCheck: '开票待处理(内)',
      domesticInvoiceReceiveClaimCheck: '收票待认领(内)',
      domesticNoInvoicingCheck: '待开票合同(内)',
      domesticNotToCheck: '待收票合同(内)',
      lcReceiveCheck: '收信用证处理',
      lcApplyCheck: '开信用证待确认',
      acceptanceSignCheck: '签发承兑汇票处理',
      acceptanceReceiveCheck: '外收承兑汇票处理',
      foreignNoInvoicingCheck: '待开票合同(外)',
      foreignNotToCheck: '待收票合同(外)'
    },
    // 付款申请
    fundApply: {
      btn: {
        fundConfirm: '申请确认',
        advanceApplyTransfer: '预付款转货款',
        fundClaim: '收款认领(退预付款)'
      },
      msg: {
        fundConfirm: '审批状态为已通过并且确认状态不为全部确认的单据才可以确认',
        advanceApplyTransfer: '审批状态已通过,申请类型为预付款,确认状态不为未确认以及使用状态不为全部使用的单据才可以转货款',
        fundClaim: '审批状态已通过,申请类型为预付款,确认状态不为未确认以及使用状态不为全部使用的单据才可以转货款'
      },
      form: {
        applyNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        applyType: '申请类型',
        businessType: '业务类别',
        contractNo: '采购合同',
        claimNo: '预收款单号',
        applyAmount: '申请金额',
        currency: '币种',
        paymentType: '付款方式',
        latestPaymentDate: '最迟付款日期',
        confirmStatus: '确认状态',
        confirmAmount: '确认金额',
        transferAmount: '转货款金额',
        transferFlag: '转货款标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态',
        contractNoSon: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      },
      tab: {
        fundApplyPaymentDtoList: '付款方式信息',
        fundApplyDetailDtoList: '付款申请详细信息',
        fundAdvApplyDtoList: '有关预付款申请信息'
      },
      popup: {
        list: '付款申请列表',
        edit: '付款申请编辑',
        fundApplyPaymentDtoList: '付款方式信息',
        fundApplyDetailDtoList: '付款申请详细信息',
        advApplyList: '预付款申请列表'
      },
      group: {
        editPart1: '付款申请信息'
      },
      list: {
        applyNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        applyType: '申请类型',
        businessType: '业务类别',
        contractNo: '采购合同',
        claimNo: '预收款单号',
        applyAmount: '申请金额',
        currency: '币种',
        paymentType: '付款方式',
        latestPaymentDate: '最迟付款日期',
        confirmStatus: '确认状态',
        confirmAmount: '确认金额',
        transferAmount: '转货款金额',
        transferFlag: '转货款标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态',
        contractNoSon: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品',
        paymentRate: '付款比例',
        unconfirmAmount: '未确认金额',
        canUsedAmount: '可使用金额',
        lotMeasurementQuantity: '批次计量数量',
        lotPrice: '批次价格'
      }
    },
    // 付款申请视图
    viewFundApplyInfo: {
      form: {
        applyNo: '单据号',
        applyBillType: '申请单据类型',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        latestPaymentDate: '最迟付款日期',
        confirmStatus: '确认状态',
        transferFlag: '转货款标志',
        refundFlag: '退款标志',
        useStatus: '使用状态'
      },
      tab: {
      },
      popup: {
        list: '付款申请列表'
      },
      group: {
      },
      list: {
        applyNo: '单据号',
        applyBillType: '申请单据类型',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        applyType: '申请类型',
        businessType: '业务类别',
        contractNo: '合同号',
        claimNo: '收款认领单号',
        paymentType: '付款方式',
        applyAmount: '申请金额',
        currency: '币种',
        latestPaymentDate: '最迟付款日期',
        confirmStatus: '确认状态',
        confirmAmount: '确认金额',
        transferAmount: '转货款金额',
        transferFlag: '转货款标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态'
      }
    },
    // 付款确认
    fundConfirm: {
      msg: {
        acceptanceCurrencyNe: '所选承兑汇票与付款申请币种不一致，请重新选择',
        signAcceptanceCustomerNe: '所选承兑汇票票据方向为签发时票据客户需要与付款申请客户一致，请重新选择',
        letterCreditCurrencyNe: '所选信用证与付款申请币种不一致，请重新选择'
      },
      form: {
        confirmNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        paymentDate: '付款日期',
        applyNo: '申请单号',
        applyBillType: '申请单据类型',
        paymentType: '付款方式',
        paymentAmount: '付款金额',
        currency: '币种',
        bankCode: '付款银行',
        bankAccountCode: '付款账号',
        letterCreditNo: '信用证',
        acceptanceNo: '承兑汇票',
        draftDate: '押汇日期',
        draftDays: '押汇天数',
        draftDueDate: '到期日',
        draftRate: '押汇比例(%)',
        draftAmount: '押汇金额',
        sightDraftAmount: '即期购汇',
        exchangeRate: '汇率',
        laborRate: 'labor',
        goUpRate: '上浮',
        interestRate: '利率'
      },
      tab: {},
      popup: {
        list: '付款确认列表',
        edit: '付款确认编辑'
      },
      group: {
        editPart1: '基本信息',
        editPart2: '付款信息',
        editPart3: '押汇信息'
      },
      list: {
        confirmNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        paymentDate: '付款日期',
        applyNo: '申请单号',
        applyBillType: '申请单据类型',
        paymentType: '付款方式',
        paymentAmount: '付款金额',
        currency: '币种',
        bankCode: '付款银行',
        bankAccountCode: '付款账号',
        letterCreditNo: '信用证',
        acceptanceNo: '承兑汇票',
        draftDate: '押汇日期',
        draftDays: '押汇天数',
        draftDueDate: '到期日',
        draftRate: '押汇比例(%)',
        draftAmount: '押汇金额',
        sightDraftAmount: '即期购汇',
        exchangeRate: '汇率',
        laborRate: 'labor',
        goUpRate: '上浮',
        interestRate: '利率',
        lotNos: '批次号'
      }
    },
    // 收款登记
    fundReceive: {
      msg: { fundClaim: '审批状态为已通过并且认领状态不为全部认领的单据才可以认领' },
      btn: { fundClaim: '收款认领' },
      form: {
        receiveNo: '单据号',
        receiveDate: '收款日期',
        customerNo: '客户',
        customerName: '客户',
        receiveType: '收款方式',
        receiveAmount: '收款金额',
        currency: '币种',
        bankCode: '收款银行',
        bankAccountCode: '收款账号',
        acceptanceBillNo: '承兑汇票单据号',
        letterCreditBillNo: '信用证单据号',
        claimAmount: '认领金额',
        claimStatus: '认领状态'
      },
      tab: {},
      popup: {
        edit: '收款登记编辑',
        list: '收款登记列表'
      },
      group: {
        editPart1: '基本信息',
        editPart2: '收款信息',
        editPartAcc: '承兑汇票信息',
        editPartLc: '信用证信息'
      },
      list: {
        receiveNo: '单据号',
        receiveDate: '收款日期',
        customerNo: '客户',
        customerName: '客户',
        receiveType: '收款方式',
        receiveAmount: '收款金额',
        currency: '币种',
        bankCode: '收款银行',
        bankName: '收款银行',
        bankAccountCode: '收款账号',
        bankAccountName: '收款账号',
        acceptanceBillNo: '承兑汇票单据号',
        letterCreditBillNo: '信用证单据号',
        claimAmount: '认领金额',
        unclaimAmount: '未认领金额',
        claimStatus: '认领状态'
      }
    },
    // 收款认领
    fundClaim: {
      msg: {
        advanceClaimTransfer: '只有审批状态为已通过认领类型为预收款使用状态不为全部使用的单据才能预收款转货款',
        fundApply: '只有审批状态为已通过认领类型为预收款使用状态不为全部使用的单据才能付款申请(退预收款)'
      },
      btn: { advanceClaimTransfer: '预收款转货款', fundApply: '付款申请(退预收款)' },
      form: {
        claimNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        claimDate: '认领日期',
        receiveNo: '收款单号',
        receiveType: '收款方式',
        claimType: '认领类型',
        businessType: '业务类别',
        contractNo: '销售合同',
        applyNo: '预付款单号',
        claimAmount: '认领金额',
        currency: '币种',
        transferAmount: '转货款金额',
        transferFlag: '转货款标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态',
        contractNoSon: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      },
      tab: {
        fundClaimDetailDtoList: '收款认领详细信息'
      },
      popup: {
        edit: '收款认领编辑',
        list: '收款认领列表',
        fundClaimDetailDtoList: '收款认领详细信息',
        advClaimList: '预收款认领列表'
      },
      group: {
        editPart1: '收款认领信息'
      },
      list: {
        claimNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        claimDate: '认领日期',
        receiveNo: '收款单号',
        receiveType: '收款方式',
        claimType: '认领类型',
        businessType: '业务类别',
        contractNo: '销售合同',
        applyNo: '预付款单号',
        claimAmount: '认领金额',
        currency: '币种',
        transferAmount: '转货款金额',
        transferFlag: '转货款标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态',
        contractNoSon: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品',
        canUsedAmount: '未使用金额'
      }
    },
    // 预付款转换
    advanceApplyTransfer: {
      form: {
        transferNo: '单据号',
        transferDate: '转换日期',
        applyNo: '付款申请单号',
        contractNoParent: '采购合同号',
        customerNo: '客户',
        customerName: '客户',
        transferAmount: '转换金额',
        currency: '币种',
        contractNo: '合同号',
        lotNo: '批次号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      },
      tab: {
        transferDetailInfoTab: '预付款转换详细信息'
      },
      popup: {
        edit: '预付款转换编辑',
        list: '预付款转换列表',
        transferDetailInfoTab: '预付款转换详细信息'
      },
      group: {
        editPart1: '预付款转换信息'
      },
      list: {
        transferNo: '单据号',
        transferDate: '转换日期',
        applyNo: '付款申请单号',
        customerNo: '客户',
        customerName: '客户',
        transferAmount: '转换金额',
        currency: '币种',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      }
    },
    // 预收款转换
    advanceClaimTransfer: {
      form: {
        transferNo: '单据号',
        transferDate: '转换日期',
        claimNo: '收款认领单号',
        contractNoParent: '销售合同号',
        customerNo: '客户',
        customerName: '客户',
        transferAmount: '转换金额',
        currency: '币种',
        contractNo: '合同号',
        lotNo: '批次号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      },
      tab: {
        transferDetailInfoTab: '预收款转换详细信息'
      },
      popup: {
        edit: '预收款转换编辑',
        list: '预收款转换列表',
        transferDetailInfoTab: '预收款转换详细信息'
      },
      group: {
        editPart1: '预收款转换信息'
      },
      list: {
        transferNo: '单据号',
        transferDate: '转换日期',
        claimNo: '收款认领单号',
        customerNo: '客户',
        customerName: '客户',
        transferAmount: '转换金额',
        currency: '币种',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        lotType: '批次类型',
        fundUseType: '资金用途',
        productCode: '商品',
        productName: '商品'
      }
    },
    // 账户收支登记
    accountBook: {
      form: {
        accountBookNo: '单据号',
        accountBookDate: '收支日期',
        bankCode: '银行',
        bankAccountCode: '账号',
        fundDirection: '收支方向',
        accountBookAmount: '金额',
        currency: '币种'
      },
      tab: {},
      popup: {
        edit: '账户收支登记编辑',
        list: '账户收支登记列表'
      },
      group: {
        editPart1: '账户收支信息'
      },
      list: {
        accountBookNo: '单据号',
        accountBookDate: '收支日期',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号',
        bankAccountName: '账号',
        fundDirection: '收支方向',
        accountBookAmount: '金额',
        currency: '币种'
      }
    },
    // 账户转账登记
    accountTransfer: {
      form: {
        accountTransferNo: '单据号',
        accountTransferDate: '转账日期',
        accountTransferAmount: '金额',
        currency: '币种',
        outBankAccountCode: '转出账号',
        outBankCode: '转出银行',
        outOrganCode: '转出机构',
        inBankAccountCode: '转入账号',
        inBankCode: '转入银行',
        inOrganCode: '转入机构'
      },
      tab: {},
      popup: {
        edit: '账户转账登记编辑',
        list: '账户转账登记编辑'
      },
      group: {
        editPart1: '账户转账信息'
      },
      list: {
        accountTransferNo: '单据号',
        accountTransferDate: '转账日期',
        accountTransferAmount: '转账金额',
        currency: '币种',
        outBankAccountCode: '转出账号',
        outBankAccountNo: '转出账号',
        outBankCode: '转出银行',
        outBankName: '转出银行',
        outOrganCode: '转出机构',
        outOrganName: '转出机构',
        inBankAccountCode: '转入账号',
        inBankAccountNo: '转入账号',
        inBankCode: '转入银行',
        inBankName: '转入银行',
        inOrganCode: '转入机构',
        inOrganName: '转入机构'
      }
    }
  }
}
