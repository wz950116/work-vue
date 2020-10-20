<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'productItem',
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
            productName: '',
            productGroupName: '',
            productGroupCode: '',
            productKeyAttr01: '',
            productKeyAttr02: '',
            productKeyAttr03: '',
            productKeyAttr04: '',
            productKeyAttr05: '',
            productKeyAttr06: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'data.productItem.form.productName',
            prop: 'productName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.productItem.form.productGroupName',
            prop: 'productGroupCode',
            element: 'tree-group',
            component: () => import('../productGroup/TreeProductGroup'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.brand',
            prop: 'brand',
            element: 'input-validate',
            isShow: this.$store.state.user.showGoodCols.includes('brand'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.spec',
            prop: 'spec',
            isShow: this.$store.state.user.showGoodCols.includes('spec'),
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.origin',
            prop: 'origin',
            isShow: this.$store.state.user.showGoodCols.includes('origin'),
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.productKeyAttr01',
            prop: 'productKeyAttr01',
            isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr01'),
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.productKeyAttr02',
            prop: 'productKeyAttr02',
            isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr02'),
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.productKeyAttr03',
            prop: 'productKeyAttr03',
            isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr03'),
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/dd/productItem/list',
          doDelete: '/api/dd/productItem/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/frame/biz/data/productItem/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productItemCode
            },
            component: () => import('@/views/frame/biz/data/productItem/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productItemCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.productItemCode
            },
            component: () => import('@/views/frame/biz/data/productItem/editForm.vue')
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
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '现货物资') // 现货物资：模板文件的sheet名
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '现货物资', '/api/dd/productItem/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'productGroupName',
              width: '100',
              align: 'center',
              label: 'data.productItem.list.productGroupName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'data.productItem.list.productName'
            },
            {
              prop: 'productUnitCode',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'data.productItem.list.productUnitCode'
            },
            {
              prop: 'measurementUnitCode',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'data.productItem.list.measurementUnitCode'
            },
            {
              prop: 'brand',
              width: '180',
              label: 'goods.brand',
              isShow: this.$store.state.user.showGoodCols.includes('brand')
            },
            {
              prop: 'spec',
              width: '180',
              label: 'goods.spec',
              isShow: this.$store.state.user.showGoodCols.includes('spec')
            },
            {
              prop: 'origin',
              width: '120',
              label: 'goods.origin',
              isShow: this.$store.state.user.showGoodCols.includes('origin')
            },
            {
              prop: 'productKeyAttr01',
              width: '180',
              label: 'goods.productKeyAttr01',
              isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr01')
            },
            {
              prop: 'productKeyAttr02',
              width: '180',
              label: 'goods.productKeyAttr02',
              isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr02')
            },
            {
              prop: 'productKeyAttr03',
              width: '180',
              label: 'goods.productKeyAttr03',
              isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr03')
            },
            {
              prop: 'allocationType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.allocationType')
              },
              label: 'data.productItem.list.allocationType'
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
