<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'feeTypeManage',
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
            currencyCode: '',
            currencyDate: ''
          }
        },
        formData: [
          {
            label: 'data.feeType.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.feeType.currencyCode',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
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
          search: '/api/data/ddFeeType/page',
          doDelete: '/api/data/ddFeeType/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/feeType/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.code
            },
            component: () => import('@/views/frame/biz/data/feeType/editForm.vue')
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.code
            },
            component: () => import('@/views/frame/biz/data/feeType/editForm.vue')
          },
          {
            name: 'remove'
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
            event: excelUtil.downloadTemplate(this, '费用类型') // 现货物资：模板文件的sheet名
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '费用类型', '/api/data/ddFeeType/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'code',
              width: '150',
              align: 'left',
              label: 'data.feeType.code'
            },
            {
              prop: 'name',
              width: '150',
              align: 'left',
              label: 'data.feeType.name'
            },
            {
              prop: 'currency',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              },
              label: 'data.feeType.currencyCode'
            },
            {
              prop: 'rate',
              width: '120',
              align: 'right',
              label: 'data.feeType.rate',
              format: {
                func: 'taxrate'
              }
            },
            {
              prop: 'defaultPrice',
              label: 'data.feeType.defaultPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'price'
              }
            },
            {
              prop: 'usingFlag',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'biz.lbl.usingFlag'
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              minWidth: 200
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
