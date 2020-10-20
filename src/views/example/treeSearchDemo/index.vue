<template>
  <qm-tree-form-table :treeTableData='treeTableData'></qm-tree-form-table>
</template>

<script>
export default {
  data() {
    return {
      treeTableData: {
        form: {
          api: {
            getTreeList: ''
          },
          apiData: {
            getTreeList() {
              return ''
            }
          },
          initSearch: true,
          treeName: '树查询名称',
          isTopBar: true,
          topBar: [{
            name: 'clear',
            iconName: '线性-清除',
            i18n: 'biz.btn.clear'
          }, {
            name: 'clear',
            iconName: '线性-清除',
            i18n: 'biz.btn.clear'
          }, {
            name: 'clear',
            iconName: '线性-清除',
            i18n: 'biz.btn.clear'
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          isSearch: true
        },

        mainData: {
          api: {
            search: '/api/dd/productCategory/list',
            doDelete: '/api/dd/productCategory/remove'
          },
          apiData: 'code',
          initSearch: false,
          isTopBar: true,
          topBar: [{
            name: 'add',
            type: 'dialog',
            component: () =>
              import('@/views/example/indexDemo/dialog.vue')
          }, {
            name: 'remove',
            validate: () => {
              return this.$refs.qmTable && this.$refs.qmTable.currentRow && this.$refs.qmTable.currentRow.usingFlag === '1'
            }
          }, {
            name: 'view',
            type: 'route',
            routeInfo() {
              return {
                name: 'editTagDemo',
                params: {
                  type: 'view'
                }
              }
            },
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            isShow: {
              label: 'usingFlag',
              value: ['1']
            }
          }, {
            name: 'update',
            isShow: {
              label: 'usingFlag',
              value: ['1']
            }
          }, {
            name: 'export'
          }, {
            name: 'refresh'
          }, {
            name: 'defined',
            iconName: '线性-查看',
            i18n: '自定义',
            event: this.onDefined
          }],

          table: {
            cols: [{
              prop: 'productCategoryName',
              width: '220',
              label: '商品名称'
            }, {
              prop: 'productCategoryAbbr',
              width: '220',
              label: '商品简称'
            }, {
              prop: 'productCategoryCode',
              width: '220',
              label: '商品编码'
            }, {
              prop: 'attrGroupId',
              width: '220',
              label: '属性组'
            }, {
              prop: 'usingFlag',
              width: '220',
              align: 'center',
              label: '状态',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            }, {
              prop: 'remark',
              minWidth: '500',
              label: '备注'
            }]
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
}
</script>

