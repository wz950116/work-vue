<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    <selectDialog v-if="dialogVisible" :templateType="'1'" @close="dialogClose" @confirm="dialogConfirm"></selectDialog>
  </div>
</template>

<script>
import selectDialog from '@/views/frame/biz/cst/components/customDialog'

export default {
  name: 'satisfaction',
  components: {
    selectDialog
  },
  data() {
    return {
      dialogVisible: false,
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
          defaultSortString: 'makeDate.desc'
        },
        formData: [
          {
            label: 'cst.evaluation.form.templateName',
            prop: 'templateCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_TEMPLATE',
              clearable: true,
              params: {
                usingFlag: '1',
                templateType: '1'
              }
            }
          },
          {
            label: 'cst.evaluation.form.custName',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'cst.evaluation.form.makeDate',
            props: ['makeDateStart', 'makeDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: ['', '']
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/cust/custEvaluation/list',
          doDelete: '/api/cust/custEvaluation/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            $refs: this.$refs,
            event: this.openDialog
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(row) {
              return {
                name: 'evaluationEdit',
                params: {
                  type: 'update',
                  templateCode: row.templateCode,
                  id: row.id
                }
              }
            }
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
            type: 'route',
            routeInfo(row) {
              return {
                name: 'evaluationView',
                params: {
                  type: 'view',
                  templateCode: row.templateCode,
                  id: row.id
                }
              }
            }
          },
          {
            name: 'refresh',
            $refs: this.$refs
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                templateCode: currentRow.templateCode
              }
            }
          }
        ],
        initSearch: true,
        isColset: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'templateName',
              width: '200',
              label: 'cst.evaluation.list.templateName'
            },
            {
              prop: 'custName',
              width: '200',
              label: 'cst.evaluation.list.custName'
            },
            {
              prop: 'executeName',
              width: '200',
              label: 'cst.evaluation.list.executeName'
            },
            {
              prop: 'makeDate',
              width: '200',
              label: 'cst.evaluation.list.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'productType',
              width: '200',
              label: 'cst.evaluation.list.productType'
            },
            {
              prop: 'evaluationProduct',
              width: '200',
              label: 'cst.evaluation.list.evaluationProduct'
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
    openDialog() {
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
      this.$refs.qmTable.getList()
    },
    dialogConfirm(val) {
      this.$router.push({
        name: 'evaluationAdd',
        params: {
          type: 'add',
          data: val,
          templateCode: val.templateCode,
          evaluationProduct: val.evaluationProduct
        }
      })
      this.dialogVisible = false
      this.$refs.qmTable.getList()
    }
  }
}
</script>
