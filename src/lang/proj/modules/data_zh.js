export default {
  dataHq: {
    marginRate: {
      saveDate: '日期',
      derivativeAccount: '期货账号',
      futuresVarietiesCode: '期货品种',
      contractCode: '期货合约',
      longMarginRatioByMoney: '多头按金额',
      longMarginRatioByVolume: '多头按手数',
      shortMarginRatioByMoney: '空头按金额',
      shortMarginRatioByVolume: '空头按手数',
      optEmployeeName: '维护人',
      createTime: '维护时间',
      dataSource: '数据来源',
      reason: '检查结果',
      importTitle: '保证金率导入',
      marginInfo: '保证金率信息',
      hedgeFlag: '投机/套保',
      msg: {
        tableIsEmpty: '导入数据为空'
      }
    },
    optionContract: {
      form: {
        underlyingType: '标的资产性质',
        optionContractCode: '期权合约',
        optionContractName: '期权合约名称',
        exchangeCode: '交易所名称',
        underlyingProduct: '标的资产',
        optionVarietiesCode: '期权品种',
        strikePrice: '执行价',
        callPut: '涨跌',
        combinationType: '组合类型',
        endDate: '到期日',
        contractMultiplier: '合约乘数',
        currencyCode: '币种',
        usingFlag: '状态'
      },
      list: {
        optionContractCode: '期权合约',
        optionContractName: '期权合约名称',
        underlyingType: '标的资产性质',
        underlyingProductName: '标的资产',
        optionVarietiesName: '期权品种',
        exchangeName: '交易所',
        strikePrice: '执行价',
        callPut: '涨跌',
        combinationType: '组合类型',
        endDate: '到期日',
        contractMultiplier: '合约乘数',
        currencyName: '币种',
        dataAttr: '数据属性',
        usingFlag: '状态'
      }
    },
    optionVarieties: {
      form: {
        underlyingType: '标的资产性质',
        optionVarietiesType: '品种类别',
        optionVarietiesName: '期权品种名称',
        optionVarietiesCode: '期权品种编码',
        contractMultiplier: '合约乘数',
        exchangeCode: '交易所',
        usingFlag: '状态',
        currencyCode: '币种'
      },
      list: {
        underlyingType: '标的资产性质',
        optionVarietiesType: '品种类别',
        optionVarietiesName: '期权品种名称',
        optionVarietiesCode: '期权品种编码',
        exchangeName: '交易所',
        contractMultiplier: '合约乘数',
        usingFlag: '状态'
      }
    },
    prefixAddress: {
      custName: '经纪商',
      brokerCode: '经纪商',
      transactionAddress: '交易前置地址',
      marketAddress: '行情前置地址',
      usingFlag: '启用状态'
    },
    accountPeriod: {
      fiscalYear: '会计年度',
      periodNumber: '期间个数',
      quarterlyNumber: '季度个数',
      startDate: '起始日期',
      endDate: '终止日期',
      usingFlag: '状态',
      title: '会计期间'
    },
    accountMonth: {
      first: '第',
      accountMonth: '会计月份',
      startDate: '开始日期',
      endDate: '结束日期',
      month: '月份'
    },
    accountQuarter: {
      first: '第',
      accountQuarter: '会计季度',
      startMonth: '开始月份',
      endMonth: '结束月份',
      quarter: '季度'
    },
    exchangeRate: {
      form: {
        exchangeRateName: '汇率名称',
        exchangeRateCode: '汇率编码',
        defaultFlag: '默认',
        exchangeRate: '汇率',
        remark: '描述',
        sourceCurrency: '源币种',
        targetCurrency: '目的币种',
        decimalDigit: '汇率小数位数',
        conversionMode: '折算模式',
        title: '汇率档案',
        conversionTitle: '折算模式'
      },
      tab: {},
      list: {
        exchangeRateName: '汇率名称',
        exchangeRateCode: '汇率编码',
        defaultFlag: '默认',
        remark: '描述',
        sourceCurrency: '源币种',
        targetCurrency: '目的币种',
        decimalDigit: '汇率小数位数',
        conversionMode: '折算模式',
        title: '汇率档案',
        conversionTitle: '折算模式'
      }
    },
    everyDayRate: {
      title: '日汇率',
      exchangeRateDate: '汇率日期',
      exchangeRate: '汇率',
      yearAndMonth: '年度月份',
      index: '序号'
    },
    periodRate: {
      title: '期间汇率',
      year: '年度',
      month: '月份',
      periodExchangeRate: '期间汇率'
    },
    interestRate: {
      currencyName: '币种',
      theDate: '日期',
      interestRate: '利率',
      createUserName: '维护人',
      createDate: '维护日期',
      updateUserName: '修改人',
      updateDate: '修改日期',
      title: '利率档案'
    },
    type: {
      form: {
        groupCode: '策略目的分类',
        typeName: '策略目的',
        typeCode: '策略目的编码',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        groupName: '策略目的分类',
        typeName: '策略目的',
        typeCode: '策略目的编码',
        remark: '备注',
        usingFlag: '启用状态'
      }
    },
    typeGroup: {
      form: {
        groupName: '策略目的分类',
        groupCode: '策略目的分类编码',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        groupName: '策略目的分类',
        groupCode: '策略目的分类编码',
        remark: '备注',
        usingFlag: '启用状态'
      }
    },
    futuresContract: {
      title: '期货合约管理',
      futuresVarietiesCode: '品种编码',
      futuresVarietiesName: '品种名称',
      exchangeName: '交易所名称',
      contractMultiplier: '合约乘数',
      futuresContractCode: '合约代码',
      futuresContractName: '合约名称',
      currencyId: '币种',
      startDate: '合约起始日期',
      endDate: '合约截止日期',
      yesNoOverdue: '是否过期',
      dataAttr: '数据属性',
      usingFlag: '状态'
    },
    futuresVarieties: {
      title: '期货品种管理',
      futuresVarietiesType: '品种类别',
      exchangeName: '交易所名称',
      futuresVarietiesCode: '品种编码',
      futuresVarietiesName: '品种名称',
      contractMultiplier: '合约乘数',
      unit: '单位',
      tickSize: '最小变动价',
      minDeliveryUnit: '最小交割单位',
      deliveryDate: '交割日期',
      dataAttr: '数据属性',
      usingFlag: '状态',
      currencyCode: '币种'
    },
    derivativeAccount: {
      title: '衍生品账号管理',
      customerId: '经纪商',
      derivativeAccount: '衍生品账号',
      derivativeAccountCode: '账号标识编码',
      derivativeTypes: '衍生品类型',
      derivativeAccountType: '账号类型',
      derivativeCategory: '账号类别',
      organId: '所属机构',
      deptCode: '所属部门',
      mainName: '客户名称',
      onlineStat: '登录状态',
      trusteeshipFlag: '是否托管',
      wait: '正在登录中，请稍候。',
      password: '交易密码',
      authorizationCode: '账号认证码',
      dataAttr: '账号来源',
      newPassword: '新密码',
      msg: {
        disableLogin: '该账号已经登录，不能重复登录！',
        futuresLoginMsg: '不是期货账号，不能进行登录操作！',
        futuresLogoutMsg: '不是期货账号，不能进行断开操作！',
        disableLogout: '该账号没有登录，不能进行断开操作！'
      }
    },
    derivativeSubAccount: {
      title: '衍生品子账号管理',
      customerId: '经纪商',
      projectId: '考核主体 ',
      projectName: '考核主体',
      usingFlag: '状态',
      derivativeAccount: '衍生品账号',
      derivativeAccountId: '衍生品账号',
      derivativeSubAccount: '衍生品子账号',
      derivativeAccountCode: '账号标识编码',
      derivativeTypes: '衍生品类型',
      derivativeAccountType: '账号类型',
      organId: '所属机构',
      mainName: '客户名称',
      onlineStat: '登录状态',
      trusteeshipFlag: '是否托管',
      remark: '备注',
      organCode: '机构名称',
      deptCode: '部门名称'
    },
    projectFile: {
      title: '考核主体管理',
      projectFileName: '考核主体名称',
      projectFileCode: '考核主体编码',
      usingFlag: '状态',
      remark: '备注',
      projectStat: '考核主体状态',
      mainInfo: '主信息'
    },
    currency: {
      title: '币种档案',
      currencyCode: '币种编码',
      currencyName: '币种名称',
      currencySymbol: '币种币符',
      maxLength: {
        currencyCode: '币种编码长度不能超过4'
      },
      standardFlag: '是否本位币'
    },
    exchange: {
      title: '交易所管理',
      exchangeName: '交易所名称',
      exchangeAbbr: '交易所简称',
      exchangeCode: '交易所编码',
      exchangeType: '交易所类别',
      usingFlag: '状态'
    },
    sys: {
      title: '首页配置',
      itemId: '组件标识',
      itemName: '组件名称（中文）',
      itemNameEn: '组件名称（英文）',
      rptUrl: '报表地址',
      itemWidth: '宽度百分比',
      itemHeight: '高度(px)',
      usingFlag: '状态',
      rptRoute: '报表路由'
    },
    productBasis: {
      list: {
        productName: '品名',
        priceItemName: '价格项',
        usingFlag: '状态',
        remark: '备注'
      },
      form: {
        productCode: '品名',
        priceItemCode: '价格项',
        usingFlag: '状态',
        remark: '备注'
      }
    },
    futurePrice: {
      form: {
        search: '查询',
        pricingDate: '报价日期',
        price: '价格',
        priceItemCode: '价格项代码',
        selectFile: '选择文件',
        checkResult: '检查结果',
        priceItemName: '价格项名称',
        futureContractNo: '合约代码',
        import: '期货行情导入'
      },
      tab: {
        uploadPriceDetail: '价格明细'
      },
      group: {
        editFormPart1: '基本信息',
        importFormPart1: '基本信息'
      },
      list: {
        pricingDate: '报价日期',
        price: '价格',
        priceItemName: '价格项'
      }
    },
    inOutGold: {
      form: {
        organName: '机构名称',
        deptName: '部门名称',
        derivativeAccount: '衍生品账号',
        derivativeSubAccount: '衍生品子账号',
        outGold: '出金',
        inGold: '入金',
        currencyCode: '币种',
        strategyName: '策略名称',
        theDate: '日期'
      },
      list: {
        organName: '机构名称',
        deptName: '部门名称',
        derivativeAccount: '衍生品账号',
        derivativeSubAccount: '衍生品子账号',
        outGold: '出金',
        inGold: '入金',
        currencyCode: '币种',
        strategyName: '策略名称',
        theDate: '日期'
      }
    }
  }
}
