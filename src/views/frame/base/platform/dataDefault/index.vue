<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!-- <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
export default {
  name: 'dataDefault',
  data() {
    return {
      dialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },

        formData: [
          {
            label: '表前缀',
            prop: 'tableName',
            element: 'input-validate',
            default: 'V_TBL,ZM_TBL,RH_TBL',
            placeholder: '多前缀以,分隔',
            attrs: {
              cols: 3,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/dataDefault/page'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'refresh'
          },
          {
            name: 'export'
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: this.$route.meta.title,
          sortable: true,
          cols: [
            {
              prop: 'tableName',
              width: '150',
              label: '表名'
            },
            {
              prop: 'columnName',
              width: '200',
              label: '字段名'
            },
            {
              prop: 'dataType',
              align: 'center',
              width: '100',
              label: '字段类型'
            },
            {
              prop: 'dataDefault',
              align: 'center',
              width: '100',
              label: '默认值'
            },
            {
              prop: 'sql',
              label: 'sql'
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
  components: {},
  methods: {}
}
</script>

