<template>
  <qm-table ref="qmTable" :mainData="mainData"></qm-table>
</template>

<script>
// 提醒
export default {
  name: 'spotExposure',
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
            confirmStat: '1'
          },
          defaultSortString: 'tradeDate.desc'
        }
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/spot/strgExposure/list'
        },
        isTopBar: true,
        isColset: true,
        table: {
          id: 'spotExopsure',
          cols: [
            {
              prop: 'tradeDate',
              label: 'spotProj.exposure.list.tradeDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'exposureType',
              label: 'spotProj.exposure.list.exposureType',
              format: {
                dict: this.$t('datadict.exposureType')
              },
              align: 'center',
              width: '100'
            },
            {
              prop: 'contractNo',
              width: '120',
              label: 'spotProj.exposure.list.contractNo'
            },
            {
              prop: 'documentNo',
              width: '120',
              label: 'spotProj.exposure.list.documentNo'
            },
            {
              prop: 'direction',
              align: 'center',
              width: '80',
              label: 'spotProj.exposure.list.direction',
              format: {
                dict: this.$t('datadict.spotDirection')
              }
            },
            {
              prop: 'organName',
              width: '100',
              label: 'spotProj.exposure.list.organName'
            },
            {
              prop: 'deptName',
              width: '100',
              label: 'spotProj.exposure.list.deptName'
            },
            {
              prop: 'customerName',
              width: '100',
              label: 'spotProj.exposure.list.customerName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'spotProj.exposure.list.productName'
            },
            {
              prop: 'documentQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.documentQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'rawQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.rawQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'pricieType',
              align: 'center',
              width: '100',
              label: 'spotProj.exposure.list.priceType',
              format: {
                dict: this.$t('datadict.priceType')
              }
            },
            {
              prop: 'startDate',
              label: 'spotProj.exposure.list.startDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              label: 'spotProj.exposure.list.endDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'price',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.price',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'currencyName',
              width: '100',
              label: 'spotProj.exposure.list.currencyName'
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
