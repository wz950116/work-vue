export default {
  acceptance: {
    // 签发承兑汇票
    acceptanceSign: {
      form: {
        signNo: '单据号',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '供应商',
        customerName: '供应商',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        signSecurityDeposit: '签发保证金',
        signServiceFee: '签发手续费',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号',
        useFlag: '是否使用',
        acceptFlag: '是否承兑'
      },
      tab: {},
      popup: {
        edit: '签发承兑汇票编辑',
        list: '签发承兑汇票列表'
      },
      group: {
        editPart1: '签发承兑汇票信息'
      },
      btn: {
        acceptanceAccept: '承兑汇票承兑'
      },
      msg: {
        acceptanceAccept: '只有审批状态为已通过并且承兑标志为否的单据才能承兑汇票承兑'
      },
      list: {
        signNo: '单据号',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '供应商',
        customerName: '供应商',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        signSecurityDeposit: '签发保证金',
        signServiceFee: '签发手续费',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号',
        useFlag: '是否使用',
        acceptFlag: '是否承兑'
      }
    },
    // 外收承兑汇票
    acceptanceReceive: {
      form: {
        receiveNo: '单据号',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '客户',
        customerName: '客户',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        useFlag: '是否使用',
        acceptanceStatus: '状态'
      },
      tab: {},
      popup: {
        edit: '外收承兑汇票编辑',
        list: '外收承兑汇票列表'
      },
      group: {
        editPart1: '外收承兑汇票信息'
      },
      btn: {
        acceptanceDiscount: '承兑汇票贴现',
        acceptanceAccept: '承兑汇票承兑'
      },
      msg: {
        acceptanceDiscount: '只有审批状态为已通过并且使用标志为否的单据才能承兑汇票贴现',
        acceptanceAccept: '只有审批状态为已通过并且使用标志为否的单据才能承兑汇票承兑'
      },
      list: {
        receiveNo: '单据号',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '客户',
        customerName: '客户',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        useFlag: '是否使用',
        acceptanceStatus: '状态'
      }
    },
    // 承兑汇票视图
    viewAcceptanceInfo: {
      form: {
        infoNo: '单据号',
        acceptanceDirection: '票据方向',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '客户',
        customerName: '客户',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        useFlag: '是否使用',
        acceptanceStatus: '状态'
      },
      tab: {},
      popup: {
        edit: '承兑汇票编辑',
        list: '承兑汇票列表'
      },
      group: {
        editPart1: '承兑汇票信息'
      },
      list: {
        infoNo: '单据号',
        acceptanceDirection: '票据方向',
        acceptanceNo: '票据号',
        acceptanceDate: '出票日期',
        customerNo: '客户',
        customerName: '客户',
        acceptanceAmount: '票面金额',
        currency: '币种',
        dueDate: '到期日',
        acceptanceBank: '承兑行',
        useFlag: '是否使用',
        acceptanceStatus: '状态'
      }
    },
    // 承兑汇票贴现
    acceptanceDiscount: {
      form: {
        discountNo: '单据号',
        discountDate: '贴现日期',
        acceptanceBillNo: '承兑汇票单据号',
        acceptanceNo: '承兑票据号',
        acceptanceAmount: '票面金额',
        dueDate: '到期日',
        discountBank: '贴现行',
        discountRate: '贴现利率',
        discountDays: '贴现天数',
        discountInterest: '贴现利息',
        discountServiceFee: '贴现手续费',
        discountAmount: '实际贴现金额',
        currency: '币种',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号'
      },
      tab: {},
      popup: {
        edit: '承兑汇票贴现编辑',
        list: '承兑汇票贴现列表'
      },
      group: {
        editPart1: '承兑汇票贴现信息'
      },
      list: {
        discountNo: '单据号',
        discountDate: '贴现日期',
        acceptanceBillNo: '承兑汇票单据号',
        acceptanceNo: '承兑票据号',
        acceptanceAmount: '票面金额',
        dueDate: '到期日',
        discountBank: '贴现行',
        discountRate: '贴现利率',
        discountDays: '贴现天数',
        discountInterest: '贴现利息',
        discountServiceFee: '贴现手续费',
        discountAmount: '实际贴现金额',
        currency: '币种',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号'
      }
    },
    // 承兑汇票承兑
    acceptanceAccept: {
      form: {
        acceptNo: '单据号',
        acceptDate: '承兑日期',
        acceptanceBillNo: '承兑汇票单据号',
        acceptanceNo: '承兑票据号',
        acceptanceAmount: '票面金额',
        acceptanceBank: '承兑行',
        acceptInterest: '承兑利息',
        acceptServiceFee: '承兑手续费',
        acceptAmount: '实际承兑金额',
        currency: '币种',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号'
      },
      tab: {},
      popup: {
        edit: '承兑汇票承兑编辑',
        list: '承兑汇票承兑列表'
      },
      group: {
        editPart1: '承兑汇票承兑信息'
      },
      list: {
        acceptNo: '单据号',
        acceptDate: '承兑日期',
        acceptanceBillNo: '承兑汇票单据号',
        acceptanceNo: '承兑票据号',
        acceptanceAmount: '票面金额',
        acceptanceBank: '承兑行',
        acceptInterest: '承兑利息',
        acceptServiceFee: '承兑手续费',
        acceptAmount: '实际承兑金额',
        currency: '币种',
        bankCode: '银行',
        bankName: '银行',
        bankAccountCode: '账号'
      }
    }
  }
}
