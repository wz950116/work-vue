<template>
  <qm-tree-form-table :treeTableData='treeTableData' ref='qmTreeFormTable'></qm-tree-form-table>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'billPrint',
  data() {
    return {
      treeTableData: {
        form: {
          initSearch: true,
          expandAll: true,
          treeName: '业务功能列表',
          leftWidth: 260,
          isSearch: true,
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
          },
          handleNodeClick: this.handleNodeClick
        },

        mainData: {
          initSearch: false,
          api: {
            search: '/api/sys/sysBillPrint/list',
            doDelete: '/api/sys/sysBillPrint/remove'
          },
          apiData: {
            search(node) {
              return { moduleCode: node['code'] }
            }
          },
          isTopBar: true,

          topBar: [
            {
              name: 'add',
              type: 'dialog',
              getParam: () => {
                const node = this.$refs.qmTreeFormTable.getCurrentNode()
                if (node && !node.children) {
                  return { moduleCode: node.code }
                }
              },
              component: () => import('@/views/frame/base/sys/billPrint/dialog.vue')
            },
            {
              name: 'update',
              type: 'dialog',
              getParam: () => {
                return this.$refs.qmTreeFormTable.currentRow
              },
              component: () => import('@/views/frame/base/sys/billPrint/dialog.vue')
            },
            {
              name: 'remove',
              getParam: () => {
                return this.$refs.qmTreeFormTable.currentRow.id
              }
            },
            {
              name: 'refresh'
            }
          ],
          table: {
            cols: [
              {
                prop: 'printName',
                width: '200',
                label: 'sys.billPrint.list.printName'
              },
              // {
              //   prop: 'moduleCode',
              //   width: '100',
              //   label: 'sys.billPrint.list.moduleCode'
              // },
              {
                prop: 'printDefault',
                width: '80',
                align: 'center',
                format: {
                  dict: this.$t('datadict.yesNo')
                },
                label: 'sys.billPrint.list.printDefault'
              },
              {
                prop: 'printJsppath',
                label: 'sys.billPrint.list.printJsppath'
              },
              {
                prop: 'remark',
                width: '320',
                label: 'sys.billPrint.list.remark'
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
    }
  },
  methods: {
    handleNodeClick(node) {
      if (!node.children && !this.treeTableData.form.showCheckbox && node) {
        this.loading = true
        request({
          url: this.treeTableData.mainData.api.search,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(node)) || node
          }
        })
          .then(response => {
            this.loading = false
            this.$refs.qmTreeFormTable.tableData = response.data
            if (this.$refs.qmTreeFormTable.tableData && this.$refs.qmTreeFormTable.tableData.length > 0) {
              this.$refs.qmTreeFormTable.emptyTextVisible = false
            } else {
              this.$refs.qmTreeFormTable.emptyTextVisible = true
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
