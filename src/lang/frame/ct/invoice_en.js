export default {
  invoice: {
    statisticalReport: {
      form: {
        title: 'General ledger receivable',
        organization: 'organization',
        customer: 'customer',
        period: 'period'
      },
      list: {
        period: 'period',
        abstract: 'abstract',
        periodOfAccepted: 'This period should be accepted',
        currentReceipts: 'Current receipts',
        balance: 'balance'
      },
      receivableDetail: {
        form: {
          title: 'Detailed account receivable',
          organization: 'organization',
          customer: 'customer',
          date: 'date'
        },
        list: {
          customer: 'customer',
          date: 'date',
          abstract: 'abstract',
          businessType: 'businessType',
          moneyType: 'moneyType',
          billNo: 'billNo',
          currencyType: 'currencyType',
          periodOfAccepted: 'This period should be accepted',
          currentReceipts: 'Current receipts',
          balance: 'balance'
        }
      }
    }
  }
}
