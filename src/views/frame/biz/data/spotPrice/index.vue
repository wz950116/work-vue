<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    <importDialog v-if="dialogVisible" @close="handleClose"></importDialog>
    <trendChart v-if="chartVisible" :priceItemCode="priceItemCode" @close="chartClose"></trendChart>
  </div>
</template>

<script>
import importDialog from '@/views/frame/biz/data/spotPrice/importDialog'
import trendChart from '@/views/frame/biz/data/spotPrice/trendChart'
import excelUtil from '@/utils/frame/base/excelUtil.js'

// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'spotPrice',
  components: {
    importDialog,
    trendChart
  },
  data() {
    return {
      dialogVisible: false,
      chartVisible: false,
      priceItemCode: '',
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
            priceItemTypeList: ['1', '4']
          },
          defaultSortString: 'pricingDate.desc,priceItemName.desc'
        },
        formData: [
          {
            label: 'data.spotPrice.form.priceItemName',
            prop: 'priceItemCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRICE_ITEM',
              clearable: true,
              params: {
                usingFlag: '1',
                priceItemTypeList: '1,4'
              }
            }
          },
          {
            type: 'date',
            label: 'data.spotPrice.form.pricingDate',
            props: ['pricingDateStart', 'pricingDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/dd/spot/price/list',
          doDelete: '/api/dd/spot/price/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/spotPrice/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/spotPrice/editForm.vue')
          },
          {
            name: 'remove'
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/spotPrice/editForm.vue')
          },
          {
            name: 'export'
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '现货行情') // 现货行情：模板文件的sheet名
          },
          {
            name: 'import',
            type: 'dialog',
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            event: this.import
          },
          {
            name: 'refresh'
          },
          {
            name: 'trendChart',
            i18n: 'biz.btn.trendChart',
            iconName: '线性-红冲',
            event: this.trendChart
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'priceItemName',
              label: 'data.spotPrice.list.priceItemName',
              width: '160'
            },
            {
              prop: 'pricingDate',
              label: 'data.spotPrice.list.pricingDate',
              align: 'center',
              width: '150',
              format: {
                func: 'dateFormat'
              }
            },
            {
              prop: 'price',
              label: 'data.spotPrice.list.price',
              width: '150',
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
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
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
