export default {
  lc: {
    lcApply: {
      btn: { lcConfirm: '开信用证确认' },
      msg: { lcConfirm: '只有审批状态为已通过并且确认标志为否的单据才能开信用证确认' },
      form: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '供应商',
        customerName: '供应商',
        contractNo: '采购合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '申请金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        confirmFlag: '确认标志'
      },
      tab: {},
      popup: {
        edit: '开证申请编辑',
        list: '开证申请列表'
      },
      group: {
        editPart1: '开证申请信息'
      },
      list: {
        applyNo: '单据号',
        applyDate: '申请日期',
        customerNo: '供应商',
        customerName: '供应商',
        contractNo: '采购合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '申请金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        confirmFlag: '确认标志'
      }
    },
    lcConfirm: {
      form: {
        confirmNo: '单据号',
        letterCreditNo: '信用证号',
        issueDate: '信用证日期',
        applyNo: '申请单号',
        customerNo: '供应商',
        customerName: '供应商',
        contractNo: '采购合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '信用证金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        dueDate: '到期日',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        useFlag: '是否使用'
      },
      tab: {},
      popup: {
        edit: '开证确认编辑',
        list: '开证确认列表'
      },
      group: {
        editPart1: '开证确认信息'
      },
      list: {
        confirmNo: '单据号',
        letterCreditNo: '信用证号',
        issueDate: '信用证日期',
        applyNo: '申请单号',
        customerNo: '供应商',
        customerName: '供应商',
        contractNo: '采购合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '信用证金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        dueDate: '到期日',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        useFlag: '是否使用',
        usedAmount: '已用金额',
        useStatus: '使用状态'
      }
    },
    lcReceive: {
      form: {
        receiveNo: '单据号',
        letterCreditNo: '信用证号',
        issueDate: '信用证日期',
        customerNo: '客户',
        customerName: '客户',
        contractNo: '销售合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '信用证金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        dueDate: '到期日',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        letterCreditStatus: '状态',
        useFlag: '是否使用'
      },
      tab: {},
      popup: {
        edit: '收证登记编辑',
        list: '收证登记列表'
      },
      group: {
        editPart1: '收证信息'
      },
      btn: {
        lcDiscount: '信用证贴现',
        lcNegotiate: '信用证议付'
      },
      msg: {
        lcDiscount: '只有审批状态为已通过并且使用标志为否的单据才能信用证贴现',
        lcNegotiate: '只有审批状态为已通过并且使用标志为否的单据才能信用证议付'
      },
      list: {
        receiveNo: '单据号',
        letterCreditNo: '信用证号',
        issueDate: '信用证日期',
        customerNo: '客户',
        customerName: '客户',
        contractNo: '销售合同',
        moreOrLess: '溢短装(%)',
        letterCreditAmount: '信用证金额',
        currency: '币种',
        lcType: '信用证类型',
        usanceDays: '远期天数',
        dueDate: '到期日',
        issuingBank: '开证行',
        adviseBank: '通知行',
        negoBank: '议付行',
        letterCreditStatus: '状态',
        useFlag: '是否使用'
      }
    },
    lcDiscount: {
      form: {
        discountNo: '单据号',
        letterCreditNo: '信用证号',
        discountDate: '贴现日期',
        letterCreditAmount: '信用证金额',
        discountBank: '贴现行',
        discountRate: '贴现利率',
        discountDays: '贴现天数',
        discountInterest: '贴现利息',
        discountServiceFee: '贴现手续费',
        discountAmount: '实付贴现金额',
        bankAccountCode: '账号',
        bankName: '银行',
        remark: '备注',
        currency: '币种',
        dueDate: '到期日'
      },
      group: {
        editPart1: '信用证贴现信息'
      },
      list: {
        discountNo: '单据号',
        letterCreditNo: '信用证号',
        discountDate: '贴现日期',
        letterCreditAmount: '信用证金额',
        discountBank: '贴现行',
        discountRate: '贴现利率',
        discountDays: '贴现天数',
        discountInterest: '贴现利息',
        discountServiceFee: '贴现手续费',
        discountAmount: '实付贴现金额',
        bankAccountCode: '账号',
        bankName: '银行',
        remark: '备注',
        currency: '币种',
        dueDate: '到期日'
      }
    },
    lcNegotiate: {
      form: {
        negotiateNo: '单据号',
        letterCreditNo: '信用证号',
        negotiateDate: '议付日期',
        letterCreditAmount: '信用证金额',
        negoBank: '议付行',
        negotiateInterest: '议付利息',
        negotiateServiceFee: '议付手续费',
        negotiateAmount: '实付议付金额',
        bankAccountCode: '账号',
        bankName: '银行',
        remark: '备注',
        currency: '币种'
      },
      group: {
        editPart1: '信用证议付信息'
      },
      list: {
        negotiateNo: '单据号',
        letterCreditNo: '信用证号',
        negotiateDate: '议付日期',
        letterCreditAmount: '信用证金额',
        negoBank: '议付行',
        negotiateInterest: '议付利息',
        negotiateServiceFee: '议付手续费',
        negotiateAmount: '实付议付金额',
        bankAccountCode: '账号',
        bankName: '银行',
        remark: '备注',
        currency: '币种'
      }
    },
    // 信用证台账
    creditAccount: {
      form: {
        contractNo: '合同编号',
        letterCreditNo: '信用证号',
        materialType: '原料类型',
        applyDate: '申请日期',
        documentMaker: '制单人',
        documentDept: '制单部门',
        applicant: '申请人',
        IssuingDate: '开证日期',
        usance: '信用证期限',
        expirDate: '信用证到期日',
        batchNo: '批号',
        materialName: '物料名称',
        optEmployeeName: '受益人',
        metalQuantity: '金属量（吨）',
        IssuingBank: '开证银行',
        IssuingAmount: '开证金额',
        currency: '币种'
      },
      group: {
        editPart1: '信用证议付信息'
      },
      list: {
        letterCreditNo: '信用证号',
        applyDate: '申请日期',
        contractNo: '合同编号',
        customerName: '供应商',
        metalQuantity: '金属量（吨）',
        IssuingBank: '开证银行',
        IssuingAmount: '开证金额',
        optEmployeeName: '受益人',
        IssuingDate: '开证日期',
        usance: '信用证期限',
        expirDate: '信用证到期日',
        remark: '备注',
        currency: '币种'
      }
    },
    // 改证登记
    changeRegister: {
      form: {
        contractNo: '合同编号',
        applyNo: '申请编号',
        letterCreditNo: '信用证号',
        documentStatus: '单据状态',
        optEmployeeName: '受益人',
        materialType: '原料类型',
        applyDate: '申请日期',
        documentMaker: '制单人',
        documentDate: '制单日期',
        documentDept: '制单部门',
        batchNo: '批号',
        metalQuantity: '金属量（吨）',
        IssuingBank: '开证银行',
        applicant: '申请人',
        IssuingDate: '开证日期',
        usance: '信用证期限',
        expirDate: '信用证到期日',
        IssuingAmount: '开证金额',
        materialName: '物料名称'
      },
      group: {
        editPart1: '信用证议付信息'
      },
      list: {
        contractNo: '合同编号',
        applyNo: '申请编号',
        letterCreditNo: '信用证号',
        status: '状态',
        optEmployeeName: '受益人',
        batchNo: '批号',
        materialType: '原料类型',
        applyDate: '申请日期',
        documentMaker: '制单人',
        documentDate: '制单日期',
        documentDept: '制单部门',
        materialName: '物料名称',
        currency: '币种',
        IssuingBank: '开证银行'
      }
    },
    // 增额申请
    incrementApplay: {
      form: {
        applyDate: '申请日期',
        applyNo: '申请编号',
        creditNo: '原信用证号',
        contractNo: '合同编号',
        documentDept: '制单部门',
        documentDate: '制单日期',
        documentMaker: '制单人',
        IssuingDate: '开证日期',
        remark: '备注'
      },
      list: {
        category: '类别',
        orderNO: '单据编号',
        documentStatus: '单据状态',
        creditNo: '原信用证号',
        contractNo: '合同编号',
        optEmployeeName: '受益人',
        IssuingBank: '开证银行',
        moneyOld: '原开证金额',
        moneyNew: '增额金额',
        currencyUnit: '金额单位',
        goodName: '货物名称',
        metalQuantity: '金属量（吨）',
        documentMaker: '制单人',
        documentDate: '制单日期'
      }
    }
  }
}
