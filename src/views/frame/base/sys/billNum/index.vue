<template>
  <qm-tree-form-table :treeTableData='treeTableData' ref='qmTreeFormTable'></qm-tree-form-table>
</template>

<script>
// axios访问
export default {
  name: 'billNumManage',
  data() {
    return {
      treeTableData: {
        form: {
          treeName: '业务功能列表',
          leftWidth: 260,
          isSearch:true,
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
            search: '/api/sys/billNumDef/list'
          },
          apiData: {
            search(node) {
              return { name: node['cname'], moduleCode: node['code'] }
            }
          },
          isTopBar: true,

          topBar: [
            {
              name: 'update',
              type: 'dialog',
              getParam: () => {
                return this.$refs.qmTreeFormTable.currentRow
              },
              component: () => import('@/views/frame/base/sys/billNum/edit.vue')
            },
            {
              name: 'refresh'
            }
          ],
          table: {
            cols: [
              // {
              //   prop: 'moduleCode',
              //   width: '100',
              //   label: 'sys.bill.moduleCode'
              // },
              {
                prop: 'name',
                width: '200',
                label: 'sys.bill.name'
              },
              {
                prop: 'numMark',
                width: '200',
                label: 'sys.bill.numMark'
              },
              {
                prop: 'numLength',
                width: '100',
                label: 'sys.bill.numLength'
              },
              {
                prop: 'numMode',
                width: '100',
                format: {
                  dict: this.$t('datadict.billCodeMode')
                },
                label: 'sys.bill.numMode'
              },
              {
                prop: 'numDescribe',
                width: '220',
                label: 'sys.bill.numDescribe'
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
