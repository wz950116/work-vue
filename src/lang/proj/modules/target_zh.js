export default {
  target: {
    futuresProfitTarget: {
      organCode: '机构',
      startDate: '控制期始',
      endDate: '控制期止',
      closeProfitLoss: '平仓损失限额',
      profitlossLoss: '持仓损失限额',
      lossSum: '损失限额合计',
      profit: '预期盈利',
      optEmployeeName: '制单人',
      remark: '备注',
      warningName: '关联预警'
    },
    futuresRiskdegree: {
      custCode: '期货公司',
      derivativeAccount: '期货账号',
      organCode: '所属机构',
      derivativeCategory: '账户类别',
      riskDegree: '风险度阈值(%)',
      riskDegreeNow: '当前风险度(%)',
      optEmployeeName: '制单人',
      remark: '备注',
      warningName: '关联预警'
    },
    targetPrice: {
      name: '监控指标名称',
      type: '类型',
      priceItemCode: '价格项',
      vsPriceItemCode: 'vs价格项',
      minValue: '最小目标值',
      maxValue: '最大目标值',
      organCode: '所属机构',
      remark: '备注',
      optEmployeeName: '制单人',
      startDate: '控制期始',
      endDate: '控制期止',
      warningName: '关联预警',
      tabName: '指标设置',
      msg: {
        detailListEmpty: '指标设置为空，无法保存',
        priceItemNoData: '价格项',
        vsPriceItemNoData: 'vs价格项不能为空',
        minNoData: '最小目标值不能为空',
        maxNoData: '最大目标值不能为空'
      }
    },
    futuresAccountPosition: {
      targetName: '预警名称',
      organCode: '所属机构',
      custCode: '期货公司',
      derivativeAccount: '期货账号',
      startDate: '控制期始',
      endDate: '控制期止',
      optEmployeeName: '制单人',
      remark: '备注',
      itemClass: '类型',
      futuresVarieties: '衍生品品种',
      direction: '方向',
      maxLots: '最大持仓手数',
      maxQuantity: '最大持仓量',
      tabName: '指标设置',
      warningName: '关联预警',
      msg: {
        detailListEmpty: '指标设置为空，无法保存',
        futuresVarietiesCodeNoData: '衍生品信息不能为空',
        directionNoData: '方向不能为空',
        lotsNoData: '最大持仓手数不能为空'
      }
    },
    futuresContractPosition: {
      targetName: '预警名称',
      organCode: '所属机构',
      itemClass: '类型',
      futuresVarietiesCode: '衍生品品种',
      startDate: '控制期始',
      endDate: '控制期止',
      optEmployeeName: '制单人',
      remark: '备注',
      tabName: '指标设置',
      futuresContract: '期货合约',
      direction: '方向',
      maxLots: '最大持仓手数',
      maxQuantity: '最大持仓量',
      warningName: '关联预警',
      msg: {
        detailListEmpty: '指标设置为空，无法保存',
        contractNoData: '合约信息不能为空',
        directionNoData: '方向不能为空',
        lotsNoData: '最大持仓手数不能为空'
      }
    },
    futuresProductProfit: {
      targetName: '预警名称',
      organCode: '机构名称',
      startDate: '控制期始',
      endDate: '控制期止',
      optEmployeeName: '制单人',
      remark: '备注',
      tabName: '指标设置',
      itemClass: '类型',
      futuresVarietiesCode: '衍生品品种',
      closeProfitLoss: '平仓损失限额（元）',
      positionLoss: '持仓损失限额（元）',
      totalLoss: '损失限额合计（元）',
      profit: '预期盈利（元）',
      warningName: '关联预警',
      msg: {
        futuresVarietiesCodeNoData: '指标设置为空，无法保存',
        totalLossNoData: '损失盈亏合计不能为空',
        profitNoData: '预计盈利不能为空'
      }
    }
  }
}
