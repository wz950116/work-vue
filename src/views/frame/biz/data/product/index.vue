<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'product',
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
            productCode: '',
            productName: '',
            productGroupName: '',
            productGroupCode: '',
            usingFlag: ''
          },
          defaultSortString: 'productCode.asc'
        },
        formData: [
          {
            label: 'data.product.form.productCode',
            prop: 'productCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.product.form.productName',
            prop: 'productName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.product.form.productGroupName',
            prop: 'productGroupCode',
            element: 'tree-group',
            component: () => import('../productGroup/TreeProductGroup'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.product.form.usingFlag',
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
        api: {
          search: '/api/dd/product/list',
          doDelete: '/api/dd/product/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'ddProductAdd',
                params: {
                  type: 'add',
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'ddProductUpdate',
                params: {
                  type: 'update',
                  back: this.$refs.qmForm.$route.name,
                  productCode: currentRow.productCode
                }
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.productCode
            }
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'ddProductView',
                params: {
                  type: 'view',
                  back: this.$refs.qmForm.$route.name,
                  productCode: currentRow.productCode
                }
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '品名') // 现货物资：模板文件的sheet名
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '品名', '/api/dd/product/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'productCode',
              width: '180',
              label: 'data.product.list.productCode'
            },
            {
              prop: 'productName',
              width: '180',
              label: 'data.product.list.productName'
            },
            {
              prop: 'productGroupName',
              width: '100',
              align: 'center',
              label: 'data.product.list.productGroupName'
            },
            {
              prop: 'productUnitCode',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'data.product.list.productUnitCode'
            },
            {
              prop: 'measurementUnitCode',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'data.product.list.measurementUnitCode'
            },
            {
              prop: 'priceItemName',
              width: '180',
              label: 'data.product.list.priceItemName'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.product.list.usingFlag'
            },
            {
              prop: 'costCalArgument',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.costCalArgument')
              },
              label: 'data.product.list.costCalArgument'
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
