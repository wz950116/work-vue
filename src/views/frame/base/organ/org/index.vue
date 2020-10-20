<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'orgManage',
  data() {
    return {
      form: {
        moreShowFlg: false,
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          defaultSortString: 'code.asc',
          data: {
            usingFlag: ''
          }
        },
        formData: [
          {
            prop: 'name',
            label: 'func.org.organName',
            element: 'input-validate',
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
          search: '/api/func/org/list',
          doDelete: '/api/func/org/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            getParam: () => {
              if (this.$refs.qmTable.currentRow) {
                return this.$refs.qmTable.currentRow.code
              } else {
                return ''
              }
            },
            component: () => import('@/views/frame/base/organ/org/edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            component: () => import('@/views/frame/base/organ/org/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('@/views/frame/base/organ/org/edit.vue')
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + 'ff',
          rowKey: 'code',
          expandAll: true,
          sortable: true,
          cols: [
            {
              prop: 'code',
              label: 'func.org.organCode',
              width: 200
            },
            {
              prop: 'name',
              label: 'func.org.organName',
              width: 260
            },
            {
              label: 'func.org.organAbbr',
              prop: 'abbr',
              width: 160
            },
            {
              prop: 'usingFlag',
              label: 'biz.lbl.usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              width: 80
            },
            {
              prop: 'title',
              label: 'func.org.title',
              width: 160
            },
            {
              prop: 'address',
              label: 'func.org.address',
              width: 160
            },
            {
              prop: 'zipCode',
              label: 'func.org.zipCode',
              width: 100
            },
            {
              prop: 'phone',
              label: 'func.org.phone',
              width: 100
            },
            {
              prop: 'fax',
              label: 'func.org.fax',
              width: 100
            },
            {
              prop: 'legalRepresentative',
              label: 'func.org.legalRepresentative',
              width: 80
            },
            {
              prop: 'principal',
              label: 'func.org.principal',
              width: 80
            },
            {
              prop: 'taxNumber',
              label: 'func.org.taxNumber',
              width: 120
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>

