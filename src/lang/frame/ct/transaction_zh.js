export default {
  transaction: {
    transactionDetail: {
      form: {
        transactionDetailType: '往来明细类型',
        transactionAccountType: '往来账目类型',
        transactionDate: '往来日期',
        billNo: '单据号',
        billType: '单据类型',
        parentBillNo: '上游单据号',
        customerNo: '客户',
        customerName: '客户',
        contractNo: '合同号',
        lotNo: '批次号',
        productCode: '商品',
        currency: '币种'
      },
      tab: {},
      popup: {},
      group: {},
      list: {
        transactionDetailType: '往来明细类型',
        transactionAccountType: '往来账目类型',
        transactionDate: '往来日期',
        billNo: '单据号',
        billType: '单据类型',
        parentBillNo: '上游单据号',
        parentBillType: '上游单据类型',
        customerNo: '客户',
        customerName: '客户',
        settlementType: '结算方式',
        contractNo: '合同号',
        lotNo: '批次号',
        productCode: '商品',
        productName: '商品',
        transactionQuantity: '数量',
        transactionPrice: '单价',
        currency: '币种',
        payableAmount: '应付金额',
        paymentAmount: '实付金额',
        receivableAmount: '应收金额',
        receiveAmount: '实收金额',
        totalPayableAmount: '累计应付金额'
      }
    },
    transactionBalance: {
      form: {
        customerNo: '客户',
        customerName: '客户',
        transactionDate: '往来日期',
        zeroFlag: '余额为0显示标志',
        currency: '币种'
      },
      tab: {},
      popup: {},
      group: {},
      list: {
        customerNo: '客户',
        customerName: '客户',
        currency: '币种',
        beginPayableAmount: '期初应付金额',
        payableAmount: '应付金额',
        paymentAmount: '实付金额',
        receivableAmount: '应收金额',
        receiveAmount: '实收金额',
        totalPayableAmount: '累计应付金额'
      }
    },
    transactionBalanceInit: {
      form: {
        balanceInitNo: '单据号',
        balanceInitDate: '初始化日期',
        customerNo: '客户',
        customerName: '客户',
        transactionType: '往来类型',
        transactionDetailType: '往来明细类型',
        balanceInitAmount: '初始化金额',
        currency: '币种',
        generateFlag: '是否生成标志'
      },
      tab: {},
      popup: {
        edit: '往来余额初始化编辑',
        list: '往来余额初始化列表'
      },
      group: {
        editPart1: '往来余额初始化信息'
      },
      list: {
        balanceInitNo: '单据号',
        balanceInitDate: '初始化日期',
        customerNo: '客户',
        customerName: '客户',
        transactionType: '往来类型',
        transactionDetailType: '往来明细类型',
        balanceInitAmount: '初始化金额',
        currency: '币种',
        generateFlag: '是否生成标志'
      }
    }
  }
}
