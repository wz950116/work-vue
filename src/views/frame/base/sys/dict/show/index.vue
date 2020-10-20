<template>
  <div class="app-container">
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-tree-form-table ref='qmTable' :treeTableData='treeTableData'>
    </qm-tree-form-table>
  </div>
</template>
<script>
export default {
  name: 'dictShowSet',
  data() {
    return {
      treeTableData: {
        form: {
          initSearch: true,
          treeName: this.$t('sys.dict.dictBiz'),
          leftWidth: 260,
          isSearch:true,
          expandAll: true,
          expandOnClickNode: false,
          api: {
            getTreeList: '/api/sys/dictItemShow/tree'
          },
          apiData: {
            getTreeList() {
              return ''
            }
          },
          validate(node) {
            // 只有是页子时才可以点击
            if (node.leafFlag && node.leafFlag === '1') {
              return true
            }
          },
          defaultProps: {
            children: 'children',
            label: 'dictName'
          }
        },
        mainData: {
          api: {
            search: '/api/sys/dictItemShow/list'
          },
          apiData: {
            search(node) {
              return node['code']
            }
          },
          initSearch: true,
          isTopBar: true,
          topBar: [
            {
              name: 'update',
              type: 'dialog',
              component: () => import('./edit.vue')
            }
          ],
          table: {
            showIndex: false,
            sortable: true,
            cols: [
              {
                prop: 'dictItemShowName',
                label: 'sys.dict.snowName',
                width: '200'
              },
              {
                prop: 'showFlag',
                label: 'sys.dict.showFlag',
                align: 'center',
                width: '100',
                format: {
                  dict: this.$t('datadict.showType')
                }
              },
              {
                label: 'biz.lbl.remark',
                sortable: false,
                prop: 'remark',
                width: '300'
              }
            ]
          },
          bottomBar: {
            pagination: {
              show: false
            }
          }
        }
      }
    }
  }
}
</script>

