export default {
  quotation: {
    futuresPrice: {
      Title: 'Futures price management',
      dialogTitle: 'Futures price import preview',
      exchangeId: 'Exchange',
      exchangeName: 'Exchange',
      varietiesId: 'variety',
      futuresVarietiesName: 'variety',
      futuresContractId: 'contract code',
      futuresContractCode: 'contract code',
      futuresContractName: 'contract name',
      intradayPrice: 'intraday price',
      openPrice: 'opening price',
      closingPrice: 'closing price',
      highestPrice: 'highest price',
      lowestPrice: 'lowest price',
      settlementPrice: 'Settlement price',
      currencyId: 'currency',
      currencyName: 'currency',
      updateDate: 'update time',
      priceDate: 'price date',
      dataSources: 'data source',
      usingFlag: 'state',
      Result: 'check result',
      Msg: {
        checkFailed: 'The import data has an error and cannot be saved! '
      }
    },
    futuresPriceAdjust: {
      Title: 'Futures price adjustment order',
      mainInfo: 'future price adjustment single master information',
      adjustmentList: 'Adjust the single detail',
      dialogTitle: 'price selection',
      adjustDate: 'Adjust date',
      adjustDateBegin: 'Adjust date',
      adjustDateEnd: 'Adjust date',
      adjustType: 'adjust type',
      adjustNo: 'Adjust the order number',
      auditStat: 'Audit status',
      auditDate: 'audit date',
      auditDateBegin: 'audit date',
      makeUser: 'single person',
      staffName: 'single person',
      categoryId: 'Product Classification',
      listDetail: 'Adjust the single detail',
      Remark: 'Adjust the reason',
      priceDate: 'price date',
      exchangeId: 'Exchange',
      exchangeName: 'Exchange',
      varietiesId: 'variety',
      futuresVarietiesName: 'variety',
      futuresContractId: 'contract name',
      futuresContractName: 'contract name',
      futuresContractCode: 'contract code',
      openPriceOld: 'opening price (original)',
      openPrice: 'opening price',
      closingPriceOld: 'closing price (original)',
      closingPrice: 'closing price',
      highestPriceOld: 'highest price (original)',
      highestPrice: 'highest price',
      lowestPriceOld: 'lowest price (original)',
      lowestPrice: 'lowest price',
      settlementPriceOld: 'Settlement price (original)',
      settlementPrice: 'Settlement price',
      currencyName: 'currency',
      selectList: 'to be selected',
      detailList: 'selected',
      Currency: 'currency',
      Result: 'check result'
    }
  },
  spotQuotation: {
    spotPrice: {
      Title: 'Spot price management',
      editPriceEstimationDialogTitle: 'Budget result preview',
      editImportDialogTitle: 'Spot price import preview',
      categoryId: 'Product Classification',
      benchmarkType: 'whether the base price',
      productName: 'product name',
      priceName: 'price name',
      marketName: 'Market',
      taxPrice: 'tax-included price',
      noTaxPrice: 'Do not include tax price',
      currencyName: 'currency',
      priceDate: 'price date',
      usingFlag: 'state',
      Reason: 'check result',
      createDate: 'maintenance time',
      Content: 'content',
      Origin: 'origin',
      Brand: 'Brand'
    },
    spotPriceAdjust: {
      Title: 'Spot price adjustment order',
      mainInfo: 'Spot price adjustment single master information',
      adjustmentList: 'Adjust the single detail',
      detailTitle: 'Adjust single detail',
      dialogTitle: 'price selection',
      adjustDate: 'Adjust date',
      adjustType: 'adjust type',
      adjustNo: 'Adjust the order number',
      auditStat: 'Audit status',
      auditDate: 'audit date',
      auditDateBegin: 'audit date',
      makeUser: 'single person',
      staffName: 'single person',
      categoryId: 'Product Classification',
      Remark: 'Adjust the reason',
      priceDate: 'price date',
      priceName: 'price name',
      productName: 'product name',
      marketName: 'market name',
      taxPriceOld: 'tax-included price (original)',
      taxPrice: 'tax-included price',
      noTaxPriceOld: 'excluding tax price (original)',
      noTaxPrice: 'Do not include tax price',
      Currency: 'currency',
      currencyName: 'currency',
      selectList: 'to be selected',
      detailList: 'selected',
      Result: 'check result',
      Msg: {
        examineTypeCheck: 'The review can not be deleted! ',
        updateCheck: 'The review status is "Audit success", "Audit" adjustment order is not allowed to modify!'
      }
    },
    spotPriceSet: {
      Title: 'Material file',
      productName: 'product name',
      categoryId: 'Product Classification',
      attrName: 'origin',
      marketPriceRelationship: 'Market Price Relationship',
      marketPriceName: '',
      marketName: 'Market',
      categoryName: 'Product Classification',
      marketDiff: 'Market spread',
      materialPriceRelationship: 'Material Price Relationship',
      materialPriceName: '',
      attrInfo: 'property information',
      Attr: 'various attributes',
      materialDiff: 'Material spread',
      specificationPriceRelationship: 'Specification price relationship',
      specificationPriceName: '',
      Specification: 'Specification',
      specificationDiff: 'Specification spread',
      steelMillPriceRelationship: 'Steel mill price relationship',
      steelMillPriceName: '',
      steelMillName: 'Shougang',
      steelMill: 'Steel mill',
      steelMillDiff: 'Steel spread',
      priceName: 'price name',
      currencyName: 'currency',
      productType: 'type',
      usingFlag: 'state',
      selectList: 'property information',
      Content: 'content',
      Origin: 'origin',
      Brand: 'brand',
      brandNo: 'brand',
      standardId: 'corresponding standard',
      Formula: 'price formula',
      standardPrice: 'standard price',
      Msg: {
        sameCheck: 'The combination of market and attribute values ​​cannot be repeated! ',
        usedCheck: 'The spot base setting has been referenced in the XX module and cannot be deleted, please check. '
      }
    }
  }
}
