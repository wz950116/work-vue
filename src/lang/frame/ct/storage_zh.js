export default {
  storage: {
    // 库存初始化
    beginOpen: {
      group: {
        editPart1: '库存初始化信息'
      },
      form: {
        inBillNo: '入库单号',
        inDate: '入库日期',
        warehouseCode: '仓库',
        supplierCode: '供应商',
        deliverCode: '发货单位',
        productCode: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        currencyCode: '币种',
        beginDataFlag: '初始化完成',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '库存件数',
        quantity: '库存数量',
        currencyName: '币种',
        exchangeRate: '汇率',
        taxRate: '税率(%)',
        pricePricing: '定价价格',
        measurementQuantity: '计量数量',
        productUnitCode: '商品单位编码',
        measurementUnitCode: '计量单位编码',
        bizOrganCode: '业务机构',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员'
      },
      list: {
        beginDataFlag: '初始化完成',
        inBillNo: '入库单号',
        inDate: '入库日期',
        warehouseName: '仓库',
        supplierName: '供应商',
        deliverName: '发货单位',
        productName: '商品',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '库存件数',
        quantity: '库存数量',
        currencyName: '币种',
        exchangeRate: '汇率',
        taxRate: '税率',
        pricePricing: '定价价格',
        measurementQuantity: '计量数量',
        productUnitCode: '商品单位编码',
        measurementUnitCode: '计量单位编码',
        bizOrganName: '业务机构',
        bizDeptName: '业务部门',
        bizEmployeeName: '业务员'
      }
    },
    // 提单登记
    ladingBill: {
      btn: {
        inNotice: '入库通知'
      },
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改'
      },
      form: {
        ladingBillNo: '提单号',
        productCode: '商品',
        propertyFlag: '货权转移',
        lotNo: '采购批次号',
        bizEmployeeCode: '业务员',
        preBIllNo: '前置单据编号',
        remark: '备注',
        supplierCode: '供应商',
        deliverCode: '发货单位',
        originNo: '原始单号',
        ladingType: '提单类型',
        ladingDate: '提单日期'
      },
      tab: {
        product: '提单商品信息',
        cost: '费用'
      },
      popup: {
        inProduct: '编辑',
        editForm: '编辑',
        list: '一览'
      },
      group: {
        editFormPart1: '提单信息'
      },
      list: {
        ladingBillNo: '提单号',
        auditStatus: '审批状态',
        ladingDate: '提单日期',
        preBIllType: '前置单据类型',
        preBIllNo: '前置单据编号',
        ladingType: '提单类型',
        supplierName: '供应商',
        deliverName: '发货单位',
        productCode: '商品',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '件数',
        measurementQuantity: '计量数量',
        measurementUnitName: '计量单位',
        ladingQuantity: '重量',
        productKeyAttr: '属性',
        productUnitName: '重量单位',
        goodsFlag: '货齐',
        settlementQuantity: '结算数量',
        rightFlag: '货权转移',
        rightTransferDate: '货权转移日期',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        remark: '备注',
        reservedStr1: '报关单号',
        reservedStr2: '手册号',
        reservedStr3: '仓位名称'
      },
      msg: {
        chooseLotProduct: '只可以选择同一采购批次中的商品明细',
        inNotice: '审核通过才能进行入库通知',
        noPostData: '所选数据未入库重量为0，无法进行入库通知'
      }
    },
    // 提单直发
    ladingOut: {
      btn: {
        ladingOutCheck: '提单直发确认'
      },
      form: {
        productCode: '商品',
        lotNo: '销售批次号',
        bizEmployeeCode: '业务员',
        customerCode: '客户',
        ladingOutNo: '提单直发编号',
        remark: '备注',
        currencyCode: '币种',
        ladingOutDate: '直发日期',
        preBillNo: '前置单据编号',
        settlementCode: '结算单位',
        ladingOutType: '直发类型'
      },
      tab: {
        product: '直发商品信息',
        productPick: '直发商品拣配信息',
        cost: '费用'
      },
      popup: {
        productPickTab: '编辑',
        editForm: '编辑',
        productTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart1: '直发信息'
      },
      list: {
        auditStatus: '审批状态',
        brandName: '品牌',
        optEmployeeName: '制单人',
        productKeyAttr02: '属性2',
        ladingBillNo: '提单号',
        productKeyAttr01: '属性1',
        measurementUnitName: '计量单位',
        productKeyAttr03: '属性3',
        bizEmployeeName: '业务员',
        origin: '产地',
        ladingProductNo: '提单商品编号',
        remark: '备注',
        ladingOutDate: '直发日期',
        ladingOutQuantity: '直发重量',
        checkQuantity: '确认重量',
        productName: '商品',
        spec: '规格',
        ladingNo: '提单号',
        itemCount: '直发件数',
        ladingOutMeasurementQuantity: '直发计量数量',
        checkMeasurementQuantity: '确认计量数量',
        preBillNo: '前置单据编号',
        preBIllType: '前置单据类型',
        productUnitName: '货物单位',
        ladingOutNo: '提单直发单号',
        brand: '品牌',
        supplierName: '供应商',
        customerName: '客户',
        goodsFlag: '货齐',
        rightFlag: '货权转移',
        rightTransferDate: '货权转移日期',
        settlementQuantity: '结算数量',
        settlementName: '结算单位',
        currencyCode: '币种',
        includeTaxPrice: '含税单价',
        includeTaxAmount: '含税金额',
        excludeTaxPrice: '无税单价',
        excludeTaxAmount: '无税金额',
        taxRate: '税率(%)',
        taxAmount: '税额'
      },
      msg: {
        chooseLotProduct: '只可以选择同一销售批次中的商品明细',
        ladingOutCheck: '审核通过才能进行提单直发确认',
        noPostData: '所选数据无法进行提单直发'
      }
    },
    // 提单直发确认
    ladingOutCheck: {
      form: {
        productCode: '商品',
        lotNo: '销售批次号',
        optEmployeeCode: '制单人',
        bizEmployeeCode: '业务员',
        customerCode: '客户',
        ladingOutNo: '提单直发编号',
        ladingOutConfirmNo: '直发确认编号',
        ladingOutConfirmDate: '直发确认日期',
        remark: '备注',
        ladingOutDate: '直发日期',
        settlementCode: '结算单位',
        ladingOutType: '直发类型'
      },
      tab: {
        product: '直发商品信息',
        productPick: '直发商品拣配信息'
      },
      popup: {
        productPickTab: '编辑',
        Form: '编辑',
        productTab: '编辑',
        list: '一览'
      },
      group: {
        FormPart1: '直发信息'
      },
      list: {
        ladingOutConfirmNo: '直发确认编号',
        ladingOutConfirmDate: '直发确认日期',
        brandName: '品牌',
        optEmployeeName: '制单人',
        productKeyAttr02: '属性2',
        productKeyAttr01: '属性1',
        ladingBillNo: '提单号',
        measurementUnitName: '计量单位',
        productKeyAttr03: '属性3',
        bizEmployeeName: '业务员',
        origin: '产地',
        ladingProductNo: '提单商品编号',
        ladingOutDate: '直发日期',
        ladingOutQuantity: '直发重量',
        productName: '商品',
        spec: '规格',
        ladingNo: '提单号',
        itemCount: '直发件数',
        ladingOutMeasurementQuantity: '直发计量数量',
        checkMeasurementQuantity: '确认计量数量',
        actualMeasurementQuantity: '确认计量数量',
        checkQuantity: '确认重量',
        actualQuantity: '确认重量',
        goodsFlag: '货齐',
        settlementQuantity: '结算数量',
        auditStatus: '审批状态',
        lotNo: '销售批次号',
        productUnitName: '单位',
        ladingOutNo: '提单直发编号',
        brand: '品牌'
      }
    },
    // 货权转移
    cargoRightTransfer: {
      form: {
        productCode: '商品',
        lotNo: '批次号',
        bizEmployeeCode: '业务员',
        billDate: '单据日期',
        rightFlag: '货权转移状态',
        rightTransferDate: '货权转移日期',
        billNo: '单据号'
      },
      tab: {},
      popup: {
        list: '一览'
      },
      group: {},
      list: {
        productKeyAttr: '属性',
        quantity: '数量',
        unitName: '单位',
        billType: '单据类型',
        bizEmployeeName: '业务员',
        billDate: '单据日期',
        rightTransferDate: '货权转移日期',
        productName: '商品',
        itemCount: '件数',
        lotNo: '批次号',
        optStaffName: '制单人',
        rightFlag: '货权转移状态',
        billNo: '单据号'
      }
    },
    // 入库通知
    inNotice: {
      btn: {
        ihCheck: '入库验收'
      },
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseLotProduct: '只有入库类型为批次入库时，才可以选择采购批次',
        chooseLotProductBack: '只可以选择同一采购批次中的商品明细',
        chooseLadingProduct: '只有入库类型为提单入库时，才可以选择提单',
        chooseLadingProductBack: '只可以选择同一提单中的商品信息',
        ihCheck: '审核通过才能进行入库验收',
        chooseOutReturnProductBack: '只可以选择同一原入库单号的商品信息'
      },
      form: {
        productCode: '商品',
        ladingBillNo: '提单号',
        propertyFlag: '货权转移',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号',
        lotNo: '采购批次号',
        inDate: '入库日期',
        bizEmployeeCode: '业务员',
        remark: '备注',
        supplierCode: '供应商',
        deliverCode: '发货单位',
        inType: '入库类型',
        inBillNo: '入库单号',
        warehouseCode: '仓库',
        currencyCode: '币种',
        headlineCode: '抬头',
        outReturnNo: '退换货单号'
      },
      tab: {
        product: '入库商品信息',
        cost: '费用'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        list: '一览',
        inNoticeSelect: '选择入库单',
        inProductSelect: '选择入库商品'
      },
      group: {
        editFormPart1: '入库单信息'
      },
      list: {
        auditStatus: '审批状态',
        remark: '备注',
        measurementQuantity: '入库计量数量',
        warehouseName: '仓库',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDate: '入库日期',
        contractNo: '采购合同号',
        lotNo: '采购批次号',
        rightFlag: '货权转移',
        supplierName: '供应商',
        deliverName: '发货单位',
        ladingBillNo: '提单号',
        productKeyAttr: '属性',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        productCode: '商品',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '件数',
        inQuantity: '入库重量',
        actualQuantity: '验收重量',
        restQuantity: '未验收重量',
        productUnitCode: '单位',
        productUnitName: '单位',
        inMeasurementQuantity: '入库计量数量',
        actualMeasurementQuantity: '验收计量数量',
        restMeasurementQuantity: '未验收计量数量',
        measurementUnitCode: '计量单位',
        measurementUnitName: '计量单位',
        goodsFlag: '货齐',
        settlementQuantity: '结算数量',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号',
        includeTaxPrice: '含税单价',
        includeTaxAmount: '含税金额',
        excludeTaxPrice: '无税单价',
        excludeTaxAmount: '无税金额',
        taxRate: '税率(%)',
        taxAmount: '税额',
        unCliamQuantity: '未认领数量',
        unVerificatQuantity: '未核销数量'
      }
    },
    // 入库验收
    inCheck: {
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseInProductBack: '只可以选择同一入库通知单中的商品信息'
      },
      form: {
        inCheckNo: '入库验收单号',
        inCheckDate: '入库验收日期',
        ladingBillNo: '提单号',
        inDate: '入库日期',
        bizEmployeeCode: '业务员',
        remark: '备注',
        supplierCode: '供应商',
        inBillNo: '入库单号',
        warehouseCode: '仓库',
        productCode: '商品',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号',
        lotNo: '采购批次号',
        deliverCode: '发货单位',
        inType: '入库类型'
      },
      tab: {
        product: '入库验收商品信息',
        productDetail: '入库验收商品明细信息'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        productDetailTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart2: '入库验收单信息',
        editFormPart1: '入库单信息'
      },
      list: {
        auditStatus: '审批状态',
        inCheckNo: '入库验收单号',
        inCheckDate: '入库验收日期',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        origin: '产地',
        remark: '备注',
        inBillNo: '入库单号',
        warehouseName: '仓库',
        productName: '商品',
        spec: '规格',
        stockArea: '库区',
        lotNo: '采购批次号',
        itemCount: '件数',
        actualCount: '验收件数',
        inQuantity: '入库重量',
        restQuantity: '未验收重量',
        actualQuantity: '验收重量',
        productUnitCode: '单位',
        productUnitName: '单位',
        measurementQuantity: '入库计量数量',
        restMeasurementQuantity: '未验收计量数量',
        actualMeasurementQuantity: '验收计量数量',
        measurementUnitCode: '计量单位',
        measurementUnitName: '计量单位',
        rightFlag: '货权转移',
        brand: '品牌',
        stockNo: '仓储号',
        supplierName: '供应商',
        optEmployeeName: '制单人',
        ladingBillNo: '提单号',
        productKeyAttr: '商品属性',
        bizEmployeeName: '业务员',
        inDate: '入库日期',
        stockPosition: '仓位名称',
        productCode: '商品',
        deliverName: '发货单位',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号'
      }
    },
    // 库存调整
    revision: {
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseStockDetail: '请先选择仓库'
      },
      form: {
        revisionDate: '调整日期',
        revisionNo: '库存调整单号',
        warehouseCode: '仓库',
        productCode: '商品',
        remark: '备注'
      },
      tab: {
        stockProduct: '库存商品信息',
        revisionProduct: '库存调整商品信息'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart1: '库存调整单信息'
      },
      list: {
        auditStatus: '审批状态',
        revisionNo: '库存调整单号',
        revisionDate: '调整日期',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号',
        stockDetailNo: '库存商品明细编号',
        warehouseName: '仓库',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '库存件数',
        quantity: '库存重量',
        measurementQuantity: '库存计量数量',
        restQuantity: '可卖重量',
        restMeasurementQuantity: '可卖计量数量',
        revisionCount: '调整件数',
        revisionQuantity: '调整重量',
        revisionMeasurementQuantity: '调整计量数量',
        productUnitCode: '单位',
        measurementUnitCode: '计量单位'
      }
    },
    // 库存冻结
    frozenBill: {
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseStockDetail: '请先选择仓库'
      },
      form: {
        expireDate: '冻结日期',
        frozenBillNo: '库存冻结单号',
        warehouseCode: '仓库',
        productCode: '商品',
        remark: '备注'
      },
      tab: {
        product: '库存冻结商品信息'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart1: '库存冻结单信息'
      },
      list: {
        auditStatus: '审批状态',
        frozenBillNo: '库存冻结单号',
        expireDate: '冻结日期',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号',
        stockDetailNo: '库存商品明细编号',
        warehouseName: '仓库',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '库存件数',
        frozenCount: '冻结件数',
        quantity: '库存重量',
        restQuantity: '可卖重量',
        frozenQuantity: '冻结重量',
        productUnitCode: '单位',
        measurementQuantity: '库存计量数量',
        restMeasurementQuantity: '可卖计量数量',
        frozenMeasurementQuantity: '冻结计量数量',
        measurementUnitCode: '计量单位'
      }
    },
    // 出库通知
    outNotice: {
      btn: {
        outCheck: '出库实提'
      },
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseLotProduct: '只可以选择同一销售批次中的商品明细',
        warehouseCodeRequired: '请先选择仓库',
        oneProductRequired: '请先选择一条出库商品信息',
        outCheck: '审核通过数据才能进行出库实提',
        noPostData: '所选数据无法进行出库通知'
      },
      form: {
        outDate: '出库日期',
        productCode: '商品',
        outBillNo: '出库单号',
        preBillType: '前置单据类型',
        preBillNo: '前置单据编号',
        contractNo: '销售合同号',
        lotNo: '销售批次号',
        bizEmployeeCode: '业务员',
        customerCode: '客户',
        remark: '备注',
        rightFlag: '货权转移',
        settlementCode: '结算单位',
        outType: '出库类型',
        warehouseCode: '仓库',
        currencyCode: '币种',
        headlineCode: '抬头',
        list: '出库通知列表',
        custCreditNo: '临时授信',
        inReturnNo: '退换货单号'
      },
      tab: {
        product: '出库商品信息',
        productDetail: '出库商品拣配信息',
        cost: '费用'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        productDetailTab: '编辑',
        list: '一览',
        outNoticeSelect: '选择出库单'
      },
      group: {
        editFormPart1: '出库信息'
      },
      list: {
        inContractNo: '合同号',
        auditStatus: '审批状态',
        outType: '出库类型',
        outBillNo: '出库单号',
        outDate: '出库日期',
        warehouseName: '仓库',
        preBillType: '前置单据类型',
        preBillNo: '前置单据编号',
        lotNo: '销售批次号',
        customerName: '客户',
        settlementName: '结算单位',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        rightFlag: '货权转移',
        itemCount: '件数',
        outQuantity: '出库重量',
        goodsFlag: '货齐',
        settlementQuantity: '结算重量',
        actualQuantity: '实提重量',
        restQuantity: '未实提重量',
        productUnitName: '单位',
        outMeasurementQuantity: '出库计量数量',
        actualMeasurementQuantity: '实提计量数量',
        restMeasurementQuantity: '未实提计量数量',
        measurementUnitName: '计量单位',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        stockDetailNo: '库存商品明细编号',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号',
        purchaseLotNo: '采购批次号',
        supplierName: '供应商名称',
        includeTaxPrice: '含税单价',
        includeTaxAmount: '含税金额',
        excludeTaxPrice: '无税单价',
        excludeTaxAmount: '无税金额',
        taxRate: '税率(%)',
        taxAmount: '税额',
        currencyCode: '币种',
        productDetailNo: '出库商品编号',
        salesContractNo: '销售合同号',
        salesLotNo: '销售批次号',
        unApplyQuantity: '未申请数量',
        unVerificatQuantity: '未核销数量'
      }
    },
    // 出库实提
    outCheck: {
      validateMsg: {
        update: '审批状态为审核中和已通过的单据不可以修改',
        remove: '只有审批状态为草拟的单据可以删除',
        chooseOutProductBack: '只可以选择同一出库通知单中的商品信息'
      },
      form: {
        outCheckNo: '出库实提单号',
        outCheckDate: '出库实提日期',
        outDate: '出库日期',
        productCode: '商品',
        outBillNo: '出库单号',
        preBillType: '前置单据类型',
        preBillNo: '前置单据编号',
        lotNo: '销售批次号',
        bizEmployeeCode: '业务员',
        checkEmployeeCode: '实提人',
        customerCode: '客户',
        remark: '备注',
        settlementCode: '结算单位',
        outType: '出库类型',
        warehouseCode: '仓库',
        goodsFlag: '货齐'
      },
      tab: {
        product: '出库实提商品信息',
        productDetail: '出库实提商品拣配信息'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        productDetailTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart1: '出库单信息',
        editFormPart2: '出库实提单信息'
      },
      list: {
        auditStatus: '审批状态',
        outCheckNo: '出库实提单号',
        outCheckDate: '出库实提日期',
        outType: '出库类型',
        outBillNo: '出库单号',
        outDate: '出库日期',
        preBillType: '前置单据类型',
        preBillNo: '前置单据编号',
        lotNo: '销售批次号',
        customerName: '客户',
        settlementName: '结算单位',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        rightFlag: '货权转移',
        itemCount: '件数',
        outQuantity: '出库重量',
        actualQuantity: '实提重量',
        productUnitName: '单位',
        outMeasurementQuantity: '出库计量数量',
        actualMeasurementQuantity: '实提计量数量',
        measurementUnitName: '计量单位',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        checkEmployeeName: '实提人',
        checkDate: '实提日期',
        stockDetailNo: '库存商品明细编号',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号'
      }
    },
    // 出库交单
    negotiate: {
      validateMsg: {
        contractNoRequired: '请先选择合同',
        customerCodeRequired: '请先选择客户'
      },
      form: {
        negotiatedBankCode: '交单行',
        draftsAtDate: '汇票付款期限',
        bizEmployeeCode: '业务员',
        customerCode: '客户',
        negotiateNo: '申请单号',
        remark: '备注',
        originalCurrencyAmt: '本次交单金额',
        letterCreditAmount: '信用证金额',
        negotiateDate: '预计交单日期',
        contractNo: '合同号',
        letterCreditNo: '信用证号',
        contractCode: '销售合同',
        currencyCode: '币种'
      },
      tab: {
        product: '交单商品信息'
      },
      popup: {
        editForm: '编辑',
        productTab: '编辑',
        list: '一览'
      },
      group: {
        editFormPart2: '信用证信息',
        editFormPart1: '交单信息'
      },
      list: {
        auditStatus: '审批状态',
        productKeyAttr02: '属性2',
        productKeyAttr01: '属性1',
        productKeyAttr03: '属性3',
        contractNo: '销售合同',
        outQuantity: '出库数量',
        origin: '产地',
        negotiateAmount: '交单金额',
        bizEmployeeCode: '业务员',
        measurementQuantity: '出库计量数量',
        productName: '商品',
        spec: '规格',
        outBillNo: '出库单号',
        brand: '品牌',
        outDate: '出库日期',
        amount: '交单金额',
        productUnitCode: '单位',
        bizEmployeeName: '业务员',
        measurementUnitCode: '计量单位',
        negotiateNo: '申请单号',
        lcNo: '信用证编号',
        negotiateBankName: '交单行',
        customerName: '客户',
        itemCount: '出库件数',
        currencyCode: '币种',
        effectiveDate: '生效日期'
      }
    },
    // 库存调出
    transferOut: {
      form: {
        transferOutBillNo: '单据号',
        transferOutDate: '调出日期',
        outWarehouseCode: '调出仓库',
        inWarehouseCode: '调入仓库',
        outDeptCode: '调出部门',
        inDeptCode: '调入部门',
        stockDetailNo: '库存商品明细编号',
        productCode: '商品'
      },
      tab: {
        transferOutProduct: '调出商品信息'
      },
      popup: {
        list: '库存调出信息'
      },
      group: {
        editFormPart1: '库存调出信息'
      },
      list: {
        transferOutBillNo: '单据号',
        transferOutDate: '调出日期',
        outWarehouseCode: '调出仓库',
        inWarehouseCode: '调入仓库',
        outWarehouseName: '调出仓库',
        inWarehouseName: '调入仓库',
        outDeptCode: '调出部门',
        inDeptCode: '调入部门',
        outDeptName: '调出部门',
        inDeptName: '调入部门',
        stockDetailNo: '库存商品明细编号',
        contractNo: '采购合同号',
        lotNo: '采购批次号',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号',
        supplierCode: '供应商',
        supplierName: '供应商',
        deliverCode: '发货单位',
        deliverName: '发货单位',
        productCode: '商品',
        productName: '商品',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '调拨件数',
        transferQuantity: '调拨重量',
        transferOutQuantity: '调拨出库重量',
        transferOutMeasurementQty: '调拨出库计量数量',
        transferInQuantity: '调拨入库重量',
        transferInMeasurementQty: '调拨入库计量数量',
        transferLeftQuantity: '未调拨入库重量',
        transferLeftMeasurementQty: '未调拨入库计量数量',
        productUnitCode: '单位',
        measurementUnitCode: '计量单位'
      }
    },
    // 库存调入
    transferIn: {
      form: {
        transferInBillNo: '单据号',
        transferInDate: '调入日期',
        transferOutBillNo: '库存调出单号',
        outWarehouseCode: '调出仓库',
        inWarehouseCode: '调入仓库',
        outDeptCode: '调出部门',
        inDeptCode: '调入部门'
      },
      tab: {
        transferInProduct: '调入商品信息'
      },
      popup: {
        list: '库存调入信息'
      },
      group: {
        editFormPart1: '库存调入信息'
      },
      list: {
        transferInBillNo: '单据号',
        transferInDate: '调入日期',
        transferOutBillNo: '库存调出单号',
        outWarehouseCode: '调出仓库',
        inWarehouseCode: '调入仓库',
        outWarehouseName: '调出仓库',
        inWarehouseName: '调入仓库',
        outDeptCode: '调出部门',
        inDeptCode: '调入部门',
        outDeptName: '调出部门',
        inDeptName: '调入部门',
        transferOutProductNo: '库存调出商品编号',
        stockDetailNo: '库存商品明细编号',
        contractNo: '采购合同号',
        lotNo: '采购批次号',
        inBillNo: '原入库单号',
        inProductNo: '原入库商品编号',
        inDetailNo: '原入库商品明细编号',
        supplierCode: '供应商',
        supplierName: '供应商',
        deliverCode: '发货单位',
        deliverName: '发货单位',
        productCode: '商品',
        productName: '商品',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '调拨件数',
        transferInQuantity: '调拨入库重量',
        transferInMeasurementQty: '调拨入库计量数量',
        productUnitCode: '单位',
        measurementUnitCode: '计量单位'
      }
    },
    // 采购退货
    inReturn: {
      dialog: {
        title: '采购退换货单'
      },
      form: {
        inReturnNo: '单据号',
        inReturnDate: '采购退货日期',
        returnType: '退换货类型',
        returnType1: '退货',
        returnType2: '换货',
        warehouseCode: '仓库',
        supplierCode: '供应商',
        supplierName: '供应商',
        deliverCode: '发货单位',
        deliverName: '发货单位',
        stockDetailNo: '库存商品明细编号',
        productCode: '商品'
      },
      tab: {
        inReturnProduct: '退换货商品',
        cost: '费用'
      },
      popup: {},
      group: {
        editFormPart1: '采购退货信息'
      },
      list: {
        inReturnNo: '退换货单号',
        inReturnDate: '采购退货日期',
        returnType: '退换货类型',
        warehouseCode: '仓库',
        warehouseName: '仓库',
        supplierCode: '供应商',
        supplierName: '供应商',
        deliverCode: '发货单位',
        deliverName: '发货单位',
        inBillNo: '入库单号',
        inProductNo: '原入库商品编号',
        inDetailNo: '原入库商品明细编号',
        stockDetailNo: '库存商品明细编号',
        lotProductDetailCode: '批次商品明细编码',
        preBillProductDetailCode: '前置单据商品明细编码',
        productCode: '商品',
        productName: '商品',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '退换货件数',
        outQuantity: '退换货重量',
        productUnitCode: '商品单位',
        measurementQuantity: '退换货计量数量',
        measurementUnitCode: '计量单位'
      }
    },
    // 销售退货
    outReturn: {
      validateMsg: {
        outNoticeNoDifferent: '必须选择单据号及客户相同的退换货数据。',
        inNoticeNoDifferent: '必须选择单据号及客户相同的退换货数据。'
      },
      dialog: {
        title: '销售退换货单'
      },
      form: {
        outReturnNo: '退换货单号',
        outReturnDate: '销售退货日期',
        returnType: '退换货类型',
        warehouseCode: '退入仓库',
        customerCode: '客户',
        customerName: '客户',
        outBillNo: '原出库单号',
        productCode: '商品'
      },
      tab: {
        outReturnProduct: '退换货商品',
        cost: '费用'
      },
      popup: {},
      group: {
        editFormPart1: '销售退货信息'
      },
      list: {
        outReturnNo: '单据号',
        outReturnDate: '销售退货日期',
        returnType: '退换货类型',
        warehouseCode: '退入仓库',
        warehouseName: '退入仓库',
        customerCode: '客户',
        customerName: '客户',
        outBillNo: '出库单号',
        outProductNo: '原出库商品编号',
        lotProductDetailCode: '批次商品明细编码',
        preBillProductDetailCode: '前置单据商品明细编码',
        inBillNo: '原入库单号',
        purchaseContractNo: '采购合同号',
        purchaseLotNo: '采购批次号',
        supplierName: '供应商',
        productCode: '商品',
        productName: '商品',
        itemCount: '退换货件数',
        inQuantity: '退换货重量',
        productUnitCode: '商品单位',
        measurementQuantity: '退换货计量数量',
        measurementUnitCode: '计量单位'
      }
    },
    // 盘盈亏
    profitAndLoss: {
      form: {
        pnlNo: '单据号',
        pnlDate: '盘盈亏日期',
        warehouseCode: '仓库',
        stockDetailNo: '库存商品明细编号',
        supplierCode: '供应商',
        supplierName: '供应商',
        productCode: '商品',
        pnlType: '盘盈亏类型'
      },
      tab: {
        pnlProduct: '盘盈亏商品信息'
      },
      popup: {},
      group: {
        editFormPart1: '盘盈亏信息'
      },
      list: {
        pnlNo: '单据号',
        pnlDate: '盘盈亏日期',
        warehouseCode: '仓库',
        warehouseName: '仓库',
        inBillNo: '入库单号',
        inProductNo: '入库商品编号',
        inDetailNo: '入库商品明细编号',
        stockDetailNo: '库存商品明细编号',
        supplierCode: '供应商',
        supplierName: '供应商',
        deliverCode: '发货单位',
        deliverName: '发货单位',
        lotProductDetailCode: '批次商品明细编码',
        preBillProductDetailCode: '前置单据商品明细编码',
        productCode: '商品',
        productName: '商品',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        pnlType: '盘盈亏类型',
        itemCount: '盘盈亏件数',
        pnlQuantity: '盘盈亏重量',
        productUnitCode: '商品单位',
        measurementQuantity: '盘盈亏计量数量',
        measurementUnitCode: '计量单位'
      }
    },
    stock: {
      popup: {
        stockSelect: '库存明细选择'
      },
      form: {
        productCodeList: '商品',
        warehouseCode: '仓库',
        supplierCode: '供应商',
        inDate: '入库日期',
        inBillNo: '入库单号',
        inCheckDate: '验收日期',
        deliverCode: '发货单位',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号',
        bizEmployeeCode: '业务员',
        contractNos: '合同号'
      },
      list: {
        inContractNo: '合同号',
        inLotNo: '批次号',
        stockDetailNo: '库存商品明细编号',
        warehouseName: '仓库',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        supplierName: '供应商',
        deliverName: '发货单位',
        inDate: '入库日期',
        inCheckDate: '验收日期',
        preBillType: '前置单据类型',
        preBillNo: '前置单据号',
        inBillNo: '入库单号',
        stockArea: '库区',
        stockPosition: '库位',
        stockNo: '仓储号',
        itemCount: '入库件数',
        quantity: '库存重量',
        actualQuantity: '验收数量',
        lockQuantity: '锁库重量',
        restQuantity: '可卖重量',
        productUnitCode: '商品单位',
        measurementQuantity: '库存计量数量',
        actualMeasurementQuantity: '验收计量数量',
        lockMeasurementQuantity: '锁库计量数量',
        restMeasurementQuantity: '可卖计量数量',
        measurementUnitCode: '计量单位'
      }
    },
    ladingBillSelect: {
      popup: {
        title: '提单商品选择'
      },
      msg: {
        noPostData: '所选数据无法进行提单登记'
      },
      form: {
        productCodeList: '商品',
        ladingBillNo: '提单号',
        ladingDate: '提单日期',
        ladingType: '提单类型',
        supplierCode: '供应商',
        preBIllNo: '前置单据编号',
        bizEmployeeCode: '业务员'
      },
      list: {
        contractNo: '采购合同号',
        lotNo: '采购批次号',
        ladingBillNo: '提单号',
        ladingDate: '提单日期',
        supplierName: '供应商',
        deliverName: '发货单位',
        productCode: '商品',
        productName: '商品',
        rightFlag: '货权转移',
        brand: '品牌',
        origin: '产地',
        spec: '规格',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '件数',
        restMeasurementQuantity: '可卖计量数量',
        measurementUnitCode: '计量单位',
        restQuantity: '可卖货物重量',
        productUnitCode: '货物单位',
        bizEmployeeName: '业务员'
      }
    },
    ladingBillOutSelect: {
      popup: {
        title: '提单直发商品选择'
      },
      form: {
        productCode: '商品',
        ladingOutNo: '提单直发编号',
        ladingOutDate: '直发日期',
        ladingOutType: '直发类型',
        customerCode: '客户',
        preBIllNo: '前置单据编号',
        bizEmployeeCode: '业务员'
      },
      list: {
        ladingOutNo: '提单直发编号',
        ladingOutDate: '直发日期',
        ladingOutType: '直发类型',
        preBillNo: '前置单据编号',
        preBIllType: '前置单据类型',
        customerName: '客户',
        productName: '商品',
        brand: '品牌',
        origin: '产地',
        spec: '规格',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        rightFlag: '货权转移',
        itemCount: '件数',
        measurementQuantity: '直发计量数量',
        actualMeasurementQuantity: '确认计量数量',
        lastMeasurementQuantity: '剩余确认计量数量',
        measurementUnitCode: '计量单位',
        outQuantity: '直发重量',
        actualQuantity: '确认重量',
        lastQuantity: '剩余确认重量',
        productUnitCode: '货物单位',
        bizEmployeeName: '业务员'
      }
    },
    warehouseMoneyReport: {
      popup: {
        title: '仓库限额明细报表'
      },
      form: {
        warehouseCompany: '仓储公司'
      },
      list: {
        warehouseCompany: '仓储公司',
        goodsValueLimit: '货值限额',
        warehouseCompanyValue: '仓储公司货值'
      }
    },
    warehouseWeightReport: {
      popup: {
        title: '仓库货量明细报表'
      },
      form: {
        warehouse: '仓库名称',
        variety: '品种'
      },
      list: {
        warehouse: '仓库名称',
        variety: '品种',
        goodsAmountLimit: '货量限量',
        warehouseCompanyAmount: '仓库货量'
      }
    },
    warehouseGoodsAgeReport: {
      popup: {
        title: '库龄监控报表'
      },
      form: {
        warehouse: '仓库名称',
        productCode: '商品',
        supplierCode: '供应商',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员',
        inDate: '入库日期',
        goodsDay: '库龄天数'
      },
      list: {
        warehouse: '仓库名称',
        productName: '商品名称',
        contractNo: '合同号',
        supplierName: '供应商',
        bizDeptName: '业务部门',
        bizEmployeeName: '签订人',
        inBillNo: '入库单号',
        inDate: '入库日期',
        restMeasurementQuantity: '库存数量',
        goodsDay: '库龄',
        goodsCost: '库存成本'
      }
    },
    stockDetailInfoReport: {
      popup: {
        title: '库存明细报表'
      },
      form: {
        warehouse: '仓库名称',
        productCode: '商品',
        spec: '规格',
        supplierCode: '供应商',
        inDate: '入库日期',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员'
      },
      list: {
        warehouse: '仓库名称',
        productName: '商品名称',
        contractNo: '合同号',
        supplierName: '供应商',
        inBillNo: '入库单号',
        inDate: '入库日期',
        measurementQuantity: '入库计量数量',
        quantity: '入库货物重量',
        outMeasurementQuantity: '出库计量数量',
        outQuantity: '出库货物数量',
        lockMeasurementQuantity: '锁定计量数量',
        lockQuantity: '锁定货物重量',
        restMeasurementQuantity: '可卖计量数量',
        restQuantity: '可卖货物数量',
        measurementUnitName: '计量数量单位',
        productUnitName: '重量单位',
        billAllPrice: '库存成本',
        bizDeptName: '业务部门',
        bizEmployeeName: '签订人'
      }
    },
    stockAccountInfoReport: {
      popup: {
        title: '库存台账报表'
      },
      form: {
        warehouse: '仓库名称',
        productCode: '商品',
        customerName: '客商',
        billDate: '单据日期',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员'
      },
      list: {
        billNo: '单据号',
        billType: '单据类型',
        billDate: '单据日期',
        customerName: '客商名称',
        warehouse: '仓库名称',
        productName: '商品名称',
        contractNo: '合同号',
        supplierName: '供应商',
        inBillNo: '入库单号',
        inDate: '入库日期',
        measurementQuantity: '计量数量',
        quantity: '货物重量',
        lockMeasurementQuantity: '锁定计量数量',
        lockQuantity: '锁定货物重量',
        restMeasurementQuantity: '可卖计量数量',
        restQuantity: '可卖货物重量',
        outMeasurementQuantity: '出库计量数量',
        outQuantity: '出库重量',
        measurementUnitName: '计量数量单位',
        productUnitName: '重量单位',
        unitPrice: '含税单价',
        unitFee: '含税费用单价',
        billPrice: '入库含税金额',
        billFee: '入库含税费用金额',
        outPrice: '出库含税金额',
        outFee: '出库含税费用金额',
        taxRate: '税率',
        billAllPrice: '库存含税成本',
        outAllPrice: '出库含税金额',
        bizDeptName: '业务部门',
        bizEmployeeName: '签订人'
      }
    },
    stockSalesGrossInfoReport: {
      popup: {
        title: '销售利润明细表'
      },
      form: {
        contractNo: '合同号',
        billNo: '单据号',
        warehouse: '仓库名称',
        productCode: '商品',
        customerName: '客商',
        billDate: '单据日期',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员'
      },
      list: {
        billNo: '单据号',
        billType: '单据类型',
        billDate: '单据日期',
        customerName: '客商名称',
        warehouse: '仓库名称',
        productName: '商品名称',
        contractNo: '合同号',
        lotNo: '批次号',
        itemCount: '件数',
        outQuantity: '出库数量',
        actualQuantity: '实提数量',
        productUnitName: '单位',
        outMeasurementQuantity: '出库计量数量',
        actualMeasurementQuantity: '实提计量数量',
        settlementQuantity: '结算数量',
        measurementUnitName: '计量单位',
        unitPrice: '销售单价',
        outPrice: '销售金额',
        unitFee: '销售费用单价',
        outFee: '销售费用金额',
        inUnitPrice: '进货单价',
        inPrice: '进货金额',
        inUnitFee: '进货费用单价',
        inFee: '进货费用金额',
        unitDifference: '单价差',
        salesGross: '毛利',
        goodsFlag: '货齐状态',
        settlementStatus: '结算状态',
        bizDeptName: '业务部门',
        bizEmployeeName: '签订人'
      }
    },
    stockTransitInfoReport: {
      popup: {
        title: '在途库存报表'
      },
      form: {
        billNo: '单据号',
        warehouse: '仓库名称',
        productCode: '商品',
        spec: '规格',
        supplierCode: '供应商',
        billDate: '在途日期',
        bizDeptCode: '业务部门',
        bizEmployeeCode: '业务员'
      },
      list: {
        contractNo: '合同号',
        lotNo: '批次号',
        billNo: '单据号',
        billDate: '单据日期',
        bilType: '单据类型',
        supplierName: '供应商',
        warehouse: '仓库名称',
        productName: '商品名称',
        measurementQuantity: '预定计量数量',
        quantity: '预定货物重量',
        lockMeasurementQuantity: '已到计量数量',
        lockQuantity: '已到货物重量',
        restMeasurementQuantity: '在途计量数量',
        restQuantity: '在途货物数量',
        measurementUnitName: '计量数量单位',
        productUnitName: '重量单位',
        bizDeptName: '业务部门',
        bizEmployeeName: '签订人'
      }
    },
    cost: {
      validateMsg: {
        needChooseProduct: '请选择一条商品信息'
      },
      list: {
        productName: '商品名称',
        settlementCode: '结算单位',
        feeDirection: '费用方向',
        feeCode: '费用名称',
        feeOccurs: '费用环节',
        quantity: '数量',
        includeTaxPrice: '含税单价',
        includeTaxAmount: '含税金额',
        excludeTaxPrice: '无税单价',
        excludeTaxAmount: '无税金额',
        currencyCode: '币种',
        taxRate: '税率(%)',
        taxAmount: '税额',
        costFlag: '进成本',
        intercourseFlag: '进往来'
      }
    },
    registBill: {
      form: {
        productCode: '商品',
        futuresExchangeCode: '期货交易所',
        warehouseCode: '仓库',
        bizEmployeeCode: '业务员',
        registNo: '注册单号',
        registDate: '注册日期'
      },
      list: {
        auditStatus: '审核状态',
        registNo: '注册单号',
        registDate: '注册日期',
        futuresExchangeName: '期货交易所',
        warehouseName: '仓库',
        inBillNo: '入库单号',
        lotNo: '批次号',
        supplierName: '供应商',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '注册件数',
        registQuantity: '注册数量',
        productUnitCode: '单位',
        registMeasurementQuantity: '注册计量数量',
        measurementUnitCode: '计量单位',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        supplierCode: '供应商',
        inQuantity: '注册数量',
        measurementQuantity: '注册计量数量'
      },
      tab: {
        product: '注册商品信息'
      },
      msg: {
        warehouseCodeEmpty: '请选择仓库',
        porductCodeEmpty: '请选择商品'
      }
    },
    unregistBill: {
      form: {
        productCode: '商品',
        warehouseCode: '仓库',
        bizEmployeeCode: '业务员',
        unregistNo: '解现单号',
        unregistDate: '解现日期',
        registNo: '注册单号'
      },
      list: {
        auditStatus: '审核状态',
        unregistNo: '解现单号',
        unregistDate: '解现日期',
        warehouseName: '仓库',
        inBillNo: '入库单号',
        lotNo: '批次号',
        supplierName: '供应商',
        productName: '商品',
        brand: '品牌',
        spec: '规格',
        origin: '产地',
        productKeyAttr01: '属性1',
        productKeyAttr02: '属性2',
        productKeyAttr03: '属性3',
        itemCount: '注册件数',
        unregistQuantity: '解现数量',
        productUnitCode: '单位',
        unregistMeasurementQuantity: '解现计量数量',
        measurementUnitCode: '计量单位',
        bizEmployeeName: '业务员',
        optEmployeeName: '制单人',
        supplierCode: '供应商',
        inQuantity: '注册数量',
        measurementQuantity: '注册计量数量',
        registNo: '注册单号'
      },
      tab: {
        product: '解现商品信息'
      },
      msg: {
        warehouseCodeEmpty: '请选择仓库',
        porductCodeEmpty: '请选择商品'
      }
    }
  }
}
