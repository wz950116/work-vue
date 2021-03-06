export default {
  derivative: {
    msg: {
      AccountHandler: ' 切换期货账号后，将会清空调整单明细，是否继续？'
    },
    btn: {
      chooseExportBtn: '选择数据导出',
      ExportBtn: '导出空模板'
    },
    externalTradeAccount: {
      derivativeAccount: '期货账号',
      preliminaryFlag: '期初',
      tradingDay: '入账日期',
      brokerName: '期货公司',
      preBalance: '上日结存',
      inFund: '当日入金',
      outFund: '当日出金',
      closeProfit: '平仓盈亏',
      positionProfit: '持仓盈亏',
      commission: '手续费',
      posiMargin: '保证金',
      available: '可用资金',
      balance: '当日结存',
      currencyName: '币种',
      remark: '备注',
      reason: '检查结果',
      fundInfo: '外盘资金信息',
      importTitle: '外盘资金导入',
      msg: {
        profitIsEmpty: '盈亏数据不能为空'
      }
    },
    externalTrade: {
      tradingDay: '交易日期',
      derivativeAccount: '期货账号',
      futuresContractCode: '期货合约',
      tradeId: '成交单号',
      direction: '方向',
      offsetFlag: '开/平',
      price: '价格',
      volume: '手数',
      commission: '手续费',
      adjustFee: '调期费',
      expireDate: '头寸到期日',
      remark: '备注',
      preliminaryFlag: '是否期初',
      importDialg: '外盘成交导入',
      reason: '检查结果',
      tabTitle: '外盘成交信息'
    },
    optionAccountTrade: {
      title: '期权成交数据',
      customerName: '客户名称',
      tradingDay: '交易日期',
      exerciseDate: '行权日期',
      strikeFlag: '状态',
      derivativeAccount: '期权账号',
      optionVarietiesName: '标的',
      optionsType: '类型',
      marketType: '市场',
      strikePrice: '行权价',
      optionBailFee: '保证金',
      optionFee: '权利金',
      direction: '方向',
      exerciseType: '行权方式',
      volume: '数量',
      commission: '手续费',
      marketmakersName: '做市商',
      optionFeeTotal: '权利金合计',
      settlementPrice: '标的价格',
      dealDate: '成交时间',
      dueDate: '到期时间',
      currencyName: '币种',
      dataSourceType: '数据来源',
      varietiesType: '品种类型',
      optionVarietiesCode: '成交编号',
      confirm: '确认',
      confirmMsg: '标的价格为行权时标的物的公允价格，用于计算期权的套保盈亏，请务必填写。状态变更后无法更改状态，确认进行行权（履约）操作吗？'
    },
    optionImportRecord: {
      title: '期权数据导入管理',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      accountDate: '入账日期',
      uploadDt: '导入时间',
      businessDetails: '成交明细',
      optionVarietiesName: '品种',
      targetInstrumentId: '合约标的',
      instrumentId: '合约',
      strikePrice: '行权价',
      royalty: '权利金',
      yearMonth: '合约月份',
      optionsType: '类型',
      direction: '买卖方向',
      volume: '数量',
      settlementPrice: '结算价',
      commission: '手续费',
      checkResult: '检测结果'
    },
    optionAccountImport: {
      title: '期权数据导入',
      formTitle: '客户信息及资金情况',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      accountDate: '入账日期',
      preBalance: '上日结存',
      businessDetails: '成交明细',
      optionVarietiesName: '品种',
      targetInstrumentId: '合约标的',
      instrumentId: '合约',
      strikePrice: '行权价',
      royalty: '权利金',
      yearMonth: '合约月份',
      optionsType: '类型',
      direction: '买卖方向',
      volume: '数量',
      settlementPrice: '结算价',
      commission: '手续费',
      checkResult: '检测结果'
    },
    optionAccountPosition: {
      title: '期权账号持仓',
      optionAccount: '期权账号',
      optionsType: '期权类型',
      positionDate: '持仓日期',
      investorId: '投资者代码',
      investorName: '投资者名称',
      targetInstrumentId: '合约标的',
      direction: '买卖方向',
      mainName: '主体名称',
      optionVarietiesName: '品种',
      instrumentId: '合约',
      strikePrice: '行权价',
      royalty: '权利金',
      yearMonth: '合约月份',
      volume: '数量',
      settlementPrice: '结算价',
      priceDate: '价格日期',
      exchangeName: '交易所',
      futuresVarietiesName: '品种',
      futuresContractName: '合约名称',
      futuresContractCode: '合约编码',
      intradayPrice: '盘中价',
      openPrice: '开盘价',
      closingPrice: '收盘价',
      highestPrice: '最高价',
      lowestPrice: '对低价',
      currencyName: '币种',
      result: '检测结果',
      positionProfit: '持仓盈亏'
    },
    // 子账号数据导入管理
    futruesSubImportRecord: {
      title: '子账号数据导入管理',
      derivativeSubAccount: '子账号',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期开始',
      tradingDayTo: '交易日期结束',
      importDate: '导入时间',
      importDateFrom: '导入时间开始',
      importDateTo: '导入时间结束',
      uploadDt: '导入时间'
    },
    // 子账号资金
    futruesSubAccount: {
      title: '子账号资金',
      dialogTitle: '子账号资金导入',
      derivativeSubAccount: '子账号',
      closeProfit: '平仓盈亏',
      positionProfit: '浮动盈亏',
      commission: '手续费',
      projectName: '考核主体',
      posiMargin: '持仓保证金',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期',
      tradingDayTo: '交易日期'
    },
    // 期货-子账号成交
    futruesSubTrade: {
      title: '子账号成交',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期开始',
      tradingDayTo: '交易日期结束',
      derivativeAccount: '期货账号',
      derivativeSubAccount: '子账号',
      projectName: '考核主体',
      futuresContractCode: '合约',
      orderSysId: '委托单号',
      direction: '方向',
      offsetFlag: '开平',
      price: '价格',
      volume: '数量',
      amount: '成交金额',
      commission: '手续费',
      tradeDate: '成交日期',
      tradeTime: '成交时间',
      hedgeFlag: '投机/套保',
      tradeId: '成交单号',
      mainName: '客户名称',
      dataSourceType: '数据来源',
      operateType: '操作类型'
    },
    // 期货账号持仓
    futuresPosi: {
      title: '期货账号持仓',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期',
      tradingDayTo: '交易日期',
      derivativeAccount: '期货账号',
      futuresContractCode: '合约',
      posiDirection: '方向',
      position: '数量',
      positionPrice: '持仓均价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      positionProfit: '浮动盈亏',
      useMargin: '保证金',
      hedgeFlag: '投机/套保',
      mainName: '客户名称',
      dataSourceType: '数据来源'
    },
    // 子账号持仓
    futuresSubPosi: {
      title: '子账号持仓',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期',
      tradingDayTo: '交易日期',
      derivativeSubAccount: '子账号',
      projectName: '考核主体',
      futuresContractCode: '合约',
      posiDirection: '方向',
      position: '数量',
      positionPrice: '持仓均价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      positionProfit: '浮动盈亏',
      useMargin: '保证金',
      hedgeFlag: '投机/套保',
      mainName: '客户名称',
      dataSourceType: '数据来源',
      tradeId: '成交单号'
    },
    futuresAccountTrade: {
      title: '期货账号成交',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      tradeId: '成交单号',
      dataSourceType: '数据来源',
      tradeDate: '成交日期',
      hedgeFlag: '投机/套保',
      accountName: '客户名称',
      closeProfit: '平仓盈亏',
      childAccount: '期货子账号',
      orderSysId: '委托单号',
      tradeTime: '成交时间',
      accountDate: '入账日期',
      direction: '方向',
      offsetFlag: '开/平',
      futuresContractCode: '合约',
      mainName: '主体名称',
      price: '价格',
      volume: '数量',
      amount: '成交金额',
      commission: '手续费',
      preliminaryFlag: '期初标志',
      loadCtpMsg: '获取ctp成交成功',
      derivativeSubAccount: '子账号'
    },
    futuresAccountBalance: {
      title: '期货账号资金',
      dialogTitle: '期货账号资金导入',
      derivativeAccount: '期货账号',
      tradingDayFrom: '交易日期开始',
      tradingDayTo: '交易日期结束',
      mainName: '客户名称',
      tradingDay: '交易日期',
      preBalance: '上日结存',
      fundInOut: '资金存取',
      closeProfit: '平仓盈亏',
      positionProfit: '浮动盈亏',
      commission: '手续费',
      posiMargin: '持仓保证金',
      available: '可用资金',
      balance: '期末权益',
      reserve: '当日结存',
      riskDegree: '风险度'
    },
    futuresAccountPosition: {
      title: '期货帐号持仓',
      derivativeAccount: '期货账号',
      positionDate: '日期',
      investorName: '主体名称',
      childAccount: '期货子账号',
      posiDirection: '方向',
      instrumentId: '合约',
      position: '数量',
      avgPrice: '持仓均价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      useMargin: '保证金',
      positionProfit: '持仓盈亏'
    },
    futruesImportRecord: {
      title: '期货数据导入管理',
      formTitle: '查询',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      tradingDayFrom: '交易日期开始',
      tradingDayTo: '交易日期结束',
      importDate: '导入时间',
      importDateFrom: '导入时间开始',
      importDateTo: '导入时间结束',
      mainName: '主体名称',
      customerName: '客户名称',
      brokerName: '期货公司名称',
      uploadDt: '导入时间'
    },
    futuresAccountImport: {
      businessDetails: '成交明细',
      positionDetails: '持仓汇总',
      title: '期货数据导入',
      formTitle: '客户信息及资金情况',
      derivativeAccount: '期货账号',
      derivativeSubAccount: '子账号',
      tradingDay: '交易日期',
      mainName: '客户名称',
      brokerName: '期货公司名称',
      preBalance: '上日结存',
      reserve: '期末权益',
      fundInOut: '资金存取',
      closeProfit: '平仓盈亏',
      commission: '手续费',
      balance: '当日结存',
      positionProfit: '浮动盈亏',
      available: '可用资金',
      posiMargin: '保证金占用',
      futuresContractCode: '合约',
      orderSysId: '委托单号',
      direction: '买/卖',
      offsetFlag: '开/平',
      price: '成交价',
      volume: '手数',
      amount: '成交额',
      tradeTime: '成交时间',
      hedgeFlag: '投机/套保',
      tradeId: '成交单号',
      tradeDate: '成交日期',
      checkResult: '检查结果',
      longVolume: '买持仓',
      longPrice: '买均价',
      shortVolume: '卖持仓',
      shortPrice: '卖均价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      useMargin: '交易保证金',
      instructionName: '名称',
      instructionCode: '编码',
      strategyPlanInstrInfo: '策略/计划/指令明细信息',
      noMatchLots: '可匹配手数',
      productCode: '品种',
      riskDegree: '风险度'
    },
    futuresProfitCheck: {
      btn: '导入期货公司结算单',
      title: '期货盈亏核对',
      tradingDayFrom: '交易日期开始',
      tradingDayTo: '交易日期结束',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      ctrmPositionProfit: '系统持仓盈亏',
      ctrmPositionProfitOffset: '差额',
      ctrmCloseProfit: '系统平仓盈亏',
      ctrmCloseProfitOffset: '差额',
      stdPositionProfit: '标准结算单持仓盈亏',
      stdCloseProfit: '标准结算单平仓盈亏',
      brokerPositionProfit: '期货公司结算单持仓盈亏',
      brokerPositionProfitOffset: '差额',
      brokerCloseProfit: '期货公司结算单平仓盈亏',
      brokerCloseProfitOffset: '差额',
      mainName: '客户名称'
    },
    futuresAccountImportInit: {
      positionDetails: '持仓明细',
      title: '期初期货数据导入',
      derivativeAccount: '期货账号',
      tradingDay: '交易日期',
      mainName: '客户名称',
      brokerName: '期货公司名称',
      preBalance: '上日结存',
      balance: '当日权益',
      fundInOut: '当日存取合计',
      closeProfit: '平仓盈亏',
      commission: '手续费',
      reserve: '当日结存',
      positionProfit: '浮动盈亏',
      available: '可用资金',
      posiMargin: '持仓保证金',
      futuresContractCode: '合约',
      orderSysId: '委托单号',
      tradeId: '成交单号',
      longVolume: '买持仓',
      longPrice: '买入价',
      shortVolume: '卖持仓',
      shortPrice: '卖出价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      tradeDate: '成交日期',
      hedgeFlag: '投机/套保',
      checkResult: '检查结果'
    },
    futuresAccountAdjust: {
      dialogTitle: '选择数据',
      ExportTitle: '期货账号数据调整单导入模板',
      derivativeSubAccount: '子账号',
      title: '期货账号数据调整单',
      documentStat: '审核状态',
      derivativeAccount: '期货账号',
      makeDateFrom: '调整日期开始',
      makeDateTo: '调整日期结束',
      approvalDateFrom: '审核日期开始',
      approvalDateTo: '审核日期结束',
      makeUserName: '制单人',
      documentNo: '调整单号',
      makeDate: '调整日期',
      approvalDate: '审核日期',
      id: 'ID',
      versionNum: '乐观锁',
      optType: '操作类型',
      adjustType: '调整类型',
      tradingDay: '交易日期',
      futuresContractCode: '合约',
      tradeId: '成交单号',
      direction: '方向',
      offsetFlag: '开/平',
      price: '价格',
      volume: '数量',
      amount: '成交金额',
      commission: '手续费',
      tradeDate: '成交日期',
      tradeTime: '成交时间',
      hedgeFlag: '投机/套保',
      orderSysId: '委托单号',
      mainName: '客户名称',
      dataSourceType: '数据来源',
      adjustReason: '调整原因',
      baseInfo: '基本信息',
      listDetail: '调整单明细',
      listDetailBefore: '调整前数据',
      listDetailAfter: '调整后数据',
      checkResult: '检查结果',
      historyDate: '历史数据'
    },

    futureSubImportInit: {
      title: '期货子账号期初数据导入',
      positionDetails: '持仓明细',
      derivativeSubAccount: '子账号',
      tradingDay: '交易日期',
      posiMargin: '持仓保证金',
      closeProfit: '平仓盈亏',
      balance: '当日权益',
      commission: '手续费',
      positionProfit: '持仓盈亏',
      derivativeAccount: '期货账号',
      futuresContractCode: '合约',
      orderSysId: '委托单号',
      longVolume: '买持仓',
      longPrice: '买入价',
      shortVolume: '卖持仓',
      shortPrice: '卖出价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      hedgeFlag: '投机/套保',
      tradeId: '成交单号',
      checkResult: '检查结果'
    },
    futuresSubAdjust: {
      title: '子账号数据调整单',
      documentStat: '审核状态',
      derivativeSubAccount: '子账号',
      makeDate: '调整日期',
      makeDateFrom: '调整日期开始',
      makeDateTo: '调整日期结束',
      approvalDate: '审核日期',
      approvalDateFrom: '审核日期开始',
      approvalDateTo: '审核日期结束',
      makeUserName: '制单人',
      documentNo: '调整单号',
      adjustType: '调整类型',
      id: 'ID',
      versionNum: '乐观锁',
      adjustReason: '调整原因',
      baseInfo: '基本信息',
      listDetail: '调整单明细',
      listDetailBefore: '调整前数据',
      listDetailAfter: '调整后数据',
      mainName: '客户名称'
    },
    futureSubImport: {
      title: '期货子账号期初数据导入',
      positionDetails: '持仓明细',
      derivativeSubAccount: '子账号',
      tradingDay: '交易日期',
      posiMargin: '持仓保证金',
      closeProfit: '平仓盈亏',
      balance: '当日权益',
      commission: '手续费',
      positionProfit: '持仓盈亏',
      derivativeAccount: '期货账号',
      futuresContractCode: '合约',
      orderSysId: '委托单号',
      longVolume: '买持仓',
      longPrice: '买入价',
      shortVolume: '卖持仓',
      shortPrice: '卖出价',
      preSettlementPrice: '昨结算价',
      settlementPrice: '今结算价',
      hedgeFlag: '投机/套保',
      tradeId: '成交单号',
      checkResult: '检查结果'
    }
  }
}
