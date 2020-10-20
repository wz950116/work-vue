export default {
  data: {
    futuresSpotCompare: {
      form: {
        saveDate: '日期',
        compareType: '类型',
        productCode: '品种名称',
        productOtherName: '别名',
        remark: '备注'
      },
      list: {
        saveDate: '日期',
        compareType: '类型',
        productName: '品种名称',
        productOtherName: '别名',
        remark: '备注'
      }
    },
    port: {
      portCode: '港口编码',
      portName: '港口名称',
      usingFlag: '启用状态',
      areaCode: '所在地区',
      enPortName: '英文名称'
    },
    futuresPrice: {
      dialog: {
        import: '期货行情导入'
      },
      tab: {
        futuresPriceInfo: '期货行情信息'
      },
      msg: {
        futuresPriceIsEmply: '行情数据为空，无法保存'
      },
      form: {
        contractCode: '合约代码',
        saveDate: '日期',
        dataSource: '数据来源',
        settlementPrice: '结算价',
        lastPrice: '收盘价',
        highestPrice: '最高价',
        lowestPrice: '最低价',
        openPrice: '开盘价'
      },
      list: {
        contractCode: '合约代码',
        saveDate: '日期',
        dataSource: '数据来源',
        settlementPrice: '结算价',
        lastPrice: '收盘价',
        highestPrice: '最高价',
        lowestPrice: '最低价',
        openPrice: '开盘价',
        reason: '检查结果'
      }
    },
    spotMarket: {
      form: {
        marketName: '市场名称',
        search: '查询',
        marketLevel: '市场级别',
        marketType: '市场类型',
        usingFlag: '启用状态'
      },
      tab: {
        area: '覆盖区域',
        product: '交易品名'
      },
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        marketName: '市场名称',
        marketCode: '市场代码',
        marketLevel: '市场级别',
        productGroupName: '品名分类',
        marketType: '市场类型',
        usingFlag: '启用状态',
        productName: '品名'
      }
    },
    feeType: {
      currencyCode: '币种',
      code: '代码',
      name: '名称',
      rate: '税率(%)',
      defaultPrice: '默认单价'
    },
    warehouse: {
      form: {
        areaCode: '所在地区',
        address: '地址',
        mail: '邮箱',
        warehouseLevel: '仓库级别',
        contact: '联系人',
        storeCompanyCode: '仓储公司',
        tel: '电话',
        remark: '备注',
        warehouseType: '仓库类型',
        warehouseName: '仓库名称',
        usingFlag: '启用状态',
        allocationType: '分配方式'
      },
      tab: {
        productTag: '品种设置',
        allocationTag: '分配信息'
      },
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        storeCompanyName: '仓储公司',
        address: '地址',
        warehouseLevel: '仓库级别',
        areaName: '所在地区',
        maxCapacity: '最大容量',
        warehouseType: '仓库类型',
        warehouseName: '仓库名称',
        warehouseCode: '仓库代码',
        usingFlag: '启用状态',
        allocationType: '分配方式',
        productName: '品种',
        productUnitName: '商品单位',
        measurementUnitName: '计量单位',
        organName: '机构名称'
      }
    },
    deptAllocation: {
      groupSet: '机构分配设置',
      form: {
        code: '审批组代码',
        name: '审批组名称',
        remark: '备注信息',
        usingFlag: '状态',
        groupCode: '审批组代码'
      },
      tab: {
        tabEmployee: '审批组员'
      },
      popup: {
        editEmployee: '编辑组员',
        edit: '编辑',
        tabEmployee: '编辑',
        index: '一览'
      },
      group: {
        editEmployeePart1: '主信息'
      },
      list: {
        code: '审批组代码',
        name: '审批组名称',
        remark: '备注信息',
        usingFlag: '状态',
        employeeCode: '员工',
        employeeName: '员工'
      }
    },
    customs: {
      form: {
        areaCode: '所在地区',
        address: '地址',
        mail: '邮箱',
        areaName: '所在地区',
        contact: '联系人',
        customsName: '海关名称',
        tel: '电话',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        areaName: '所在地区',
        customsName: '海关名称',
        usingFlag: '启用状态',
        customsCode: '海关代码'
      }
    },
    bank: {
      form: {
        address: '地址',
        mail: '邮箱',
        areaName: '所在地区',
        contact: '联系人',
        bankName: '银行名称',
        tel: '电话',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        bankCode: '银行代码',
        areaName: '所在地区',
        bankName: '银行名称',
        usingFlag: '启用状态'
      }
    },
    bankAccount: {
      form: {
        bankAccountName: '账户名称',
        bankCode: '开户银行',
        organCode: '机构',
        bankAccountType: '账户类型',
        searchBtn: '查询',
        bankAccountNo: '账号',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        bankAccountName: '账户名称',
        organName: '机构',
        bankAccountType: '账户类型',
        bankAccountNo: '账号',
        bankName: '开户银行',
        usingFlag: '启用状态'
      }
    },
    unit: {
      form: {
        unitName: '单位名称',
        remark: '备注',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        unitName: '单位名称',
        usingFlag: '启用状态'
      }
    },
    recordingRate: {
      form: {
        search: '查询',
        exchangeRate: '汇率',
        currencyDate: '日期',
        currencyCode: '币种',
        startDate: '开始日期'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        endDate: '截止日期',
        exchangeRate: '汇率',
        currencyCode: '币种',
        startDate: '开始日期'
      }
    },
    fiscalPeriod: {
      form: {
        date: '日期',
        financeCloseFlag: '财务完结标志',
        businessCloseFlag: '业务完结标志',
        endDate: '结束日期',
        organCode: '机构',
        remark: '备注',
        fiscalPeriodCode: '会计期间代码',
        fiscalYear: '会计年度',
        startDate: '开始日期'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        organName: '机构',
        financeCloseFlag: '财务完结标志',
        businessCloseFlag: '业务完结标志',
        endDate: '结束日期',
        fiscalPeriodCode: '会计期间代码',
        fiscalYear: '会计年度',
        startDate: '开始日期'
      }
    },
    organCalendar: {
      form: {
        calendar: '日历组件',
        search: '查询',
        organCode: '机构'
      },
      tab: {},
      group: {},
      list: {
        organName: '机构名称',
        tradingDayCnt: '工作日天数',
        dayCount: '总天数',
        organCode: '机构代码',
        yearMonth: '年月',
        nonTradingDayCnt: '休日天数',
        otherDayCnt: '未维护天数'
      }
    },
    priceItem: {
      form: {
        priceUnitName: '价格单位',
        futureContractNo: '期货合约',
        calcPricingRate: '价格系数',
        futureProductNo: '期货品种',
        priceItemType: '价格项类型',
        calcPricingOffset: '偏移量',
        remark: '备注',
        calcPriceItemCode: '基础价格项',
        priceItemName: '价格项名称',
        usingFlag: '启用状态',
        valuationType: '计价类型'
      },
      tab: {},
      popup: {
        editForm: '编辑',
        index: '一览',
        choose: '选择'
      },
      group: {
        editFormPart1: '基本信息',
        editFormPart2: '价格来源'
      },
      list: {
        priceUnitName: '价格单位',
        priceItemType: '价格项类型',
        priceItemCode: '价格项代码',
        priceItemName: '价格项名称',
        usingFlag: '启用状态'
      }
    },
    pricingBase: {
      form: {
        pricingCode: '定价基准代码',
        pricingFormula: '价格公式',
        remark: '备注',
        pricingName: '定价基准名称',
        usingFlag: '启用状态'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        pricingCode: '定价基准代码',
        pricingFormula: '定价公式',
        pricingName: '定价基准名称',
        usingFlag: '状态'
      }
    },
    spotPrice: {
      form: {
        search: '查询',
        pricingDate: '报价日期',
        price: '价格',
        priceItemCode: '价格项代码',
        selectFile: '选择文件',
        checkResult: '检查结果',
        priceItemName: '价格项名称',
        import: '现货行情导入',
        startDate: '日期区间'
      },
      tab: {
        importDialog: '现货行情导入',
        uploadPriceDetail: '价格明细',
        trendChard: '价格走势'
      },
      group: {
        editFormPart1: '基本信息',
        importFormPart1: '基本信息'
      },
      list: {
        pricingDate: '报价日期',
        price: '价格',
        priceItemName: '价格项名称',
        reason: '检查结果'
      }
    },
    productItem: {
      choose: '物资选择',
      treeName: '品名及分类',
      form: {
        productKeyAttr02: '属性2',
        search: '查询',
        productKeyAttr01: '属性1',
        productKeyAttr04: '属性4',
        productKeyAttr03: '属性3',
        productKeyAttr06: '属性6',
        productKeyAttr05: '属性5',
        origin: '产地',
        productGroupName: '品名分类',
        brand: '品牌',
        productName: '品名',
        spec: '规格',
        allocationType: '分配方式'
      },
      tab: {
        allocationTag: '机构分配设置'
      },
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        productUnitCode: '商品单位',
        measurementUnitCode: '计量单位',
        productGroupName: '品名分类',
        productName: '品名',
        organName: '机构名称',
        allocationType: '分配方式'
      }
    },
    productGroup: {
      form: {
        parentCode: '上级分类',
        productGroupName: '品名分类名称'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        productGroupName: '品名分类'
      }
    },
    product: {
      treeName: '品名分类',
      form: {
        search: '查询',
        productCode: '品名代码',
        productGroup: '品名分类',
        productUnitCode: '商品单位',
        measurementUnitCode: '计量单位',
        productGroupName: '品名分类',
        priceItemCode: '基准价格',
        remark: '备注',
        productName: '品名名称',
        usingFlag: '状态',
        costCalArgument: '成本计算参数'
      },
      tab: {
        taxRate: '税率(%)',
        marginRate: '保证金率设置',
        marginFormula: '保证金公式设置'
      },
      popup: {
        taxRateTab: '税率(%)',
        editForm: '编辑',
        index: '一览',
        choose: '品名选择'
      },
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        taxRate: '税率(%)',
        unit: '计量单位',
        productCode: '品名代码',
        productUnitCode: '商品单位',
        measurementUnitCode: '计量单位',
        productUnitName: '商品单位',
        measurementUnitName: '计量单位',
        productGroupName: '品名分类',
        productName: '品名名称',
        priceItemName: '基准价格',
        usingFlag: '启用状态',
        taxType: '税种',
        startDate: '开始日期',
        costCalArgument: '成本计算参数'
      },
      marginSet: {
        marginRateInit: '初始保证金率',
        marginRateHold: '维持保证金率',
        marginRateStop: '终止保证金率',
        marginRateReturn: '退还保证金率',
        formulaScene1: '采购-先定价后转货权-收取、销售-先定价后转货权-支付',
        formulaScene2: '采购-先定价后转货权-支付、销售-先定价后转货权-收取',
        formulaScene3: '采购-后定价先转货权-收取、销售-后定价先转货权-支付',
        formulaScene4: '采购-后定价先转货权-支付、销售-后定价先转货权-收取',
        formulaType1: '实时保证金率',
        formulaType2: '追缴保证金',
        formulaType3: '退还保证金'
      }
    },
    area: {
      form: {
        parentCode: '上级地区',
        areaName: '地区名称',
        areaType: '地区类型',
        remark: '备注'
      },
      tab: {},
      group: {
        editFormPart1: '基本信息'
      },
      list: {
        areaCode: '地区代码',
        areaName: '地区名称',
        areaType: '地区类型'
      }
    },
    warnSet: {
      menuInfo: '菜单信息',
      baseInfo: '基础信息',
      chartStyle: '图表样式',
      xAxis: 'X轴',
      yAxis: 'Y轴',
      legend: '维度',
      thresholdArray: '阀值',
      chartOption: 'options增强(除series)',
      seriesOption: 'series增强',
      leafFlag: '类型',
      parentName: '上级目录',
      menuName: '名称',
      lmenuEnameabel: '英语名称',
      sortNo: '排序号',
      iframeFlag: '是否为iframe',
      menuUrl: '菜单URL',
      componentName: '组件名称',
      component: 'component',
      moduleType: '菜单类型',
      authFlag: '授权方式',
      hiddenFlag: '是否隐藏',
      noCacheFlag: '是否无缓存',
      reuseFlag: '组件复用',
      operateCode: '操作代码',
      operateName: '操作名称',
      operateEname: '操作英文名称'
    },
    warnSource: {
      sourceInfo: '预警源信息',
      sourceName: '预警源名称',
      sourceCode: '预警源代码',
      getColumn: '获取列信息',
      columnPro: '字段属性',
      addEmployee: '添加人员',
      updateEmployee: '修改人员',
      colCode: '列名',
      columnInfo: '列信息',
      tenantCol: '租户字段',
      colName: '中文名',
      dataType: '数据类型',
      excelName: '预警源',
      legendDataSql: '数据项SQL',
      sql: 'SQL',
      notBlank: {
        sourceName: '预警源名称不能为空',
        sourceCode: '预警源代码不能为空',
        sql: 'SQL不能为空'
      },
      maxLength: {
        sourceName: '最大长度128',
        sourceCode: '最大长度32',
        remark: '最大长度500',
        sql: '最大长度4000'
      }
    },
    warning: {
      warningInfo: '预警信息',
      warningName: '预警名称',
      warningCode: '预警代码',
      warningType: '预警类型',
      triggerType: '周期类型',
      recordFlag: '是否记录',
      sourceCode: '预警源代码',
      triggerTime: '时间',
      usingFlag: '状态',
      remark: '预警说明',
      excelName: '预警',
      warnSource: '预警源',
      warningStaff: '预警人员',
      msgTemplate: '消息模板',
      warningCond: '预警条件',
      warningColumn: '预警参数一览',
      conditionName: '条件',
      paramName: '参数名',
      matchType: '匹配方式',
      dimension: '维度',
      paramSetting: '预警参数设置',
      notBlank: {
        warningName: '预警名称不能为空',
        usingFlag: '状态不能为空'
      },
      maxLength: {
        warningName: '最大长度128',
        remark: '最大长度500'
      }
    },
    // 产地维护
    priceOrigin: {
      choose: '产地维护',
      form: {
        code: '代码',
        origin: '产地'
      },
      list: {
        originCode: '产地代码',
        originName: '产地名称',
        englishName: '英文名称',
        mnemonic: '助记码',
        remark: '备注'
      }
    },
    // 规格维护
    specs: {
      choose: '产地维护',
      form: {
        specs: '规格',
        specsCode: '规格代码'
      },
      list: {
        specs: '规格',
        specsCode: '规格代码',
        remark: '备注'
      }
    },
    // 计价元素维护
    priceElement: {
      choose: '计价元素维护',
      form: {
        elementName: '元素名称',
        measurementUnitCode: '计量单位',
        usingFlag: '状态',
        documentMaker: '制单人',
        documentDate: '制单日期',
        documentDept: '制单部门'
      },
      list: {
        priceElementName: '计价元素名称',
        priceElementCode: '计价元素编码',
        measurementUnitCode: '计量单位',
        decimaDligit: '小数位数',
        usingFlag: '状态',
        remark: '备注'
      }
    },
    // 物料与计价元素关联
    productPriceElement: {
      choose: '计价元素维护',
      form: {
        materialName: '物料名称',
        materialClassification: '物料分类',
        priceElementName: '计价元素名称',
        documentMaker: '制单人',
        documentDate: '制单日期',
        documentDept: '制单部门'
      },
      list: {
        materialName: '物料名称',
        materialClassification: '物料分类',
        priceElementName: '计价元素名称',
        measurementUnitCode: '计量单位',
        isPriceElementName: '是否主计价元素',
        entryDate: '录入日期'
      },
      tab: {
        priceElement: '计价元素'
      }
    },
    // 物料化学成分设置
    materialSet: {
      choose: '物料化学成分设置',
      form: {
        documentDateStart: '制单日期始',
        documentDeteEnd: '制单日期止',
        materialName: '物料名称',
        documentDept: '制单部门',
        standardName: '标准名称',
        documentMaker: '制单人'
      },
      list: {
        materialName: '物料名称',
        standardName: '标准名称',
        documentDeteEnd: '制单日期',
        documentMaker: '制单人',
        elementType: '元素类型',
        elementName: '元素',
        range: '成分范围',
        unit: '单位'
      },
      tab: {
        materialSet: '化学成分要求'
      }
    },
    // 合同价格条款标准设置
    contractPriceItems: {
      choose: '合同价格条款标准设置',
      form: {
        documentNo: '单据号',
        clauseName: '条款名称',
        documentDateStart: '制单日期始',
        documentDeteEnd: '制单日期止',
        contractType: '合同类型',
        materialName: '物料名称',
        documentDept: '制单部门',
        documentMaker: '制单人'
      },
      list: {
        materialName: '物料名称',
        clauseName: '条款名称',
        contractType: '合同类型',
        documentDete: '制单日期',
        // 2
        documentMaker: '价格类型',
        elementName: '元素名称',
        pricingName: '定价基准',
        futureProductNo: '期货品种',
        valuationStandard: '作价基准',
        valuationPeriod: '作价期/点价期',
        priceBenchmark: '价格基准',
        pointParty: '点价方',
        priceItemCode: '基准价格',
        unitFactor: '单位折算系数',
        // 3
        priceElement: '计价元素',
        grade: '品位区间',
        increaseOrDeductMoney: '加价或扣款（元/铜金属吨）',
        // 4
        impurity: '杂质元素',
        deductionStandard: '扣款标准',
        // 5
        origin: '产地',
        price: '单价',
        unit: '单位',
        // cu
        benchmarkRange: '基准价区间',
        pricingCoefficient: '计价系数（%）',
        AuElement: 'Au元素（克/干吨）',
        AgElement: 'Ag元素（克/干吨）'
      },
      group: {
        baseInfo: '基本信息'
      },
      tab: {
        chemical: '化学成分要求',
        pricingInformation: '计价元素的定价信息',
        pricingMaintain: '计价系数维护',
        elementTab: '计价元素品位加价或扣款',
        impurityDeductionStandard: '杂质元素扣款标准',
        distanceIncrease: '运距加价',
        Cu: '铜',
        gold: '金',
        silver: '银'
      }
    }
  }
}
