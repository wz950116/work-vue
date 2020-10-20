<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'>
        <!-- isException 此列特殊处理-->
        <template slot='isException' slot-scope='scope'>
          <el-tag size="mini" v-if="scope.row.isException==='1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
          <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
        </template>
      </qm-table>
    </template>
  </div>
</template>
<script>
export default {
  name: 'currency',
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
            currencyName: ''
          },
          defaultSortString: 'currencyCode.desc'
        },
        formData: [
          {
            label: 'dataHq.currency.currencyCode',
            prop: 'currencyCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.currency.currencyName',
            prop: 'currencyName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/dd/currency/list',
          doDelete: '/api/dd/currency/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/data/financial/currency/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/financial/currency/edit.vue')
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
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
          id: 'currencyList',
          cols: [
            {
              prop: 'currencyCode',
              label: 'dataHq.currency.currencyCode'
            },
            {
              prop: 'currencyName',
              label: 'dataHq.currency.currencyName'
            },
            {
              prop: 'currencySymbol',
              label: 'dataHq.currency.currencySymbol'
            },
            {
              prop: 'standardFlag',
              label: 'dataHq.currency.standardFlag',
              format: {
                dict: this.$t('datadict.yesNo')
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
  },
  methods: {},
  components: {}
}
</script>
