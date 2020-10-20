<template>
  <qm-table ref="qmTable" :mainData="mainData"></qm-table>
</template>

<script>
// 提醒
export default {
  name: 'fundManage',
  components: {},
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            preliminaryFlag: '1',
            auditStatus: '3'
          },
          defaultSortString: 'documentDate.desc'
        }
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/spot/fund/list'
        },
        isColset: true,
        isTopBar: true,
        table: {
          id: 'fundManage',
          cols: [
            {
              width: '80',
              prop: 'auditStatus',
              label: 'spotProj.fund.list.documentStat',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'organName',
              label: 'spotProj.fund.list.organName',
              width: '100'
            },
            {
              prop: 'deptName',
              label: 'spotProj.fund.list.deptName',
              width: '100'
            },
            {
              prop: 'documentNo',
              label: 'spotProj.fund.list.documentNo',
              width: '120'
            },
            {
              prop: 'documentDate',
              label: 'spotProj.fund.list.documentDate',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'purchaseSaleType',
              align: 'center',
              width: '80',
              label: 'spotProj.fund.list.purchaseSaleType',
              format: {
                dict: this.$t('datadict.spotDirection')
              }
            },
            {
              prop: 'customerName',
              width: '100',
              label: 'spotProj.fund.list.supplierName'
            },
            {
              prop: 'originalCurrencyName',
              width: '100',
              label: 'spotProj.fund.list.originalCurrencyName'
            },
            {
              prop: 'originalCurrencyAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.fund.list.originalCurrencyAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'exchangeRate',
              align: 'right',
              width: '100',
              label: 'spotProj.fund.list.exchangeRate'
            },
            {
              prop: 'domesticCurrencyAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.fund.list.domesticCurrencyAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'matchAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.fund.list.matchAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'unmatchAmt',
              align: 'right',
              width: '100',
              label: 'spotProj.fund.list.unmatchAmt',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'preliminaryFlag',
              width: '80',
              label: 'spotProj.fund.list.preliminaryFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'remark',
              width: '160',
              label: 'spotProj.fund.list.remark'
            },
            {
              prop: 'makeUserName',
              width: '100',
              label: 'spotProj.fund.list.makeUserName'
            },
            {
              prop: 'makeDt',
              label: 'spotProj.fund.list.makeDt',
              align: 'center',
              width: '160'
            }
          ]
        },

        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>
