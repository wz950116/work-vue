<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'pricingBase',
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
            pricingCode: '',
            pricingName: '',
            usingFlag: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'data.pricingBase.form.pricingName',
            prop: 'pricingName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.pricingBase.form.usingFlag',
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
          search: '/api/dd/pricing/base/list',
          doDelete: '/api/dd/pricing/base/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/pricingBase/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.pricingCode
            },
            component: () => import('@/views/frame/biz/data/pricingBase/editForm.vue'),
            msg: this.$t('当前状态不可修改该条数据'),
            validate(row) {
              return row.usingFlag === '0'
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.pricingCode
            },
            msg: this.$t('biz.msg.deleteTip'),
            validate(row) {
              return row.usingFlag === '0'
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.pricingCode
            },
            component: () => import('@/views/frame/biz/data/pricingBase/editForm.vue')
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
              prop: 'pricingCode',
              width: '160',
              label: 'data.pricingBase.list.pricingCode'
            },
            {
              prop: 'pricingName',
              width: '120',
              label: 'data.pricingBase.list.pricingName'
            },
            {
              prop: 'pricingFormula',
              width: '300',
              label: 'data.pricingBase.list.pricingFormula'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.pricingBase.list.usingFlag'
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
