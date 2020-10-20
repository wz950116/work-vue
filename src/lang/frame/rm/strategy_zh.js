export default {
  strategy: {
    attachTitle: '附件',
    futuresCostShare: {
      caculate: '是否要计算当日费用分摊信息？',
      form: {
        parentName: '策略/计划/指令名称',
        matchCode: '匹配编码'
      },
      list: {
        parentName: '策略/计划/指令名称',
        matchCode: '匹配编码',
        derivativeAccount: '期货账号',
        futuresContractCode: '合约',
        costType: '费用类型',
        shareAmount: '分摊费用',
        currencyName: '币种',
        direction: '方向',
        offsetFlag: '开/平',
        costDirection: '收入/支出'
      }
    },
    optionMatch: {
      form: {
        instructionName: '上级名称',
        matchCode: '匹配编码',
        makeDate: '制单日期',
        makeUser: '制单人'
      },
      dialog: {
        instructionName: '指令名称',
        deptCode: '部门名称',
        orderCode: '下达人',
        deptName: '部门',
        instructionCode: '指令编码',
        planName: '所属策略/计划名称',
        planCode: '所属策略/计划编号',
        orderName: '下达人',
        traderName: '交易员',
        startDate: '指令下达日期',
        endDate: '有效期至',
        optionTrade: '期权成交明细'
      },
      list: {
        instructionName: '指令',
        matchCode: '匹配编码',
        makeUser: '制单人',
        makeDate: '制单日期',
        matchLots: '匹配数量',
        noMatchLots: '可匹配数量',
        contractCode: '期权合约',
        optionOffset: '交易动作',
        direction: '买/卖',
        callPut: '看涨/看跌',
        strikePrice: '执行价格',
        price: '期权单价',
        lots: '手数',
        endDate: '到期日',
        currencyName: '币种',
        counterpartyName: '对方手名称',
        volume: '数量',
        derivativeAccount: '衍生品账号',
        tradingDay: '成交日期'
      },
      tab: {
        instructionInfo: '指令信息',
        tradeInfo: '成交信息',
        instructionTable: '期权成交明细'
      },
      msg: {
        instDetailEmpty: '先选择指令信息。',
        matchLotsZero: '匹配手数为0',
        noTradeInfo: '没有成交信息，无法保存',
        matchLotsMore: '匹配手数大于指令最大匹配手数，无法保存',
        noInstructionInfo: '没有选择指令明细，无法保存',
        matchLotsNotEqual: '明细手数与匹配手数不同，无法保存'
      }
    },
    optionInstruction: {
      form: {
        instructionName: '指令名称',
        instructionCode: '指令编码',
        optionOffset: '指令类型',
        orderCode: '下达人',
        optionContract: '期权合约',
        optionDirection: '方向',
        planName: '所属计划',
        strategyName: '所属策略',
        strategyCode: '策略编码',
        planCode: '策略编码',
        startDate: '指令下达日期',
        endDate: '有效期至',
        organCode: '机构',
        deptCode: '部门',
        traderCode: '交易员',
        instrDetail: '指令信息'
      },
      list: {
        auditStatus: '审批状态',
        organName: '机构名称',
        deptName: '部门名称',
        instructionName: '指令名称',
        instructionCode: '指令编码',
        optionContract: '期权合约',
        optionDirection: '买/卖',
        optionOffset: '交易动作',
        callPut: '看涨/看跌',
        strikePrice: '执行价',
        price: '期权单价',
        priceDiff: '成交价差',
        lots: '数量',
        planName: '所属策略/计划名称',
        planCode: '所属策略/计划编码',
        startDate: '指令下达日期',
        endDate: '到期日',
        orderName: '下达人',
        traderName: '交易员',
        unitCode: '单位',
        hand: '手',
        remark: '备注'
      }
    },
    beginProfit: {
      strategyCode: '策略编码',
      strategyName: '策略名称',
      saveDate: '日期',
      type: '类型',
      productCode: '品种',
      productName: '品种',
      relizationProfit: '实现盈亏',
      positionProfit: '持有盈亏',
      dialog: '策略期初盈亏编辑',
      futuresContractCode: '合约',
      msg: {
        sameProduct: '列表中已存在相同品种数据，无法新增!',
        profitListIsNull: '盈亏列表不能为空',
        profitIsEmpty: '盈亏信息不能为空',
        contractIsEmpty: '合约信息不能为空'
      }
    },
    strategyManagement: {
      dialog: {
        title: '策略选择',
        detail: '策略明细选择'
      },
      list: {
        auditStat: '状态',
        strategyType: '策略性质',
        organName: '机构名称',
        deptName: '部门名称',
        strategyName: '策略名称',
        strategyCode: '策略编号',
        strategyNature: '策略类型',
        purpose: '策略目的',
        maxFund: '最大占用资金',
        limitLoss: '损失限额',
        expectProfit: '预期盈利',
        riskProfitRatio: '风险利润比',
        expectReturnRatio: '预期投资回报率',
        projectName: '考核主体',
        strgLevel: '策略层级',
        makeDate: '策略制定日期',
        startDate: '策略开始日期',
        endDate: '策略结束日期',
        applicantName: '申请人',
        optEmployeeName: '制单人',
        changeNo: '策略变更编码',
        changeUserName: '变更人',
        changeReason: '变更原因',
        changeDate: '策略变更日期',
        originalData: '原始数据',
        // stopStat: '是否终止',
        closeStat: '是否关闭'
      },
      form: {
        parentStrategyCode: '上级策略',
        organCode: '机构名称',
        deptCode: '部门名称',
        strategyName: '策略名称',
        strategyCode: '策略编号',
        strategyNature: '策略类型',
        purpose: '策略目的',
        maxFund: '最大占用资金',
        limitLoss: '损失限额',
        expectProfit: '预期盈利',
        riskProfitRatio: '风险利润比',
        expectReturnRatio: '预期投资回报率',
        projectCode: '考核主体',
        strgLevel: '策略层级',
        makeDate: '策略制定日期',
        startDate: '策略开始日期',
        endDate: '策略结束日期',
        applicant: '申请人',
        optEmployeeCode: '制单人',
        maxShare: '最大组数',
        hedgingMode: '套期方式',
        productCode: '品名',
        hedgingPortfolio: '套期组合',
        changeReason: '变更原因',
        makeChangeDate: '策略变更日期',
        remark: '策略描述',
        changeRemark: '策略变更描述',
        arbitragePortfolio: '套利组合',
        tradingInformation: '交易信息',
        futuresOptimization: '期货优化',
        changeNo: '策略变更编码',
        type: '类型',
        executor: '执行人'
      },
      tab: {
        contractNo: '合同号',
        itemClass: '类型',
        productCode: '品名',
        price: '参考价格',
        quantity: '每组数量',
        unitCode: '单位',
        maxPostion: '最大持仓量',
        valuationCode: '估值基准',
        marketCode: '市场',
        currencyCode: '币种',
        remark: '备注',
        contractCode: '合约',
        direction: '方向',
        maxHands: '最大持仓手数',
        tradeHands: '成交手数',
        tradePosition: '成交数量'
      },
      msg: {
        strategyNotAudit: '策略没有审核,无法操作',
        optimizeNotUse: '优化策略无法进行本操作',
        levelNoPlan: '策略层级没有计划，无法操作',
        levelNoInstr: '只有策略层级为策略-指令可以进行本操作'
      }
    },
    plan: {
      form: {
        createUser: '制单人',
        strategy: '所属策略',
        strategyCode: '策略编码',
        strategyNature: '策略类型',
        purpose: '策略目的',
        projectCode: '考核主体',
        planCode: '计划编号',
        planName: '计划名称',
        hedgeRatio: '套期比例',
        startDate: '计划开始日期',
        endDate: '计划结束日期',
        deptCode: '部门名称',
        applicant: '申请人',
        maxShare: '组数',
        enterMode: '进场规则',
        stopPoint: '止损',
        limit: '价比区间',
        productCode: '品名',
        changeReason: '变更原因',
        makeDate: '计划制定日期',
        changeDate: '计划变更日期',
        strategyName: '策略名称',
        changeNo: '变更编号',
        priceDiff: '价差区间',
        executor: '执行人'
      },
      list: {
        changeNo: '变更编号',
        maxShare: '组数',
        enterMode: '进场规则',
        applicant: '申请人',
        stopPoint: '止损',
        auditStat: '状态',
        deptName: '部门名称',
        planName: '计划名称',
        planCode: '计划编码',
        strategyName: '所属策略',
        createDate: '计划制定日期',
        startDate: '计划开始日期',
        endDate: '计划结束日期',
        applicantName: '申请人',
        createUserName: '制单人',
        selectType: '计划性质',
        itemClass: '类型',
        productCode: '品名',
        contractCode: '合约',
        offset: '开/平',
        offsetFlag: '开/平',
        quantity: '每组数量',
        floatRatio: '浮动比例',
        priceLimit: '成交价格区间',
        quantityLimit: '成交数量区间',
        unitCode: '单位',
        currencyCode: '币种',
        remark: '备注',
        direction: '方向',
        maxPosition: '最大开仓量',
        planDetail: '计划明细',
        strategyDetail: '策略明细',
        changeDate: '计划变更日期',
        changeUserName: '变更人',
        changeReason: '变更原因',
        strategyCode: '策略编码'
      },
      tab: {
        hedgingPortfolio: '套期组合',
        strgEquation: '价格公式',
        remark: '计划描述',
        strategyDetail: '策略明细',
        tradeInfo: '交易信息',
        planDetail: '计划明细',
        changeHistory: '变更历史'
      },
      msg: {
        quantityNotEqual: '成交数量区间必须相同',
        strategyFirst: '请先选择所属策略',
        detailEmpty: '计划明细数据不能为空',
        hedgeRatioEmpty: '套期比例区间不能为空',
        limitEmpty: '价比区间不能为空',
        tradeListEmpty: '交易列表不能为空',
        dataIsAudit: '所选计划已经审核，无法操作!',
        detailIsMatch: '明细已经匹配，无法删除',
        changeNotAudit: '未审核数据不能进行变更',
        maxPriceIsEmpty: '成交价格区间不能为空',
        quantityIsEmpty: '成交数量区间不能为空',
        isChange: '计划已经有变更数据且未审核，无法继续变更',
        planNotAudit: '计划未审批通过，无法退审',
        confirmReverse: '确认弃审?',
        contractIsEmpty: '期货合约不能为空',
        offsetIsEmpty: '期货开/平不能为空',
        futuresDirectionIsEmpty: '期货方向不能为空',
        spotDirectionIsEmpty: '现货方向不能为空',
        applicantFirst: '申请人不能为空',
        contractNoIsEmpty: '合同号不能为空',
        levelNoInstr: '只有策略层级为策略-计划-指令可以进行本操作'
      },
      dialog: {
        title: '计划选择'
      }
    },
    spotTrade: {
      form: {
        planName: '上级名称',
        makeDate: '制单日期',
        makeUser: '制单人',
        matchCode: '匹配编码'
      },
      list: {
        planCode: '策略/计划编号',
        planName: '策略/计划名称',
        matchCode: '匹配编码',
        makeUser: '制单人',
        makeDate: '制单日期',
        matchQuantity: '匹配数量',
        productName: '品名',
        maxShare: '每组数量',
        unitCode: '单位',
        maxQuantity: '最大开仓量',
        direction: '方向',
        autoMatchFlag: '是否自动匹配'
      },
      tab: {
        strategyDetail: '策略信息列表',
        spotExposure: '现货敞口列表',
        planDetail: '计划信息列表',
        instructionDetail: '指令信息列表'
      },
      dialog: {
        tradeDetail: '现货成交明细',
        planDetail: '计划明细',
        strategyDetail: '策略明细'
      },
      msg: {
        parentFirst: '请先选择上级',
        detailLimit: '明细数据只能为一条',
        strDetailFirst: '请先选择策略明细数据',
        planDetailFirst: '请先选择计划明细数据',
        noDetailInfo: '没有设置明细数据，无法保存',
        noExposureInfo: '没有设置敞口数据，无法保存',
        matchNotEqual: '现货敞口匹配数量和计划匹配数量不相同，无法保存。',
        quantityNotEmpty: '匹配数量不能为空',
        dataIsExists: '匹配数据已经存在，无法新增'
      }
    },
    spotOpt: {
      form: {
        strategyCode: '策略名称',
        strategyName: '策略名称',
        matchCode: '匹配编码',
        makeDate: '制单日期',
        makeUser: '制单人'
      },
      list: {
        strategyName: '策略名称',
        strategyCode: '策略编码',
        optQuantity: '本次关联数量',
        makeUserName: '制单人',
        matchCode: '匹配编码',
        makeDate: '制单日期',
        tradeList: '成交明细选择',
        noOptQuantity: '未关联数量',
        contractNo: '合同号',
        documentNo: '单据号',
        productName: '品名',
        direction: '方向',
        matchQuantity: '数量',
        price: '含税价',
        unitCode: '单位',
        customerName: '客户名称'
      },
      tab: {
        optimized: '优化标的',
        target: '目标标的',
        tradeDetail: '成交明细'
      },
      msg: {
        noStrategyCode: '请先选择策略。',
        noOptimizedInfo: '优化标的不能为空。',
        noTargetInfo: '目标标的不能为空',
        quantityNotZero: '本次关联数量不能为0'
      }
    },
    indealMatch: {
      form: {
        instructionName: '指令名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人'
      },
      list: {
        instructionName: '指令名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人',
        productCode: '品种',
        direction: '买/卖',
        offset: '开/平',
        volume: '数量',
        unitCode: '单位',
        price: '成交价格',
        commission: '手续费',
        derivativeAccount: '期货账号',
        derivativeSubAccount: '子账号',
        contractCode: '合约',
        matchLots: '匹配手数',
        adjustFee: '调期费',
        tradeId: '成交单号',
        orderSysId: '委托单号',
        canMatchLots: '可匹配手数'
      },
      tab: {
        tradeDetail: '成交明细列表',
        instructionTable: '成交明细选择',
        instructionDialog: '指令明细选择',
        virtualTrade: '虚拟成交列表'
      },
      msg: {
        detailCount2: '指令自成交明细数据只能为两条。',
        matchLosZero: '指令自成交手数必须大于0。',
        priceEmpty: '成交价格不能为空。。',
        commissionEmpty: '手续费不能为空。',
        accountEmpty: '账号信息不能为空。',
        matchLotsNotEqual: '匹配手数数值不相等，请修改。',
        priceNotEqual: '价格数值不相等，请修改。',
        commissionNotEqual: '手续费数值不相等，请修改。',
        contractNotEqual: '合约信息不相同，请修改。',
        directionEqual: '方向相同的两条指令，不允许做指令自成交！',
        derivativeAccount: '期货账号不相等，请修改。',
        derivativeSubAccount: '子账号不相等，请修改。',
        countNotTwo: '指令明细非两条，无法生成虚拟成交'
      }
    },
    posMatch: {
      dialog: {
        matchType: '匹配类型'
      },
      form: {
        instructionName: '指令名称',
        strategyName: '策略名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人'
      },
      list: {
        instructionName: '指令名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人',
        canMatchLots: '可匹配手数',
        contractCode: '合约',
        direction: '买/卖',
        offsetFlag: '开/平',
        lots: '数量',
        unit: '单位',
        price: '价格',
        priceDiff: '价差',
        faccount: '期货账号',
        subFaccount: '子账号',
        orderSysId: '委托单号',
        volume: '数量',
        derivativeAccount: '期货账号',
        derivativeSubAccount: '子账号',
        matchLots: '匹配手数',
        strategyCode: '策略编码',
        strategyName: '策略名称',
        planCode: '计划编码',
        planName: '计划名称',
        futuresContractCode: '合约',
        positionLots: '关联/持仓手数',
        commission: '手续费',
        strPlanCode: '策略/计划编码',
        strPlanName: '策略/计划名称'
      },
      tab: {
        instructionInfo: '指令信息列表',
        strategyInfo: '策略信息列表',
        tradeInfo: '自成交明细列表',
        instructionTable: '成交明细参照',
        strategyRelation: '关联策略',
        planRelation: '关联计划'
      },
      msg: {
        instructionNotSelect: '指令未选择，无法新增明细数据。',
        instDetailEmpty: '请先选择一条指令明细信息',
        noInstructionInfo: '没有设置指令数据信息，无法保存。',
        noTradeInfo: '没有设置自成交数据信息，无法保存',
        matchLotsZero: '匹配手数不能为0',
        matchLotsNotEqual: '指令明细与自成交明细匹配数量不相同',
        matchLotsMore: '指令的匹配手数大于可匹配手数，不能进行保存',
        strMatchLotsMore: '策略的匹配手数大于可匹配手数，不能进行保存',
        tradeDataIsEmpty: '自成交明细数据为空，无法生成虚拟成交',
        virtualCantDelete: '虚拟数据无法删除',
        relationInfoEmpty: '关联信息为空，无法保存',
        noVirtualTrade: '没有进行虚拟成交，无法保存',
        accountIsEmpty: '虚拟账号不能为空',
        strgDetailEmpty: '请先选择一条策略明细信息',
        tradeDataEmpty: '请先选择一条成交信息'
      }
    },
    simpleMatch: {
      form: {
        matchCode: '单据号',
        makeDate: '单据日期',
        productCode: '敞口品种',
        direction: '敞口方向',
        documentNo: '现货敞口号',
        bizOrganCode: '业务机构',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员',
        makeUser: '制单人',
        spotQuantity: '现货定价数量',
        futuresQuantity: '关联期货数量',
        relateProportion: '关联比例(%)',
        remark: '备注'
      },
      list: {
        matchCode: '单据号',
        makeDate: '单据日期',
        productName: '敞口品种',
        direction: '敞口方向',
        rawQuantity: '现货定价数量',
        documentNo: '现货敞口号',
        futuresQuantity: '关联期货数量',
        relateProportion: '关联比例',
        bizOrganName: '业务机构',
        bizDeptName: '业务部门',
        bizEmployeeName: '业务员',
        makeUserName: '制单人',
        matchLots: '关联手数',
        matchQuantity: '关联重量',
        orderSysId: '委托单号',
        futuresContractCode: '合约',
        offsetFlag: '开/平',
        price: '成交价格',
        derivativeAccount: '期货账号',
        noMatchLots: '未匹配手数'
      },
      msg: {
        spotNotSelect: '现货敞口未选择，无法操作。',
        buyCantMatch: '采购敞口无法匹配买开成交。',
        sellCantMatch: '销售敞口无法匹配卖开成交。'
      },
      tab: {
        detailList: '关联期货信息'
      }
    },
    futuresSpotMatch: {
      form: {
        strategyCode: '策略名称',
        strategyName: '策略名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人'
      },
      list: {
        strategyName: '策略名称',
        matchCode: '匹配编码',
        makeDate: '创建日期',
        makeUser: '创建人',
        orderSysId: '委托单号',
        futuresContractCode: '合约',
        direction: '买/卖',
        offsetFlag: '开/平',
        matchLots: '匹配手数',
        price: '成交价格',
        derivativeAccount: '期货账号',
        derivativeSubAccount: '子账号'
      },
      tab: {
        spotInfo: '现货信息列表',
        futuresInfo: '期货信息列表',
        spotTradeDialog: '现货成交匹配',
        futuresTradeDialog: '期货成交匹配'
      },
      msg: {
        strategyCodeEmpty: '策略未选择，无法新增明细数据。',
        spotInfoEmpty: '现货信息列表不能为空。',
        futuresInfoEmtpy: '期货信息列表不能为空',
        futuresIsNegative: '期货匹配数量小于等于零，无法保存',
        detailListIsNull: '期货匹配列表为空，无法保存'
      }
    },
    instruction: {
      list: {
        auditStat: '状态',
        organName: '机构名称',
        deptName: '部门名称',
        virtualFlag: '是否虚拟',
        instructionName: '指令名称',
        instructionCode: '指令编码',
        instructionType: '指令类型',
        strategyName: '所属策略/计划名称',
        strategyCode: '所属策略/计划编码',
        startDate: '指令下达日期',
        endDate: '指令截止日期',
        orderName: '下达人',
        traderName: '交易员',
        faccount: '期货账号',
        subFaccount: '子账号'
      },
      form: {
        organCode: '机构名称',
        deptCode: '部门名称',
        virtualFlag: '是否虚拟',
        instructionName: '指令名称',
        instructionCode: '指令编码',
        instructionType: '指令类型',
        strategyName: '所属策略',
        strategyCode: '策略编码',
        startDate: '指令下达日期',
        endDate: '有效日期至',
        orderCode: '下达人',
        traderCode: '交易员',
        faccount: '期货账号',
        subFaccount: '期货子账号',
        planCode: '计划编码',
        planName: '所属计划',
        instrDetail: '指令信息',
        productCode: '品名',
        contractCode: '合约',
        direction: '方向',
        offsetFlag: '开/平'
      },
      tab: {
        productCode: '品种',
        contractCode: '合约',
        direction: '买/卖',
        offsetFlag: '开/平',
        lots: '手数',
        unit: '单位',
        price: '成交价格',
        priceDiff: '成交价差',
        currencyCode: '币种',
        remark: '备注',
        detailSelect: '指令明细选择'
      },
      dialog: {
        title: '指令选择',
        strategyNature: '类型'
      },
      msg: {
        orderFirst: '请先选择下达人'
      }
    },
    futureMatch: {
      form: {
        futureMatchType: '期货匹配选择',
        superiorName: '上级名称',
        makeDate: '制单日期',
        makeUser: '制单人',
        instructionName: '指令名称',
        matchCode: '匹配编码',
        matchType: '类型',
        planName: '计划名称',
        strategyName: '策略名称'
      },
      list: {
        matchType: '类型',
        instructionCode: '策略/计划/指令编码',
        instructionName: '策略/计划/指令名称',
        matchCode: '匹配编码',
        makeUserName: '制单人',
        makeDate: '制单日期'
      },
      tab: {
        matchLots: '匹配手数',
        canMatchLots: '可匹配手数',
        futureTrade: '成交明细列表',
        deliveryTrade: '虚拟成交列表',
        openTradeRelation: '匹配开仓明细',
        canRelLots: '可关联数量'
      },
      dialog: {
        futureTrade: '期货成交'
      }
    },
    futureDelivery: {
      tab: {
        productCode: '品种',
        contractCode: '合约',
        direction: '买/卖',
        offset: '开/平',
        matchLots: '交割数量',
        unitCode: '单位',
        price: '成交价格',
        commission: '手续费',
        derivativeAccount: '期货账号',
        derivativeSubAccount: '子账号',
        tradeCode: '成交单号',
        orderCode: '委托单号'
      }
    }
  }
}
