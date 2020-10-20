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
  name: 'optionVarieties',
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
            optionVarietiesName: '',
            optionVarietiesCode: '',
            underlyingType: ''
          },
          sortString: 'optionVarietiesCode.desc'
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
            label: 'dataHq.optionVarieties.form.optionVarietiesCode',
            prop: 'optionVarietiesCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'dataHq.optionVarieties.form.optionVarietiesName',
            prop: 'optionVarietiesName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/data/ddOptionVarieties/page',
          doDelete: '/api/data/ddOptionVarieties/remove'
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
            component: () => import('@/views/proj/base/data/optionVarieties/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/base/data/optionVarieties/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam(currentRow) {
              return this.$refs.qmTable.currentRow.optionVarietiesCode
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
            component: () => import('@/views/proj/base/data/optionVarieties/editForm.vue')
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
          //   event: excelUtil.uploadExcel(this, '期权品种', '/api/data/ddOptionVarieties/uploadExcel')
          // }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'underlyingType',
              label: 'dataHq.optionVarieties.list.underlyingType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.underlyingType')
              }
            },
            {
              prop: 'optionVarietiesType',
              label: 'dataHq.optionVarieties.list.optionVarietiesType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.optionVarietiesType')
              }
            },
            {
              prop: 'optionVarietiesName',
              label: 'dataHq.optionVarieties.list.optionVarietiesName',
              width: '200'
            },
            {
              prop: 'optionVarietiesCode',
              label: 'dataHq.optionVarieties.list.optionVarietiesCode',
              width: '200'
            },
            {
              prop: 'exchangeName',
              label: 'dataHq.optionVarieties.list.exchangeName',
              width: '200'
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
              label: 'dataHq.optionVarieties.list.currencyCode',
              width: '120'
            },
            {
              prop: 'usingFlag',
              label: 'dataHq.optionVarieties.list.usingFlag',
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
