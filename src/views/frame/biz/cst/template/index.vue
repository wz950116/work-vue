<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'template',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            dictName: '',
            dictCode: '',
            usingFlag: ''
          },
          defaultSortString: 'templateCode.asc'
        },
        formData: [
          {
            label: 'cst.template.form.templateCode',
            prop: 'templateCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.template.form.templateName',
            prop: 'templateName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.template.form.templateType',
            prop: 'templateType',
            element: 'base-select',
            list: this.$t('datadict.templateType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.template.form.usingFlag',
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
          search: '/api/cust/custTemplate/list',
          doDelete: '/api/cust/custTemplate/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue'),
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.templateCode
            }
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.templateCode
            }
          },
          {
            name: 'detailSet',
            type: 'route',
            routeInfo() {
              const row = this.$refs.qmTable.currentRow
              return {
                name: 'custTemplateDetail',
                params: {
                  back: 'custTemplate',
                  opType: 'detailSet',
                  templateCode: row.templateCode
                }
              }
            },
            $refs: this.$refs
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
        initSearch: true,
        isColset: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'templateCode',
              width: '200',
              label: 'cst.template.form.templateCode'
            },
            {
              prop: 'templateName',
              width: '300',
              label: 'cst.template.form.templateName'
            },
            {
              prop: 'templateType',
              width: '100',
              align: 'center',
              label: 'cst.template.form.templateType',
              format: {
                dict: this.$t('datadict.templateType')
              }
            },
            {
              prop: 'usingFlag',
              label: 'cst.template.form.usingFlag',
              width: '100',
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
  }
}
</script>
