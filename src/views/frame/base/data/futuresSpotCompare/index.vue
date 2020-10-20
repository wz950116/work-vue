<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>

    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>

<script>
import importDialog from '@/views/frame/base/data/futuresPrice/components/importDialog.vue'

export default {
  name: 'futureSpotCompare',
  components: {
    importDialog
  },
  data() {
    return {
      imoprtDialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractCode: '',
            saveDate: '',
            dataSource: ''
          },
          sortString: 'saveDate.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'data.futuresSpotCompare.form.saveDate',
            prop: 'saveDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'data.futuresSpotCompare.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'data.futuresSpotCompare.form.productOtherName',
            prop: 'productOtherName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/data/ddFsCompare/list',
          doDelete: '/api/data/ddFsCompare/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/data/futuresSpotCompare/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/futuresSpotCompare/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/futuresSpotCompare/editForm.vue')
          },
          {
            name: 'import',
            $refs: this.$refs,
            i18n: 'biz.btn.import',
            iconName: '线性-导入',
            event: this.import
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
              prop: 'saveDate',
              width: '120',
              label: 'data.futuresSpotCompare.list.saveDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'compareType',
              label: 'data.futuresSpotCompare.list.compareType',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.compareType')
              }
            },
            {
              prop: 'productName',
              width: '150',
              label: 'data.futuresSpotCompare.list.productName'
            },
            {
              prop: 'productOtherName',
              width: '150',
              label: 'data.futuresSpotCompare.list.productOtherName'
            },
            {
              prop: 'remark',
              width: '150',
              label: 'data.futuresSpotCompare.list.remark'
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
    }
  }
}
</script>
