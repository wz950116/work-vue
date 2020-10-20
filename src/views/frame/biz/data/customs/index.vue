<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'customs',
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
            customsName: '',
            areaName: '',
            usingFlag: ''
          },
          defaultSortString: 'customsName.asc'
        },
        formData: [
          {
            label: 'data.customs.form.customsName',
            prop: 'customsName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.areaName',
            prop: 'areaName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.customs.form.usingFlag',
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
          search: '/api/dd/customs/list',
          doDelete: '/api/dd/customs/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/frame/biz/data/customs/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/customs/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.customsCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/customs/editForm.vue')
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
            event: excelUtil.downloadTemplate(this, '海关档案') // 现货物资：模板文件的sheet名
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '海关档案', '/api/dd/customs/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'customsCode',
              width: '160',
              label: 'data.customs.list.customsCode'
            },
            {
              prop: 'customsName',
              width: '160',
              label: 'data.customs.list.customsName'
            },
            {
              prop: 'areaName',
              width: '160',
              label: 'data.customs.list.areaName'
            },
            {
              prop: 'usingFlag',
              align: 'center',
              width: '100',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.customs.list.usingFlag'
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
