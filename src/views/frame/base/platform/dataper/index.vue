<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!--     <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
export default {
  name: 'dataperManage',
  data() {
    return {
      dialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          defaultSortString: 'createDate.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            name: '',
            usingFlag: ''
          }
        },

        formData: [
          {
            label: 'platform.dataper.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'platform.dataper.code',
            prop: 'code',
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
          search: '/api/platform/cfgDataper/list',
          // 删除
          doDelete: '/api/platform/cfgDataper/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            opType: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/platform/dataper/edit.vue')
          },
          {
            name: 'update',
            opType: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('@/views/frame/base/platform/dataper/edit.vue')
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
        initSearch: true,
        table: {
          id: this.$route.meta.title,
          sortable: true,
          cols: [
            {
              prop: 'name',
              width: '150',
              label: 'platform.dataper.name'
            },
            {
              prop: 'code',
              width: '200',
              label: 'platform.dataper.code'
            },
            {
              prop: 'usingFlag',
              align: 'center',
              width: '100',
              label: 'platform.dataper.usingFlag',
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
  },
  components: {},
  methods: {}
}
</script>

