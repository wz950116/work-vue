<template>
  <qm-tree-form-table :treeTableData='treeTableData' ref='qmTreeFormTable'></qm-tree-form-table>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'billGoodsCol',
  data() {
    return {
      moduleCode: '',
      treeTableData: {
        form: {
          listQuery: {
            isPage: false,
            current: 1,
            size: 20,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          },
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
          },
          handleNodeClick: this.handleNodeClick
        },

        mainData: {
          initSearch: false,
          api: {
            search: '/api/sys/sysBillGoodsCol/list',
            doDelete: '/api/sys/sysBillGoodsCol/clear'
          },
          apiData: {
            search(node) {
              return { moduleCode: node['code'] }
            }
          },
          isTopBar: true,

          topBar: [
            {
              name: 'init',
              i18n: 'biz.btn.init',
              iconName: '线性-设置',
              event: this.initApi
            },
            {
              name: 'update',
              type: 'dialog',
              getParam: () => {
                return this.$refs.qmTreeFormTable.currentRow
              },
              component: () => import('@/views/frame/base/sys/billGoodsCol/dialog.vue')
            },
            {
              name: 'clear',
              iconName: '线性-清除',
              i18n: 'biz.btn.clear',
              event: this.doClear
            },
            {
              name: 'refresh'
            }
          ],
          table: {
            showIndex: true,
            cols: [
              {
                prop: 'columnName',
                width: '180',
                label: 'sys.goodsCol.columnName'
              },
              {
                prop: 'usingFlag',
                width: '80',
                label: 'biz.lbl.usingFlag',
                format: {
                  dict: this.$t('datadict.usingFlag')
                }
              },
              {
                prop: 'columnDatatype',
                width: '150',
                label: 'sys.goodsCol.columnDatatype'
              },
              {
                prop: 'columnTxt',
                width: '120',
                label: 'sys.goodsCol.columnTxt'
              },
              {
                prop: 'columnTxtEn',
                width: '120',
                label: 'sys.goodsCol.columnTxtEn'
              },
              {
                prop: 'columnFormat',
                width: '200',
                label: 'sys.goodsCol.columnFormat',
                format: {
                  dict: this.$t('datadict.numFormat')
                }
              },
              {
                prop: 'columnWidth',
                width: '100',
                label: 'sys.goodsCol.columnWidth'
              },
              {
                prop: 'orderNum',
                width: '80',
                label: 'sys.goodsCol.orderNum'
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
  methods: {
    doClear() {
      this.$confirm('确认要进行数据清空', this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.loading = true
          request({
            url: '/api/sys/sysBillGoodsCol/clear',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.init'),
              data: {
                moduleCode: this.moduleCode
              }
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: '清空成功' }))
              this.loading = false
              this.$refs.qmTreeFormTable.refresh()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    initApi() {
      if (!this.moduleCode) {
        this.$notify(notifyInfo({ msg: '请选择业务节点' }))
        return
      }
      this.$confirm('确认要进行数据初始化', this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.loading = true
          request({
            url: '/api/sys/sysBillGoodsCol/init',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.init'),
              data: {
                moduleCode: this.moduleCode
              }
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: '初始化成功' }))
              this.loading = false
              this.$refs.qmTreeFormTable.refresh()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    handleNodeClick(node) {
      this.moduleCode = node.code
      if (!node.children && !this.treeTableData.form.showCheckbox && node) {
        this.loading = true
        request({
          url: this.treeTableData.mainData.api.search,
          method: 'POST',
          data: {
            ...this.treeTableData.form.listQuery,
            data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(node)) || node
          }
        })
          .then(response => {
            this.loading = false
            this.$refs.qmTreeFormTable.tableData = response.data
            this.$refs.qmTreeFormTable.total = response.total
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
