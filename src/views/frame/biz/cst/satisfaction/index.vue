<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    <selectDialog v-if="dialogVisible" :templateType="'2'" @close="dialogClose" @confirm="dialogConfirm"></selectDialog>
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
            label: 'cst.satisfaction.form.templateName',
            prop: 'templateCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_TEMPLATE',
              clearable: true,
              params: {
                usingFlag: '1',
                templateType: '2'
              }
            }
          },
          {
            label: 'cst.satisfaction.form.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/cust/custSatisfaction/list',
          doDelete: '/api/cust/custSatisfaction/remove'
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
                name: 'satisfactionEdit',
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
                name: 'satisfactionView',
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
              label: 'cst.satisfaction.list.templateName'
            },
            {
              prop: 'custName',
              width: '200',
              label: 'cst.satisfaction.list.custName'
            },
            {
              prop: 'executeName',
              width: '200',
              label: 'cst.satisfaction.list.executeName'
            },
            {
              prop: 'makeDate',
              width: '200',
              label: 'cst.satisfaction.list.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'productType',
              width: '200',
              label: 'cst.satisfaction.list.productType'
            },
            {
              prop: 'evaluationProduct',
              width: '200',
              label: 'cst.satisfaction.list.evaluationProduct'
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
        name: 'satisfactionAdd',
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
