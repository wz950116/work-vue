<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'futuresVarieties',
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
            futuresVarietiesType: '',
            exchangeName: '',
            futuresVarietiesCode: '',
            futuresVarietiesName: '',
            usingFlag: ''
          },
          defaultSortString: 'usingFlag.desc,createDate.desc'
        },
        formData: [
          {
            label: 'dataHq.futuresVarieties.exchangeName',
            prop: 'exchangeCode',
            element: 'base-select',
            attrs: {
              data: 'EXCHANGE',
              params: {
                usingFlag: '1' // 启用状态
              },
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresVarieties.futuresVarietiesCode',
            prop: 'futuresVarietiesCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresVarieties.futuresVarietiesName',
            prop: 'futuresVarietiesName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.futuresVarieties.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/dd/futuresVarieties/list',
          doDelete: '/api/dd/futuresVarieties/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/frame/base/data/derivatives/futuresVarieties/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/futuresVarieties/edit.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
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
            component: () => import('@/views/frame/base/data/derivatives/futuresVarieties/edit.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'futuresVarieties',
          cols: [
            {
              prop: 'futuresVarietiesType',
              align: 'center',
              label: 'dataHq.futuresVarieties.futuresVarietiesType',
              format: {
                dict: this.$t('datadict.exchangeType')
              }
            },
            {
              prop: 'exchangeName',
              label: 'dataHq.futuresVarieties.exchangeName'
            },
            {
              prop: 'futuresVarietiesCode',
              label: 'dataHq.futuresVarieties.futuresVarietiesCode'
            },
            {
              prop: 'futuresVarietiesName',
              label: 'dataHq.futuresVarieties.futuresVarietiesName'
            },
            {
              prop: 'contractMultiplier',
              align: 'right',
              label: 'dataHq.futuresVarieties.contractMultiplier',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              prop: 'unit',
              align: 'center',
              label: 'dataHq.futuresVarieties.unit',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              prop: 'tickSize',
              label: 'dataHq.futuresVarieties.tickSize',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              prop: 'minDeliveryUnit',
              label: 'dataHq.futuresVarieties.minDeliveryUnit'
            },
            {
              prop: 'deliveryDate',
              align: 'center',
              label: 'dataHq.futuresVarieties.deliveryDate'
            },
            {
              prop: 'dataAttr',
              align: 'center',
              format: {
                dict: this.$t('datadict.dataAttr')
              },
              label: 'dataHq.futuresVarieties.dataAttr'
            },
            {
              prop: 'currencyName',
              label: 'dataHq.futuresVarieties.currencyCode',
              width: '120'
            },
            {
              prop: 'usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.futuresVarieties.usingFlag'
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
