<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'spotMarket',
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
            marketName: '',
            marketType: '',
            marketLevel: '',
            usingFlag: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'data.spotMarket.form.marketName',
            prop: 'marketName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.spotMarket.form.marketType',
            prop: 'marketType',
            element: 'base-select',
            list: this.$t('datadict.marketType'),
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'data.spotMarket.form.marketLevel',
            prop: 'marketLevel',
            element: 'base-select',
            list: this.$t('datadict.marketLevel'),
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'data.spotMarket.form.usingFlag',
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
          search: '/api/dd/spot/market/list',
          doDelete: '/api/dd/spot/market/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/spotMarket/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/spotMarket/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.marketCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/spotMarket/editForm.vue')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'marketCode',
              width: '180',
              label: 'data.spotMarket.list.marketCode'
            },
            {
              prop: 'marketName',
              width: '280',
              label: 'data.spotMarket.list.marketName'
            },
            // {
            //   prop: 'marketType',
            //   align: 'center',
            //   width: '100',
            //   format: {
            //     dict: this.$t('datadict.marketType')
            //   },
            //   isShow: false,
            //   label: 'data.spotMarket.list.marketType'
            // },
            // {
            //   prop: 'marketLevel',
            //   align: 'center',
            //   width: '100',
            //   format: {
            //     dict: this.$t('datadict.marketLevel')
            //   },
            //   isShow: false,
            //   label: 'data.spotMarket.list.marketLevel'
            // },
            {
              prop: 'usingFlag',
              align: 'center',
              width: '100',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.spotMarket.list.usingFlag'
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
