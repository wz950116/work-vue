<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'

export default {
  name: 'optionContract',
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
            optionContractName: '',
            optionContractCode: '',
            underlyingType: ''
          },
          sortString: 'optionContractCode.desc'
        },
        formData: [
          {
            label: 'dataHq.optionVarieties.form.underlyingType',
            prop: 'underlyingType',
            element: 'base-select',
            list: this.$t('datadict.underlyingType'),
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'dataHq.optionContract.form.optionContractCode',
            prop: 'optionContractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'dataHq.optionContract.form.exchangeCode',
            prop: 'exchangeCode',
            element: 'base-select',
            attrs: {
              data: 'EXCHANGE',
              clearable: true,
              params: {
                usingFlag: '1'
              }
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/data/ddOptionContract/page',
          doDelete: '/api/data/ddOptionContract/remove'
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
            component: () => import('@/views/proj/base/data/optionContract/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/optionContract/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam(currentRow) {
              return this.$refs.qmTable.currentRow.optionContractCode
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/optionContract/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
          // {
          //   iconName: '线性-附件',
          //   i18n: 'biz.btn.downloadTemplate',
          //   permitName: ['import'],
          //   $refs: this.$refs,
          //   event: excelUtil.downloadTemplate(this, '期权品种')
          // },
          // {
          //   iconName: '线性-附件',
          //   i18n: 'biz.btn.upload',
          //   permitName: ['import'],
          //   $refs: this.$refs,
          //   event: excelUtil.uploadExcel(this, '期权品种', '/api/warehouse/whBeginData/uploadExcel')
          // }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'optionContractCode',
              label: 'dataHq.optionContract.list.optionContractCode',
              width: '200'
            },
            {
              prop: 'optionContractName',
              label: 'dataHq.optionContract.list.optionContractName',
              width: '200'
            },
            {
              prop: 'underlyingType',
              label: 'dataHq.optionContract.list.underlyingType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.underlyingType')
              }
            },
            {
              prop: 'underlyingProductName',
              label: 'dataHq.optionContract.list.underlyingProductName',
              width: '200'
            },
            {
              prop: 'optionVarietiesName',
              label: 'dataHq.optionContract.list.optionVarietiesName',
              width: '200'
            },
            {
              prop: 'exchangeName',
              label: 'dataHq.optionContract.list.exchangeName',
              width: '200'
            },
            {
              prop: 'strikePrice',
              label: 'dataHq.optionContract.list.strikePrice',
              align: 'right',
              width: '100',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'callPut',
              label: 'dataHq.optionContract.list.callPut',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.callPut')
              }
            },
            {
              prop: 'combinationType',
              label: 'dataHq.optionContract.list.combinationType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.combinationType')
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
              prop: 'contractMultiplier',
              label: 'dataHq.optionVarieties.list.contractMultiplier',
              align: 'right',
              width: '100',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'currencyName',
              label: 'dataHq.optionContract.list.currencyName',
              width: '100'
            },
            {
              prop: 'dataAttr',
              label: 'dataHq.optionContract.list.dataAttr',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.dataAttr')
              }
            },
            {
              prop: 'usingFlag',
              label: 'dataHq.optionContract.list.usingFlag',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
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
  methods: {}
}
</script>
