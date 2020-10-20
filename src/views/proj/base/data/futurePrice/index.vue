<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
    <trendChart v-if="chartVisible" :priceItemCode="priceItemCode" @close="chartClose"></trendChart>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import importDialog from '@/views/proj/base/data/futurePrice/importDialog'
import trendChart from '@/views/proj/base/data/futurePrice/trendChart'
export default {
  name: 'futuresPrice',
  components: {
    importDialog,
    trendChart
  },
  data() {
    return {
      priceItemCode: '',
      chartVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            priceItemCode: '',
            pricingDate: '',
            priceItemTypeList: ['3']
          },
          defaultSortString: 'pricingDate.desc'
        },
        formData: [
          {
            label: 'dataHq.futurePrice.form.priceItemCode',
            prop: 'priceItemCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRICE_ITEM',
              clearable: true,
              params: { usingFlag: '1', priceItemTypeList: '3' }
            }
          },
          {
            type: 'date',
            label: 'dataHq.futurePrice.form.pricingDate',
            props: ['pricingDateStart', 'pricingDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          }
        ]
      },
      imoprtDialogVisible: false,
      mainData: {
        initSearch: true,
        api: {
          search: '/api/dd/future/price/list',
          doDelete: '/api/dd/future/price/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/futurePrice/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/futurePrice/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/futurePrice/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          },
          {
            name: 'import',
            $refs: this.$refs,
            i18n: 'biz.btn.import',
            iconName: '线性-导入',
            event: this.import
          },
          {
            name: 'trendChart',
            i18n: 'biz.btn.trendChart',
            iconName: '线性-查看',
            event: this.trendChart
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'priceItemName',
              label: 'dataHq.futurePrice.list.priceItemName',
              width: '200'
            },
            {
              prop: 'pricingDate',
              label: 'dataHq.futurePrice.list.pricingDate',
              align: 'center',
              width: '200',
              format: {
                func: 'dateFormat'
              }
            },
            {
              prop: 'price',
              label: 'dataHq.futurePrice.list.price',
              width: '200',
              align: 'right',
              format: {
                func: 'price'
              }
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
  },
  methods: {
    import() {
      this.imoprtDialogVisible = true
    },
    importDialogClose() {
      this.imoprtDialogVisible = false
      this.$refs.qmTable.getList()
    },
    trendChart() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      var currentRow = this.$refs.qmTable.currentRow
      this.priceItemCode = currentRow.priceItemCode

      this.chartVisible = true
    },
    chartClose() {
      this.chartVisible = false
      this.$refs.qmTable.getList()
    }
  }
}
</script>
