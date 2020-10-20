export default {
  spotProj: {
    // 现货头寸
    exposure: {
      compensate: {
        title: '红冲',
        viewTitle: '红冲历史',
        tradeDate: '日期',
        quantityOld: '单据数量',
        quantityNew: '单据数量（修改后）',
        difference: '差额'
      },
      msg: {
        confirm: '是否确认数据?',
        confirmSuccess: '确认成功',
        cancelConfirm: '是否取消确认数据?',
        cancelConfirmSuccess: '取消确认成功',
        numberTrans: '修改后单据数量不能大于原单据数量',
        compensateSave: '确认进行红冲操作?',
        isConfirm: '数据已经确认，不需要再次确认',
        noConfirm: '数据未确认，无法取消确认',
        confirmUpdate: '已确认数据无法进行修改',
        importSuccess: '导入成功!',
        preliminaryFlagUpdate: '期初数据无法修改!',
        caculate: '是否计算均价及敞口数量?',
        caculateSuccess: '计算成功',
        detailListIsNull: '自动匹配状态下策略/计划明细不能为空',
        exposureIsEmpty: '敞口列表不能为空'
      },
      form: {
        organCode: '机构',
        deptCode: '部门',
        customerCode: '客户名称',
        tradeDate: '日期',
        currencyCode: '币种',
        direction: '方向',
        priceType: '定价方式',
        proliminaryFlag: '期初标识',
        mainData: '主信息',
        tab: '数据列表',
        import: '敞口导入',
        documentNo: '敞口号',
        exposureType: '敞口类型',
        productCode: '商品名称',
        virtualFlag: '虚拟购销',
        bizEmployeeCode: '业务员',
        spec: '规格',
        price: '价格'
      },
      list: {
        compStatus: '是否红冲',
        tradeDate: '日期',
        documentType: '单据类型',
        contractNo: '合同号',
        documentNo: '敞口号',
        direction: '方向',
        organName: '机构名称',
        deptName: '部门名称',
        customerName: '客户名称',
        productName: '品名',
        documentQuantity: '单据数量',
        rawQuantity: '敞口数量',
        priceType: '定价方式',
        startDate: '定价开始日期',
        endDate: '定价结束日期',
        expireDate: '到期日',
        price: '价格',
        currencyName: '币种',
        attrValue: '属性组',
        proliminaryFlag: '是否期初',
        exposureType: '敞口类型',
        productCode: '品名',
        avgPrice: '单价',
        premium: '升贴水',
        unitCode: '单位',
        marketCode: '市场',
        marketName: '市场名称',
        reason: '检查结果',
        priceItemCode: '定价基准',
        priceItemName: '定价基准',
        valuationCode: '估值基准',
        valuationName: '估值基准',
        matchQuantity: '匹配数量',
        noMatchQuantity: '可匹配数量',
        confirmStat: '确认状态',
        redQuantity: '红冲数量',
        planName: '名称',
        planCode: '编码',
        priceLimit: '成交价格区间',
        maxQuantity: '最大开仓量',
        exchangeRate: '汇率',
        priceStandard: '本币价格',
        virtualFlag: '虚拟购销',
        warehouseCode: '仓库',
        sets: '件数',
        setQuantity: '每件数量',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        warehouseName: '仓库',
        pricingNo: '定价编号',
        pricingDate: '定价日期'
      },
      tab: {
        exposureInfo: '现货敞口信息',
        strategyPlanInfo: '策略/计划明细信息',
        monthDetail: '月均价敞口明细'
      },
      dialog: {
        title: '现货敞口选择',
        planSelect: '计划选择',
        strategySelect: '策略选择'
      }
    },
    // 资金管理
    fund: {
      form: {
        title: '资金管理',
        organCode: '机构',
        deptCode: '部门',
        supplierCode: '客商',
        purchaseSaleType: '购销类型',
        documentStat: '单据状态',
        originalCurrencyAmt: '原币金额',
        preliminaryFlag: '期初标志',
        documentDate: '日期'
      },
      list: {
        documentStat: '单据状态',
        organName: '机构',
        deptName: '部门',
        documentNo: '单据编号',
        documentDate: '日期',
        purchaseSaleType: '购销类型',
        supplierName: '客商',
        originalCurrencyName: '原币币种',
        originalCurrencyAmt: '原币金额',
        exchangeRate: '汇率',
        domesticCurrencyAmt: '本币金额',
        matchAmt: '已匹配金额',
        unmatchAmt: '未匹配金额',
        preliminaryFlag: '期初标志',
        remark: '备注',
        makeUserName: '制单人',
        makeDt: '制单时间',
        approvalUserName: '审批人',
        approvalDt: '审批时间'
      },
      edit: {
        title: '资金编辑',
        organCode: '机构',
        deptCode: '部门',
        documentNo: '单据编号',
        documentDate: '单据日期',
        purchaseSaleType: '购销类型',
        originalCurrencyCode: '原币币种',
        originalCurrencyAmt: '原币金额',
        exchangeRate: '汇率',
        domesticCurrencyAmt: '本币金额',
        supplierCode: '客商',
        supplierName: '客商名称',
        preliminaryFlag: '期初标志',
        remark: '备注',
        fundType: '款项类型',
        spotExposureCode: '现货敞口编号',
        cliamAmt: '认领金额',
        detailRemark: '备注',
        cliamMoney: '款项认领',
        documentStat: '单据状态',
        msg: {
          costTypeList: '资金分配至少有一条',
          cliamAmtEmpty: '【现货敞口编号】选择时，【认领金额】也必须输入',
          exposureTypeEmpty: '现货敞口编号不能为空',
          claimAmtZero: '认领金额不能为0',
          fundTypeEmpty: '款项类型不能为空',
          cliamAmtMax: '【款项分配】的【认领金额】之和超过了基础信息的【原币金额】',
          addPreliminaryCheck: '期初设置开关已打开，不能新增期初数据',
          updatePreliminaryCheck: '期初设置开关已打开，不能修改期初数据',
          deletePreliminaryCheck: '期初设置开关已打开，不能删除期初数据',
          changeUnpreliminaryCheck: '期初设置开关已打开，不能将非期初数据修改为期初数据'
        }
      },
      msg: {
        fundNotAudit: '资金未审核通过，无法退审'
      },
      tabs: {
        mainInfoTitle: '主信息',
        fundClaimDetailTitle: '款项分配'
      }
    },
    // 费用管理
    cost: {
      form: {
        title: '资金管理',
        organCode: '机构',
        deptCode: '部门',
        customerCode: '客商',
        purchaseSaleType: '购销类型',
        documentStat: '单据状态',
        originalCurrencyAmt: '原币金额',
        preliminaryFlag: '期初标志',
        documentDate: '日期'
      },
      list: {
        documentStat: '单据状态',
        organName: '机构',
        deptName: '部门',
        documentNo: '单据编号',
        documentDate: '日期',
        purchaseSaleType: '购销类型',
        customerName: '客商',
        originalCurrencyName: '原币币种',
        originalCurrencyAmt: '原币金额',
        exchangeRate: '汇率',
        domesticCurrencyAmt: '本币金额',
        matchAmt: '已匹配金额',
        unmatchAmt: '未匹配金额',
        preliminaryFlag: '期初标志',
        remark: '备注',
        makeUserName: '制单人',
        makeDt: '制单时间',
        approvalUserName: '审批人',
        approvalDt: '审批时间',
        derivativeAccount: '期货账号',
        projectCode: '考核主体',
        strategyName: '策略名称'
      },
      edit: {
        applicant: '申请人',
        title: '资金编辑',
        organCode: '机构',
        deptCode: '部门',
        documentNo: '单据编号',
        documentDate: '单据日期',
        purchaseSaleType: '购销类型',
        originalCurrencyCode: '原币币种',
        originalCurrencyAmt: '原币金额',
        exchangeRate: '汇率',
        domesticCurrencyAmt: '本币金额',
        customerCode: '客商',
        customerName: '客商名称',
        preliminaryFlag: '期初标志',
        remark: '备注',
        costType: '费用类型',
        spotExposureCode: '现货敞口编号',
        cliamAmt: '认领金额',
        detailRemark: '备注',
        cliamMoney: '费用分配',
        documentStat: '单据状态',
        derivativeAccount: '期货账号',
        strategyName: '策略名称',
        projectCode: '考核主体',
        instructionCode: '指令名称',
        strategyCode: '策略名称',
        planCode: '计划名称',
        direction: '收入/支出',
        costNature: '费用性质',
        msg: {
          costTypeList: '费用分配至少有一条',
          costTypeEmpty: '费用类型不能为空',
          exposureTypeEmpty: '现货敞口编号不能为空',
          claimAmtZero: '认领金额不能为0',
          cliamAmtMax: '【费用分配】的【认领金额】之和超过了基础信息的【原币金额】',
          addPreliminaryCheck: '期初设置开关已打开，不能新增期初数据',
          updatePreliminaryCheck: '期初设置开关已打开，不能修改期初数据',
          deletePreliminaryCheck: '期初设置开关已打开，不能删除期初数据',
          changeUnpreliminaryCheck: '期初设置开关已打开，不能将非期初数据修改为期初数据',
          directionEmpty: '收入/支出不能为空'
        }
      },
      msg: {
        costNotAudit: '费用未审核通过，无法退审'
      },
      tabs: {
        mainInfoTitle: '主信息',
        costClaimDetailTitle: '款项分配'
      }
    }
  }
}