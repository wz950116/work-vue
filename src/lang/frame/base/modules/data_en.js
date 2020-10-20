export default {
  data: {
    common: {
      notBlank: 'Must be input',
      load: 'loading...',
      pleaseSelect: 'Please choose',
      pleaseInput: 'Please input contents',
      info: 'information',
      detailInfo: 'detailed information',
      baseInfo: 'based information',
      mainInfo: 'Main information'
    },
    prefixAddress: {
      title: 'Title',
      customerName: 'CustomerName',
      transactionAddress: 'Transaction pre-address',
      marketAddress: 'Quote front address',
      usingFlag: 'status'
    },
    exchange: {
      title: 'Title',
      exchangeName: 'Exchange Name',
      exchangeAbbr: 'Exchange abbreviation ',
      exchangeCode: 'Exchange code',
      exchangeType: 'Exchange category',
      usingFlag: 'status'
    },
    derivativeAccount: {
      title: 'Title',
      customerId: 'Customer name',
      derivativeAccount: 'Derivatives account',
      derivativeTypes: 'Derivatives type',
      derivativeAccountType: 'Account type',
      organId: 'Affiliated institutions ',
      derivativeAccountCode: 'Account identification code',
      mainName: 'Subject name',
      onlineStat: 'Login status',
      wait: 'Please wait while you log in.',
      trusteeshipFlag: 'hosting',
      password: 'Password',
      authorizationCode: 'AuthorizationCode'
    },
    derivativeSubAccount: {
      title: 'Title',
      customerId: 'Customer name',
      projectId: 'Project',
      projectName: 'Project',
      usingFlag: 'Using flag',
      derivativeAccountId: 'Derivative account',
      derivativeSubAccount: 'Derivative sub-account',
      derivativeAccountCode: 'Account identification code',
      derivativeTypes: 'Derivatives type',
      derivativeAccountType: 'Account type',
      organId: 'Affiliated institutions',
      mainName: 'Subject name',
      onlineStat: 'Login status',
      trusteeshipFlag: 'hosting',
      remark: 'Remark'
    },
    productCategory: {
      form: {
        title: 'Product category abbreviation',
        productCategoryName: 'Product category name',
        productCategoryCode: 'Product category code',
        usingFlag: 'Status',
        status: 'Enabled',
        remark: 'Remark'
      },
      list: {
        parentName: 'Category parent',
        productCategoryName: 'Product category name',
        productCategoryAbbr: 'Product category abbreviation',
        productCategoryCode: 'Product category code',
        attrGroupId: 'Attribute group name',
        usingFlag: 'Status',
        remark: 'Remark'
      }
    },
    product: {
      form: {
        title: 'Commodity archives',
        productName: 'Product name',
        productCode: 'Product code',
        productCategoryId: 'Product categories',
        usingFlag: 'Status',
        status: 'Enabled',
        remark: 'Remark',
        mainInfo: 'mainInfo'
      },
      list: {
        productName: 'Product name',
        productCode: 'Product code',
        productCategoryId: 'Product categories',
        unit: 'Measurement unit',
        taxRate: 'Tax rate',
        usingFlag: 'Status',
        remark: 'Remark',
        market: 'Market'
      }
    },
    attrGroup: {
      form: {
        title: 'AttrGroup archives'
      },
      list: {
        attrGroupName: 'Attribute group name',
        attrs: 'Attributes'
      }
    },

    baseValuationmage: {
      form: {
        title: 'Valuation benchmarks',
        baseValuationName: 'Valuation base name',
        baseValuationProname: 'Commodity name',
        baseValuationPicname: 'Price name',
        state: 'Status'
      },
      list: {
        baseValuationCode: 'Valuation base coding',
        baseValuationName: 'Valuation base name',
        baseValuationProname: 'Commodity name',
        baseValuationPicname: 'Price name',
        conversion: 'Conversion coefficien',
        agio: 'Lifting water',
        state: 'Status'
      }
    },
    currency: {
      title: 'Currency file',
      currencyCode: 'Currency code',
      currencyName: 'Currency name',
      currencySymbol: 'Currency notes'
    },
    settlementMethod: {
      title: 'Archives of settlement method',
      settlementMethodCode: 'Settlement mode coding',
      settlementMethodName: 'Name of settlement method',
      remark: 'Remarks'
    },
    taxRate: {
      title: 'Tax rate file',
      taxRateCode: 'Tax rate coding',
      taxRateName: 'Name of tax',
      taxRate: 'tax rate',
      remark: 'describe'
    },
    unitGroup: {
      form: {
        title: 'Metering unit',
        editTitle: 'Unit of unit group details',
        unitGroupName: 'Name of unit group',
        unitGroupCode: 'Code of unit group  ',
        unitGroupType: 'Type',
        unitMain: 'Main unit of unit group',
        usingFlag: 'Status'
      },
      list: {
        unitGroupName: 'Name of unit group  ',
        unitGroupCode: 'Code of unit group  ',
        unitGroupType: 'Type',
        usingFlag: 'Status',
        remark: 'Remark',
        unit: 'Measurement unit',
        unitMain: 'Main unit of unit group',
        operator: 'Operator',
        conversionRate: 'Conversion rate'
      }
    },
    wareHouse: {
      title: 'WareHouse File',
      wareHouseName: 'WareHouse Name',
      wareHouseCode: 'WareHouse Code',
      companyIds: 'Company',
      regionIds: 'Region',
      address: 'Address',
      capacity: 'Capacity',
      availableCapacity: 'Available Capacity',
      unit: 'Unit',
      availableUnit: 'Available Unit',
      contacts: 'Contacts',
      tel: 'Telephone',
      fax: 'Fax',
      email: 'Email',
      usingFlag: 'Status',
      remark: 'Remark',
      market: 'Market'
    },
    port: {
      title: 'Port File',
      portName: 'Port Name',
      portCode: 'Port Code',
      regionIds: 'Region',
      usingFlag: 'Status',
      remark: 'Remark'
    },
    area: {
      title: 'Area File',
      parentIds: 'Parent Area',
      areaName: 'Area Name',
      areaShortName: 'Area Short Name',
      areaCode: 'Area Code',
      usingFlag: 'Status',
      remark: 'Remark'
    },
    benchMark: {
      title: 'Pricing Benchmark',
      benchMarkName: 'Bench Mark Name',
      benchMarkCode: 'Bench Mark Code',
      unit: 'Unit',
      currency: 'Currency',
      priceIds: 'Price Name',
      usingFlag: 'Status',
      remark: 'Remark'
    },
    market: {
      title: 'Market Management',
      marketName: 'Market Name',
      marketCode: 'Market Code',
      usingFlag: 'Status',
      remark: 'Remark',
      set: 'Benchmark Market Settings',
      benchMark: 'Benchmark Market'
    },
    projectFile: {
      title: 'Project File Management',
      projectFileName: 'project File Name',
      projectFileCode: 'project File Code',
      usingFlag: 'Status',
      remark: 'Remark'
    },
    typeFile: {
      title: 'Type File Management',
      typeFileName: 'Type File Name',
      typeFileCode: 'Type File Code',
      usingFlag: 'Status',
      remark: 'Remark'
    },
    // 代码生成
    generator: {
      tableName: 'Table Name',
      tableComments: 'Table Comments',
      createTime: 'Create Time'
    },
    optionVarieties: {
      title: 'Type Option Varieties',
      optionsType: 'Option Type',
      optionVarietiesCode: 'Option Code',
      optionVarietiesName: 'Option Name',
      dataAttr: 'data attr',
      usingFlag: 'status'
    },
    warnSource: {
      sourceInfo: 'Warning Source Info',
      sourceName: 'Warning Source Name',
      sourceCode: 'Warning Source Code',
      getColumn: 'Get Column Info',
      columnInfo: 'Column Info',
      colCode: 'Column Code',
      colName: 'Column Name',
      dataType: 'Data Type',
      excelName: 'Warning Source',
      notBlank: {
        sourceName: 'Warning Source Name can not be empty',
        sourceCode: 'Warning Source Code can not be empty',
        sql: 'SQL can not be empty'
      },
      maxLength: {
        sourceName: 'Length should be no more than 128',
        sourceCode: 'Length should be no more than 32',
        remark: 'Length should be no more than 500',
        sql: 'Length should be no more than 4000'
      }
    },
    warning: {
      warningInfo: 'Warning Info',
      warningName: 'Warning Name',
      warningCode: 'Warning Code',
      triggerType: 'Trigger Type',
      triggerTime: 'Trigger Time',
      usingFlag: 'Status',
      remark: 'Warning Desciption',
      excelName: 'Warning',
      warnSource: 'Warn Source',
      warningStaff: 'Receiver',
      msgTemplate: 'Message Template',
      warningCond: 'Warning Condition',
      conditionName: 'Condition',
      paramName: 'Param Name',
      paramSetting: 'Warning Param Setting',
      notBlank: {
        warningName: 'Warning Name can not be empty',
        usingFlag: 'Status can not be empty'
      },
      maxLength: {
        warningName: 'Length should be no more than 128',
        remark: 'Length should be no more than 500'
      }
    }
  }
}
