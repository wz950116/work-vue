<template>
  <qm-tree-form-table :treeTableData='treeTableData' ref='qmTreeFormTable'></qm-tree-form-table>
</template>

<script>
// axios访问
export default {
  name: 'billFileManage',
  data() {
    return {
      treeTableData: {
        form: {
          treeName: '单据列表',
          leftWidth: 260,
          isSearch: true,
          expandOnClickNode: false,
          initSearch: true,
          expandAll: true,
          api: {
            getTreeList: '/api/sys/menu/billMenu'
          },
          apiData: {
            getTreeList() {
              return ''
            }
          },
          defaultProps: {
            children: 'children',
            label: 'cname'
          }
        },

        mainData: {
          initSearch: false,
          api: {
            search: '/api/sys/fileType/list'
          },
          apiData: {
            search(node) {
              return { name: node['cname'], moduleCode: node['code'] }
            }
          },
          isTopBar: true,

          topBar: [
            {
              name: 'add',
              getParam: () => {
                const node = this.$refs.qmTreeFormTable.getCurrentNode()
                if (node) {
                  return {
                    moduleCode: node.code
                  }
                } else {
                  return {}
                }
              },
              type: 'dialog',
              component: () => import('@/views/frame/base/sys/billFile/edit.vue')
            },
            {
              name: 'update',
              type: 'dialog',
              component: () => import('@/views/frame/base/sys/billFile/edit.vue')
            },
            {
              name: 'view',
              allowDblClick: true,
              type: 'dialog',
              component: () => import('@/views/frame/base/sys/billFile/edit.vue')
            },
            {
              name: 'remove',
              getParam: currentRow => {
                return currentRow.fileType
              }
            },
            {
              name: 'refresh'
            }
          ],
          table: {
            cols: [
              {
                prop: 'typeName',
                width: '220',
                label: 'sys.fileType.typeName'
              },
              {
                prop: 'fileType',
                width: '100',
                label: 'sys.fileType.fileType'
              },
              {
                prop: 'required',
                width: '80',
                align: 'center',
                label: 'sys.fileType.required',
                format: {
                  dict: this.$t('datadict.yesNo')
                }
              },
              {
                prop: 'remark',
                label: 'biz.lbl.remark'
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
  },
  methods: {}
}
</script>
