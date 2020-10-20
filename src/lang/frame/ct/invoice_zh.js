export default {
  invoice: {
    // 开票登记（外贸）
    foreignInvoiceMake: {
      form: {
        localCurrencyAmout: '本币金额',
        makeNo: '单据号',
        diffAmount: '差额',
        invoiceAmount: '发票金额',
        remark: '备注',
        invoiceDate: '发票日期',
        receiveUserName: '开票人',
        customerName: '客户',
        lotNo: '销售批次',
        receiveUserCode: '开票人',
        exchangeRate: '汇率',
        provisionalAmount: '临时/调整发票金额',
        invoiceType: '发票类型',
        currency: '币种',
        loadingPlace: '起运地',
        dischargePlace: '目的地',
        invoiceNo: '发票号',
        customerNo: '供应商',
        priceTerm: '价格条款',
        provisionalNo: '临时/调整发票号'
      },
      tab: {
        invoiceDetailInfoTab: '发票信息'
      },
      popup: {
        provisionalEdit: '开票登记（外贸）编辑',
        proFinalEdit: '开票登记（外贸）编辑',
        finalEdit: '开票登记（外贸）编辑',
        invoiceDetailInfoTab: '发票信息',
        list: '开票登记（外贸）列表',
        adjustEdit: '开票登记（外贸）编辑'
      },
      group: {
        adjustEditPart1: '基本信息',
        provisionalEditPart1: '基本信息',
        proFinalEditPart1: '基本信息',
        finalEditPart1: '基本信息'
      },
      list: {
        makeNo: '单据号',
        diffAmount: '差额',
        invoiceAmount: '发票金额',
        dryWeight: '干重',
        invoiceDate: '发票日期',
        receiveUserName: '开票人',
        customerName: '客户',
        grossWeight: '毛重',
        netWeight: '净重',
        productCode: '商品',
        lotNo: '销售批次',
        invoiceType: '发票类型',
        currency: '币种',
        invoiceNo: '发票号',
        prevInvoiceNo: '临时/调整单据号',
        prevInvoiceAmount: '临时/调整发票金额',
        invoicePrice: '发票单价',
        brandCode: '品牌'
      },
      msg: {
        chooseLotProduct: '只可以选择同一批次中的商品明细',
        noPostData: '选择单据无法进行开票登记操作。'
      }
    },
    // 开票确认（内贸）
    domesticInvoiceConfirm: {
      form: {
        confirmNo: '单据号',
        invoiceNo: '发票号',
        customerNo: '客户',
        customerName: '客户',
        invoiceDate: '发票日期',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        productCode: '商品',
        invoiceName: '发票名称',
        applyNo: '申请单号',
        contractNo: '合同号',
        lotNo: '批次号'
      },
      tab: {
        applyDetailInfoTab: '开票申请详细信息',
        confirmDetailInfoTab: '开票详细信息'
      },
      popup: {
        applyDetailInfoTab: '开票申请详细信息',
        confirmDetailInfoTab: '开票详细信息',
        edit: '开票确认（内贸）编辑',
        list: '开票确认（内贸）列表',
        productDetailList: '开票确认（内贸）明细列表'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        confirmNo: '单据号',
        invoiceNo: '发票号',
        customerNo: '客户',
        customerName: '客户',
        invoiceDate: '发票日期',
        productCode: '商品',
        productName: '商品',
        invoiceName: '发票名称',
        invoiceQuantity: '发票数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        applyNo: '申请单号',
        applyDetailNo: '申请明细编号',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        confirmQuantity: '确认数量',
        unVerificatQuantity: '未核销数量',
        verificatStatus: '未核销状态'
      }
    },
    // 开票申请（内贸）
    domesticInvoiceApply: {
      msg: {
        domesticInvoiceConfirm: '只有审批状态为已通过并且确认状态不为全部确认的才能开票确认',
        quickMakeOutInvoiceMsg: '请选择确认状态未全部确认的开票申请信息'
      },
      btn: {
        domesticInvoiceConfirm: '开票确认(内贸)',
        quickMakeOutInvoice: '快速开票'
      },
      form: {
        applyNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        latestInvoiceDate: '最迟开票日期',
        confirmStatus: '确认状态',
        contractNo: '合同号',
        lotNo: '批次号',
        productCode: '商品',
        applyInvoiceType: '开票类型'
      },
      tab: {
        applyDetailInfoTab: '开票申请（内贸）详细信息'
      },
      popup: {
        edit: '开票申请（内贸）编辑',
        applyDetailInfoTab: '开票申请（内贸）详细信息',
        list: '开票申请（内贸）列表'
      },
      group: {
        editPart1: '开票申请（内贸）信息'
      },
      list: {
        applyNo: '单据号',
        customerNo: '客户',
        customerName: '客户',
        applyDate: '申请日期',
        latestInvoiceDate: '最迟开票日期',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        productCode: '商品',
        productName: '商品',
        invoiceName: '发票名称',
        applyAmount: '申请金额',
        applyQuantity: '申请数量',
        invoiceQuantity: '发票数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        confirmQuantity: '确认数量',
        confirmStatus: '确认状态',
        applyInvoiceType: '开票类型',
        outNoticeNo: '出库单号'
      }
    },
    // 收票登记（外贸）
    foreignInvoiceReceive: {
      form: {
        localCurrencyAmout: '本币金额',
        receiveDate: '收票日期',
        diffAmount: '差额',
        invoiceAmount: '发票金额',
        remark: '备注',
        invoiceDate: '发票日期',
        receiveUserName: '收票人',
        customerName: '供应商',
        lotNo: '采购批次',
        receiveUserCode: '收票人',
        receiveNo: '单据号',
        exchangeRate: '汇率',
        provisionalAmount: '临时/调整发票金额',
        invoiceType: '发票类型',
        currency: '币种',
        loadingPlace: '起运地',
        dischargePlace: '目的地',
        invoiceNo: '发票号',
        customerNo: '客户',
        priceTerm: '价格条款',
        provisionalNo: '临时/调整发票号'
      },
      tab: {
        invoiceDetailInfoTab: '发票信息'
      },
      popup: {
        provisionalEdit: '收票登记（外贸）编辑',
        proFinalEdit: '收票登记（外贸）编辑',
        finalEdit: '收票登记（外贸）编辑',
        invoiceDetailInfoTab: '发票信息',
        list: '收票登记（外贸）列表',
        adjustEdit: '收票登记（外贸）编辑'
      },
      group: {
        adjustEditPart1: '基本信息',
        provisionalEditPart1: '基本信息',
        proFinalEditPart1: '基本信息',
        finalEditPart1: '基本信息'
      },
      list: {
        diffAmount: '差额',
        receiveDate: '收票日期',
        invoiceAmount: '发票金额',
        dryWeight: '干重',
        invoiceDate: '发票日期',
        receiveUserName: '收票人',
        customerName: '客户',
        grossWeight: '毛重',
        netWeight: '净重',
        productCode: '商品',
        lotNo: '采购批次',
        receiveNo: '单据号',
        invoiceType: '发票类型',
        currency: '币种',
        invoiceNo: '发票号',
        prevInvoiceNo: '临时/调整单据号',
        invoicePrice: '发票单价',
        brandCode: '品牌',
        taxAmount: '税额',
        verificatStatus: '核销状态',
        unVerificatQuantity: '未核销数量'
      },
      msg: {
        chooseLotProduct: '只可以选择同一批次中的商品明细',
        postNoData: '选择单据无法进行收票登记操作。'
      }
    },
    // 收票认领（内贸）
    domesticInvoiceClaim: {
      form: {
        claimNo: '单据号',
        claimDate: '认领日期',
        customerNo: '供应商',
        customerName: '供应商',
        productCode: '商品',
        productName: '商品',
        receiveNo: '登记单号',
        receiveDetailNo: '登记明细编号',
        claimQuantity: '认领数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种'
      },
      tab: {
        claimDetailInfoTab: '收票认领（内贸）详细信息'
      },
      popup: {
        edit: '收票认领（内贸）编辑',
        claimDetailInfoTab: '收票认领（内贸）详细信息',
        list: '收票认领（内贸）列表'
      },
      group: {
        editPart1: '收票认领（内贸）信息'
      },
      list: {
        claimNo: '单据号',
        claimDate: '认领日期',
        customerNo: '供应商',
        customerName: '供应商',
        receiveNo: '登记单号',
        receiveDetailNo: '登记明细编号',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        relateBillNo: '入库单号',
        relateBillType: '关联单据类型',
        productCode: '商品',
        productName: '商品',
        claimQuantity: '认领数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种'
      }
    },
    // 收票登记（内贸）
    domesticInvoiceReceive: {
      form: {
        receiveNo: '单据号',
        invoiceNo: '发票号',
        customerNo: '供应商',
        customerName: '供应商',
        invoiceDate: '发票日期',
        excludeTaxAmount: '不含税金额',
        taxAmount: '税额',
        includeTaxAmount: '含税金额',
        currency: '币种',
        claimStatus: '认领状态',
        productCode: '商品',
        invoiceName: '发票名称'
      },
      tab: {
        invoiceDetailInfoTab: '发票信息'
      },
      popup: {
        edit: '收票登记（内贸）编辑',
        invoiceDetailInfoTab: '发票信息',
        list: '收票登记（内贸）列表'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        receiveNo: '单据号',
        receiveDetailNo: '明细编号',
        invoiceNo: '发票号',
        customerNo: '供应商',
        customerName: '供应商',
        invoiceDate: '发票日期',
        productCode: '商品',
        productName: '商品',
        invoiceName: '发票名称',
        invoiceQuantity: '发票数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '发票金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '发票金额(含税)',
        currency: '币种',
        claimStatus: '认领状态',
        claimQuantity: '认领数量'
      }
    },
    // 海关增值税发票
    importVat: {
      form: {
        importVatNo: '单据号',
        customHouseCode: '海关',
        receiveUserCode: '收票人',
        contractNo: '采购合同',
        dueDate: '缴款期限',
        receiveDate: '收票日期',
        currency: '币种',
        remark: '备注',
        invoiceNo: '发票号',
        invoiceDate: '发票日期',
        taxAmount: '税额'
      },
      tab: {
        importVatDetailInfoTab: '货物信息'
      },
      popup: {
        importVatDetailInfoTab: '货物信息',
        edit: '海关增值税发票编辑',
        list: '海关增值税发票列表'
      },
      group: {
        editPart1: '基本信息'
      },
      list: {
        importVatNo: '单据号',
        invoiceName: '发票名称',
        dutyPayingValue: '完税价格',
        contractNo: '采购合同',
        dueDate: '缴款期限',
        receiveDate: '收票日期',
        invoiceDate: '发票日期',
        receiveUserName: '收票人',
        taxRate: '税率(%)',
        productCode: '商品',
        invoiceQuantity: '发票数量',
        customHouseName: '海关',
        currency: '币种',
        invoiceNo: '发票号',
        taxAmount: '税额'
      }
    },
    statisticalReport: {
      form: {
        title: '应收总账表',
        organization: '机构',
        customer: '客戶',
        period: '期间'
      },
      list: {
        period: '期间',
        abstract: '摘要',
        periodOfAccepted: '本期应收',
        currentReceipts: '本期收款',
        balance: '余额'
      },
      receivableDetail: {
        form: {
          title: '应收明细表',
          organization: '机构',
          customer: '客戶',
          date: '日期'
        },
        list: {
          customer: '客戶',
          date: '日期',
          abstract: '摘要',
          businessType: '业务类型',
          moneyType: '款项类型',
          billNo: '单据号',
          currencyType: '币种',
          periodOfAccepted: '本期应收',
          currentReceipts: '本期收款',
          balance: '余额'
        }
      }
    },
    invoiceSelect: {
      popup: {
        title: '临时/调整发票选择'
      }
    },
    // 发票检查
    check: {
      // 内贸未到发票检查
      domesticBuyInvoiceCheck: {
        form: {
          contractNo: '合同号',
          lotNo: '批次号',
          signDate: '签订日期',
          headlineCode: '抬头',
          supplierCode: '供应商',
          productCode: '商品'
        },
        list: {
          productDetailNo: '批次商品明细号',
          lotNo: '批次号',
          contractNo: '合同号',
          signDate: '签订日期',
          productCode: '商品',
          productName: '商品',
          lotMeasurementQuantity: '批次计价数量',
          measurementUnitCode: '计量单位',
          lotIncludeTaxAmount: '批次含税金额',
          currency: '币种',
          headlineNames: '抬头',
          supplierNames: '供应商',
          noticeMeasurementQuantity: '通知计价数量',
          checkMeasurementQuantity: '验收计价数量',
          hasInvoiceQuantity: '发票计价数量',
          hasInvoiceAmount: '发票含税金额',
          noneInvoiceQuantity: '未到票重量'
        }
      },
      // 内贸未开发票检查
      domesticSaleInvoiceCheck: {
        form: {
          contractNo: '合同号',
          lotNo: '批次号',
          signDate: '签订日期',
          headlineCode: '抬头',
          customerCode: '客户',
          productCode: '商品'
        },
        list: {
          productDetailNo: '批次商品明细号',
          lotNo: '批次号',
          contractNo: '合同号',
          signDate: '签订日期',
          productCode: '商品',
          productName: '商品',
          lotMeasurementQuantity: '批次计价数量',
          measurementUnitCode: '计量单位',
          lotIncludeTaxAmount: '批次含税金额',
          currency: '币种',
          headlineNames: '抬头',
          customerNames: '客户',
          noticeMeasurementQuantity: '通知计价数量',
          checkMeasurementQuantity: '验收计价数量',
          hasApplyInvoiceQuantity: '申请发票计价数量',
          hasApplyInvoiceAmount: '申请发票含税金额',
          hasInvoiceQuantity: '发票计价数量',
          hasInvoiceAmount: '发票含税金额',
          noneApplyInvoiceQuantity: '未申请开票重量'
        }
      }

    },
    // 预开票核销（内贸）
    invoiceDomPreVer: {
      form: {
        verificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '客户',
        customerName: '客户名称',
        invoiceNo: '发票号',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        outBillNo: '出库单号',
        productCode: '商品',
        productName: '商品',
        verificatQuantity: '核销数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '核销金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '核销金额(含税)',
        currency: '币种'
      },
      tab: {
        preVerDetailInfoTab: '预开票核销（内贸）详细信息'
      },
      popup: {
        edit: '预开票核销（内贸）编辑',
        preVerDetailInfoTab: '预开票核销（内贸）详细信息',
        list: '预开票核销（内贸）列表'
      },
      group: {
        editPart1: '预开票核销（内贸）信息'
      },
      list: {
        verificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '客户',
        customerName: '客户名称',
        invoiceNo: '发票号',
        contractNo: '合同号',
        lotNo: '批次号',
        lotDetailNo: '批次详细号',
        outBillNo: '出库单号',
        productCode: '商品',
        productName: '商品',
        verificatQuantity: '核销数量',
        excludeTaxPrice: '发票价格(不含税)',
        excludeTaxAmount: '核销金额(不含税)',
        taxRate: '税率(%)',
        taxAmount: '税额',
        includeTaxPrice: '发票价格(含税)',
        includeTaxAmount: '核销金额(含税)',
        currency: '币种'
      }
    },
    // 收票核销(外贸)
    foreignInvoiceReceiveVer: {
      list: {
        receiveVerificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '供应商',
        lotNo: '采购批次',
        invoiceNo: '发票号',
        includeTaxAmount: '核销金额',
        currency: '币种',
        productCode: '商品',
        grossWeight: '毛重',
        netWeight: '净重',
        dryWeight: '干重',
        invoicePrice: '发票单价',
        invoiceAmount: '发票金额',
        verificatQuantity: '核销数量',
        verificatAmount: '核销金额',
        inBillNo: '入库单号',
        inProductNo: '入库商品明细号'
      },
      form: {
        receiveVerificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '供应商',
        lotNo: '采购批次',
        invoiceNo: '发票号',
        includeTaxAmount: '核销金额',
        currency: '币种',
        productCode: '商品',
        grossWeight: '毛重',
        netWeight: '净重',
        dryWeight: '干重',
        invoicePrice: '发票单价',
        invoiceAmount: '发票金额',
        verificatQuantity: '核销数量',
        verificatAmount: '核销金额',
        inBillNo: '入库单号',
        inProductNo: '入库商品明细号'
      },
      group: { editPart1: '收票核销(外贸)信息' },
      tab: {
        receiveVerJoinDetailInfoTab: '收票详细信息',
        receiveVerDetailInfoTab: '核销详细信息'
      }

    },
    // 开票核销(外贸)
    foreignInvoiceMakeVer: {
      list: {
        makeVerificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '供应商',
        lotNo: '销售批次',
        invoiceNo: '发票号',
        includeTaxAmount: '核销金额',
        currency: '币种',
        productCode: '商品',
        grossWeight: '毛重',
        netWeight: '净重',
        dryWeight: '干重',
        invoicePrice: '发票单价',
        invoiceAmount: '发票金额',
        verificatQuantity: '核销数量',
        verificatAmount: '核销金额',
        outBillNo: '出库单号',
        outProductNo: '出库商品明细号'
      },
      form: {
        makeVerificatNo: '单据号',
        verificatDate: '核销日期',
        customerNo: '供应商',
        lotNo: '销售批次',
        invoiceNo: '发票号',
        includeTaxAmount: '核销金额',
        currency: '币种',
        productCode: '商品',
        grossWeight: '毛重',
        netWeight: '净重',
        dryWeight: '干重',
        invoicePrice: '发票单价',
        invoiceAmount: '发票金额',
        verificatQuantity: '核销数量',
        verificatAmount: '核销金额',
        outBillNo: '出库单号',
        outProductNo: '出库商品明细号'
      },
      group: { editPart1: '开票核销(外贸)信息' },
      tab: {
        makeVerJoinDetailInfoTab: '开票详细信息',
        makeVerDetailInfoTab: '核销详细信息'
      }

    }
  }
}
