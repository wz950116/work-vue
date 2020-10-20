export default {
  fee: {
    feeContract: {
      form: {
        feeContractNo: '合同号',
        customerNo: '服务商',
        customerName: '服务商',
        signDate: '签订日期',
        documentNo: '合同文档号',
        contractName: '合同名称',
        feeContractType: '合同类型',
        contractAmount: '合同金额',
        currency: '币种'
      },
      tab: {},
      popup: {
        list: '费用合同列表',
        edit: '费用合同编辑',
        title: '费用合同选择'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        feeContractNo: '合同号',
        customerNo: '服务商',
        customerName: '服务商',
        signDate: '签订日期',
        documentNo: '合同文档号',
        contractName: '合同名称',
        feeContractType: '合同类型',
        contractAmount: '合同金额',
        currency: '币种'
      }
    },
    feeInvoice: {
      form: {
        feeInvoiceNo: '单据号',
        invoiceNo: '发票号',
        invoiceDate: '发票日期',
        customerNo: '服务商',
        customerName: '服务商',
        feeContractNo: '费用合同号',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种'
      },
      tab: {
        feeInvoiceDetailInfoTab: '发票详细信息'
      },
      popup: {
        list: '费用发票列表',
        edit: '费用发票编辑',
        feeInvoiceDetailInfoTab: '发票详细信息'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        feeInvoiceNo: '单据号',
        invoiceNo: '发票号',
        invoiceDate: '发票日期',
        customerNo: '服务商',
        customerName: '服务商',
        feeContractNo: '费用合同号',
        excludeTaxAmount: '发票金额(不含税)',
        taxAmount: '税额',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        allotAmount: '分摊金额',
        allotStatus: '分摊状态',
        feeInvoiceDetailNo: '明细单据号',
        feeType: '费用类型',
        productCode: '商品',
        productName: '商品',
        invoiceQuantity: '发票数量',
        excludeTaxPrice: '发票价格(不含税)',
        includeTaxPrice: '发票价格(含税)',
        taxRate: '税率(%)',
        canAllotAmount: '剩余分摊金额'
      }
    },
    feeApply: {
      form: {
        confirmAmount: '确认金额',
        latestPaymentDate: '最迟付款日期',
        applyNo: '申请单号',
        bizEmployeeCode: '业务员',
        confirmStatus: '确认状态',
        currency: '币种',
        remark: '备注',
        applyDate: '申请日期',
        feeType: '费用类型',
        customerNo: '服务商',
        applyAmount: '申请金额',
        paymentType: '付款方式'
      },
      tab: {
        confirmInfoTab: '付款确认信息',
        applyDetailInfoTab: '详细信息'
      },
      popup: {
        edit: '费用申请编辑',
        confirmInfoTab: '付款确认信息',
        list: '费用申请列表',
        applyDetailInfoTab: '详细信息'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        confirmAmount: '确认金额',
        bankAccount: '付款账号',
        bizEmployeerName: '业务员',
        bizEmployeeName: '业务员',
        bankName: '付款银行',
        feeType: '费用类型',
        serviceProviderName: '服务商',
        paymentAmount: '付款金额',
        applyAmount: '申请金额',
        paymentType: '付款方式',
        confirmNo: '付款确认单号',
        applyNo: '单据号',
        confirmStatus: '确认状态',
        currency: '币种',
        applyDate: '申请日期',
        feeInvoiveNo: '单据号',
        invoiceNo: '发票号',
        paymentDate: '付款日期',
        billNo: '单据号'
      }
    },
    // 海关发票
    customsInvoice: {
      form: {
        customsInvoiceNo: '单据号',
        invoiceNo: '发票号',
        customsNo: '海关',
        customsName: '海关',
        invoiceDate: '发票日期',
        customsInvoiceType: '科目',
        contractNo: '采购合同号',
        taxAmount: '税额',
        currency: '币种',
        dueDate: '缴款期限',
        productCode: '商品'
      },
      tab: {
        customsInvoiceDetailInfoTab: '发票详细信息'
      },
      popup: {
        list: '海关发票列表',
        edit: '海关发票编辑',
        customsInvoiceDetailInfoTab: '发票详细信息'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        customsInvoiceNo: '单据号',
        invoiceNo: '发票号',
        customsNo: '海关',
        customsName: '海关',
        invoiceDate: '发票日期',
        customsInvoiceType: '科目',
        contractNo: '采购合同号',
        taxAmount: '税额',
        currency: '币种',
        dueDate: '缴款期限',
        productCode: '商品',
        productName: '商品',
        invoiceQuantity: '发票数量',
        taxRate: '税率(%)',
        dutyPayingValue: '完税价格',
        allotQuantity: '分摊数量',
        allotStatus: '分摊状态',
        remainAllotQuantity: '剩余分摊数量'
      }
    },
    // 海关发票分摊
    customsInvoiceAllot: {
      form: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        invoiceNo: '海关发票号',
        customsNo: '海关',
        invoiceDate: '发票日期',
        customsInvoiceType: '科目',
        contractNo: '采购合同号',
        taxAmount: '税额',
        currency: '币种',
        productCode: '商品',
        allotQuantity: '分摊数量',
        taxRate: '税率',
        customsInvoiceDetailNo: '海关发票详细单据号',
        customsInvoiceNo: '海关发票单据号'
      },
      tab: {
        customsInvoiceAllotDetailInfoTab: '发票分摊详细信息'
      },
      btn: { customsInvoiceAllot: '海关发票分摊' },
      popup: {
        list: '海关发票分摊列表',
        edit: '海关发票分摊编辑',
        customsInvoiceAllotDetailInfoTab: '发票分摊详细信息'
      },
      group: {
        editPart1: '海关发票分摊信息'
      },
      list: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        invoiceNo: '海关发票号',
        customsNo: '海关',
        invoiceDate: '发票日期',
        customsInvoiceType: '科目',
        contractNo: '采购合同号',
        customsInvoiceNo: '海关发票单据号',
        taxAmount: '税额',
        taxPrice: '税额价格',
        currency: '币种',
        allotQuantity: '分摊数量',
        productCode: '商品',
        taxRate: '税率(%)',
        lotNo: '批次号',
        remark: '备注',
        customsInvoiceDetailNo: '海关发票单据详细号',
        dutyPayingValue: '完税价格',
        invoiceQuantity: '发票数量',
        allotStatus: '分摊状态',
        remainAllotQuantity: '剩余分摊数量'
      }
    },
    feeInvoiceAllot: {
      form: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        invoiceNo: '费用发票号',
        invoiceDate: '发票日期',
        customerNo: '服务商',
        customerName: '服务商',
        feeContractNo: '费用合同号',
        taxAmount: '税额',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        feeType: '费用类型',
        feeInvoiceDetailNo: '费用明细单据号',
        feeInvoiceNo: '费用发票单据号',
        productCode: '商品',
        allotQuantity: '分摊数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率',
        includeTaxPrice: '发票价格(含税)',
        remark: '备注'
      },
      tab: {
        feeInvoiceAllotDetailTab: '费用发票分摊详细信息'
      },
      btn: { feeInvoiceAllot: '费用发票分摊' },
      popup: {
        list: '费用发票分摊列表',
        edit: '费用发票分摊编辑',
        feeInvoiceAllotDetailInfoTab: '费用发票分摊详细信息'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        invoiceNo: '费用发票号',
        invoiceDate: '发票日期',
        customerNo: '服务商',
        customerName: '服务商',
        feeContractNo: '费用合同号',
        taxAmount: '税额',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        feeType: '费用类型',
        feeInvoiceDetailNo: '费用明细单据号',
        feeInvoiceNo: '费用发票单据号',
        productCode: '商品',
        allotQuantity: '分摊数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        includeTaxPrice: '发票价格(含税)',
        remark: '备注',
        allotAmount: '分摊金额',
        invoiceQuantity: '发票数量',
        taxRate: '税率(%)',
        contractNo: '合同号',
        lotNo: '批次号',
        canAllotAmount: '剩余分摊金额',
        allotStatus: '分摊状态'
      }
    },
    feeInfo: {
      form: {
        feeNo: '单据号',
        customerNo: '服务商',
        feeDate: '费用日期',
        feeContractNo: '费用合同号',
        excludeTaxAmount: '不含税金额',
        feeDirection: '费用方向',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种'
      },
      tab: {
        feeInfoDetailInfoTab: '费用详细信息'
      },
      popup: {
        list: '费用信息列表',
        edit: '费用信息编辑',
        feeInfoDetailInfoTab: '费用详细信息',
        detailList: '费用详细信息列表'
      },
      group: {
        editPart1: '基本信息'
      },
      detail: {
        feeNo: '单据号',
        feeDate: '费用日期',
        customerNo: '结算单位',
        feeContractNo: '费用合同号',
        excludeTaxAmount: '不含税金额',
        feeDirection: '费用方向',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        costFlag: '进成本',
        transactionFlag: '进往来',
        settlementFlag: '结算标志',
        remark: '备注',
        taxRate: '税率',
        quantityUnit: '数量单位',
        feeName: '费用类型',
        feeQuantity: '费用数量',
        excludeTaxPrice: '不含税价格',
        includeTaxPrice: '含税价格',
        feeDetailNo: '费用明细单据号',
        typeCode: '单据类型',
        productCode: '商品名称'
      },
      list: {
        feeNo: '单据号',
        feeDate: '费用日期',
        custName: '服务商',
        feeContractNo: '费用合同号',
        excludeTaxAmount: '不含税金额',
        feeDirection: '费用方向',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        feeSource: '费用来源',
        billNo: '业务单据号',
        feeName: '费用类型',
        includeTaxPrice: '含税单价',
        quantity: '数量',
        taxRate: '税率',
        costFlag: '进成本',
        intercourseFlag: '进往来',
        productName: '商品名称',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        settleQuantity: '结算数量'
      }
    },
    feeSettle: {
      form: {
        settleNo: '单据号',
        customerNo: '结算单位',
        settleDate: '结算日期',
        excludeTaxAmount: '不含税金额',
        feeDirection: '费用方向',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种'
      },
      btn: { feeDetailSelect: '费用明细选择' },
      tab: {
        feeSettleFeeDetailDtoList: '费用信息',
        settleDetailDtoList: '结算信息'
      },
      popup: {
        list: '费用信息列表',
        edit: '费用信息编辑',
        feeInfoDetailInfoTab: '费用详细信息',
        feeSettleDetail: '费用结算明细列表',
        feeSettleFeeDetail: '费用结算详细信息列表'
      },
      group: {
        editPart1: '基本信息'
      },
      feeSettleDetail: {
        settleDetailNo: '明细单据号',
        settleNo: '单据号',
        settleDate: '结算日期',
        customerNo: '结算单位',
        feeDirection: '费用方向',
        excludeTaxAmount: '结算金额(不含税)',
        taxAmount: '税额',
        includeTaxAmount: '结算金额(含税)',
        currency: '币种',
        taxRate: '结算税率',
        quantityUnit: '计量单位',
        feeNameCode: '费用类型',
        feeQuantity: '结算数量',
        excludeTaxPrice: '结算无税单价',
        includeTaxPrice: '结算单价',
        feeNo: '单据号',
        feeDate: '费用日期',
        custName: '结算商',
        feeContractNo: '费用合同号',
        costFlag: '进成本',
        transactionFlag: '进往来',
        settlementFlag: '结算标志',
        remark: '备注',
        feeName: '费用类型',
        feeDetailNo: '费用明细单据号',
        typeCode: '单据类型',
        productName: '商品名称',
        allotAmount: '分摊金额'
      },
      feeSettleFeeDetailDto: {
        settleFeeDetailNo: '明细单据号',
        settleNo: '单据号',
        settleDate: '结算日期',
        feeDetailNo: '费用明细单据号',
        feeNo: '费用单据号',
        customerNo: '结算单位',
        feeContractNo: '费用合同号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型',
        quantityUnit: '计量单位',
        excludeTaxPrice: '结算无税单价',
        includeTaxPrice: '结算单价',
        taxRate: '结算税率',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        feeDate: '费用日期',
        custName: '结算商',
        currency: '币种',
        costFlag: '进成本',
        transactionFlag: '进往来',
        settlementFlag: '结算标志',
        remark: '备注',
        feeName: '费用类型',
        feeQuantity: '结算数量',
        typeCode: '单据类型',
        productName: '商品名称',
        costQuantity: '费用数量',
        feeTaxRate: '费用税率',
        feeExcludeTaxPrice: '费用无税单价',
        feeIncludeTaxPrice: '费用单价',
        allotAmount: '分摊金额'
      },
      list: {
        settleNo: '单据号',
        customerNo: '结算单位',
        settleDate: '结算日期',
        excludeTaxAmount: '结算金额(不含税)',
        feeDirection: '费用方向',
        taxAmount: '税额',
        includeTaxAmount: '结算金额(含税)',
        currency: '币种',
        feeName: '费用类型'
      }
    },
    feeApplyInfo: {
      list: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '结算单位',
        otherCustomerNo: '其他结算单位',
        applyType: '申请类型',
        businessType: '业务类别',
        claimNo: '费用认领单据号',
        applyAmount: '申请金额',
        currency: '币种',
        latestPaymentDate: '最迟付款日期',
        remark: '备注',
        confirmAmount: '确认金额',
        confirmStatus: '确认状态',
        transferAmount: '转换金额',
        transferFlag: '转换标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态'
      },
      form: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '结算单位',
        otherCustomerNo: '其他结算单位',
        applyType: '申请类型',
        businessType: '业务类别',
        claimNo: '费用认领单据号',
        applyAmount: '申请金额',
        currency: '币种',
        latestPaymentDate: '最迟付款日期',
        remark: '备注',
        confirmAmount: '确认金额',
        confirmStatus: '确认状态',
        transferAmount: '转换金额',
        transferFlag: '转换标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态'
      },
      group: {
        editPart1: '付款申请信息',
        selectFeeSettle: '选择费用结算单'
      },
      tab: {
        feeApplyDetailDtoList: '付款申请详细信息'
      },
      feeApplyDetail: {
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型',
        applyAmount: '申请金额',
        currency: '币种',
        confirmAmount: '确认金额'
      }
    },
    // 费用收票认领
    feeInvoiceClaim: {
      msg: {
      },
      btn: {},
      form: {
        claimNo: '单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        receiveNo: '费用收票单据号',
        receiveDetailNo: '费用收票明细单据号',
        feeNameCode: '费用类型',
        claimQuantity: '认领数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种'
      },
      tab: {
        feeInvoiceClaimDetailDtoList: '费用发票认领详细信息'
      },
      popup: {

      },
      group: {
        editPart1: '费用收票认领信息'
      },
      list: {
        claimNo: '单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        receiveNo: '费用收票单据号',
        receiveDetailNo: '费用收票明细单据号',
        feeNameCode: '费用类型',
        claimQuantity: '认领数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种'
      },
      detail: {
        claimNo: '单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        receiveNo: '费用收票单据号',
        receiveDetailNo: '费用收票明细单据号',
        feeNameCode: '费用类型',
        claimQuantity: '认领数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向'
      }
    },
    // 费用收款认领
    feeClaim: {
      msg: {
      },
      btn: {},
      form: {
        claimNo: '单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        receiveNo: '收款登记单据号',
        claimType: '认领类型',
        businessType: '业务类别',
        applyNo: '费用申请单据号',
        claimAmount: '认领金额',
        currency: '币种',
        transferAmount: '转换金额',
        transferFlag: '转换标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态'
      },
      tab: {
        feeClaimDetailDtoList: '费用收款认领详细信息'
      },
      popup: {
        advClaimList: '预收款认领列表'
      },
      group: {
        editPart1: '费用收款认领信息'
      },
      list: {
        claimNo: '单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        receiveNo: '收款登记单据号',
        claimType: '认领类型',
        businessType: '业务类别',
        applyNo: '费用申请单据号',
        claimAmount: '认领金额',
        currency: '币种',
        transferAmount: '转换金额',
        transferFlag: '转换标志',
        refundAmount: '退款金额',
        refundFlag: '退款标志',
        usedAmount: '使用金额',
        useStatus: '使用状态'
      },
      detail: {
        claimNo: '单据号',
        claimDetailNo: '明细单据号',
        customerNo: '客户',
        claimDate: '认领日期',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeNameCode: '费用类型',
        claimAmount: '认领金额',
        currency: '币种',
        feeDirection: '费用方向'
      }
    },
    // 费用开票申请
    feeInvoiceApply: {
      form: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '服务商',
        customerName: '服务商',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        latestInvoiceDate: '最迟开票日期',
        confirmStatus: '确认状态',
        applyDetailNo: '明细单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型'
      },
      tab: {
        applyDetailInfoTab: '费用开票申请详细信息'
      },
      popup: {
        list: '费用开票申请列表',
        edit: '费用开票申请编辑',
        applyDetailInfoTab: '费用开票申请详细信息'
      },
      group: {
        editPart1: '费用开票申请信息'
      },
      list: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '服务商',
        customerName: '服务商',
        latestInvoiceDate: '最迟开票日期',
        applyDetailNo: '明细单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型',
        applyQuantity: '申请数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        confirmAmount: '确认金额(含税)',
        confirmStatus: '确认状态'
      }
    },
    // 费用开票确认
    feeInvoiceConfirm: {
      form: {
        confirmNo: '单据号',
        invoiceDate: '发票日期',
        invoiceNo: '发票号',
        customerNo: '服务商',
        customerName: '服务商',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        confirmDetailNo: '明细单据号',
        feeNameCode: '费用类型',
        confirmJoinDetailNo: '明细单据号',
        applyDetailNo: '费用开票申请明细单据号',
        applyNo: '费用开票申请单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向'
      },
      tab: {
        confirmDetailInfoTab: '费用开票确认明细信息',
        confirmJoinDetailInfoTab: '费用开票确认关联申请明细信息'
      },
      popup: {
        list: '费用开票确认列表',
        edit: '费用开票确认编辑',
        confirmDetailInfoTab: '费用开票确认明细信息',
        confirmJoinDetailInfoTab: '费用开票确认关联申请明细信息'
      },
      group: {
        editPart1: '费用开票确认信息'
      },
      list: {
        confirmNo: '单据号',
        invoiceDate: '发票日期',
        invoiceNo: '发票号',
        customerNo: '服务商',
        customerName: '服务商',
        confirmDetailNo: '明细单据号',
        feeNameCode: '费用类型',
        invoiceQuantity: '发票数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        confirmJoinDetailNo: '明细单据号',
        applyDetailNo: '费用开票申请明细单据号',
        applyNo: '费用开票申请单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        confirmQuantity: '确认数量'
      }
    },
    // 费用预收款转换
    feeClaimAdvTran: {
      list: {
        transferNo: '单据号',
        transferDate: '转换日期',
        customerNo: '客户',
        claimNo: '费用认领单据号',
        transferAmount: '转换金额',
        currency: '币种'
      },
      form: {
        transferNo: '单据号',
        transferDate: '转换日期',
        customerNo: '客户',
        claimNo: '费用认领单据号',
        transferAmount: '转换金额',
        currency: '币种'
      },
      detail: {
        transferNo: '单据号',
        transferDate: '转换日期',
        customerNo: '客户',
        claimNo: '费用认领单据号',
        transferAmount: '转换金额',
        currency: '币种',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型'
      },
      group: {
        editPart1: '预收款转换信息'
      },
      tab: {
        transferDetailInfoTab: '费用预收款转换明细'
      }
    },
    // 费用预付款转换
    feeAdvanceApplyTransfer: {
      form: {
        transferNo: '单据号',
        transferDate: '转换日期',
        customerNo: '服务商',
        customerName: '服务商',
        applyNo: '费用申请单号',
        transferAmount: '转换金额',
        currency: '币种',
        transferDetailNo: '明细单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型'
      },
      tab: {
        transferDetailInfoTab: '费用预付款转换详细信息'
      },
      popup: {
        list: '费用预付款转换列表',
        edit: '费用预付款转换编辑',
        transferDetailInfoTab: '费用预付款转换详细信息'
      },
      group: {
        editPart1: '费用预付款转换信息'
      },
      list: {
        transferNo: '单据号',
        transferDate: '转换日期',
        customerNo: '服务商',
        customerName: '服务商',
        applyNo: '费用申请单号',
        transferAmount: '转换金额',
        currency: '币种',
        transferDetailNo: '明细单据号',
        settleNo: '费用结算单据号',
        settleDetailNo: '费用结算明细单据号',
        feeDirection: '费用方向',
        feeNameCode: '费用类型'
      }
    },
    feeAllot: {
      form: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        customerNo: '服务商',
        customerName: '服务商',
        taxAmount: '税额',
        includeTaxAmount: '分摊金额(含税)',
        currency: '币种',
        feeType: '费用类型',
        settleDetailNo: '结算明细单号',
        settleNo: '结算单号',
        productCode: '商品',
        allotQuantity: '分摊数量',
        excludeTaxPrice: '结算价格(不含税)',
        excludeTaxAmount: '分摊金额(不含税)',
        taxRate: '税率',
        includeTaxPrice: '结算价格(含税)',
        remark: '备注'
      },
      tab: {
        feeAllotDetailTab: '费用分摊详细信息'
      },
      btn: { feeInvoiceAllot: '费用发票分摊' },
      popup: {
        list: '费用分摊列表',
        edit: '费用分摊编辑',
        feeAllotDetailInfoTab: '费用分摊详细信息'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        allotNo: '单据号',
        allotDate: '分摊日期',
        invoiceDate: '发票日期',
        customerNo: '服务商',
        customerName: '服务商',
        taxAmount: '税额',
        includeTaxAmount: '分摊金额(含税)',
        currency: '币种',
        feeType: '费用类型',
        settleDetailNo: '结算明细单号',
        settleNo: '结算单号',
        productCode: '商品',
        allotQuantity: '分摊数量',
        excludeTaxPrice: '结算价格(不含税)',
        excludeTaxAmount: '分摊金额(不含税)',
        includeTaxPrice: '结算价格(含税)',
        remark: '备注',
        allotAmount: '分摊金额',
        invoiceQuantity: '发票数量',
        taxRate: '税率(%)',
        contractNo: '合同号',
        lotNo: '批次号',
        canAllotAmount: '剩余分摊金额',
        allotStatus: '分摊状态'
      }
    }
  }
}
