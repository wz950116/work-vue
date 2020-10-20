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
  name: 'exchange',
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
            exchangeCode: '',
            exchangeName: '',
            exchangeAbbr: '',
            usingFlag: ''
          },
          defaultSortString: 'usingFlag.desc,createDate.desc'
        },
        formData: [
          {
            label: 'dataHq.exchange.exchangeName',
            prop: 'exchangeName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchange.exchangeAbbr',
            prop: 'exchangeAbbr',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchange.exchangeCode',
            prop: 'exchangeCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchange.usingFlag',
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
          search: '/api/dd/exchange/list',
          doDelete: '/api/dd/exchange/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/derivatives/exchange/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/exchange/edit.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
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

        isColset: false,
        table: {
          id: 'exchangeList',
          cols: [
            {
              prop: 'exchangeName',
              label: 'dataHq.exchange.exchangeName'
            },
            {
              prop: 'exchangeAbbr',
              label: 'dataHq.exchange.exchangeAbbr'
            },
            {
              prop: 'exchangeCode',
              label: 'dataHq.exchange.exchangeCode'
            },
            {
              prop: 'exchangeType',
              width: '100',
              format: {
                dict: this.$t('datadict.exchangeType')
              },
              label: 'dataHq.exchange.exchangeType'
            },
            {
              prop: 'usingFlag',
              width: '100',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.exchange.usingFlag'
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

